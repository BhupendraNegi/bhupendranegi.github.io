#!/usr/bin/env node
//
// Generates _data/icons.json — the inline SVG bodies for every icon the site
// uses — so icons render at build time with no runtime icon script or font.
//
//   Lucide (UI icons)      -> {% include icon.html name="search" class="site-icon" %}
//   Devicon (tech logos)   -> {% include tech-icon.html name="rails-plain" %}
//
// Sources are the pinned `lucide-static` and `devicon` devDependencies. Only
// icons that are actually referenced are emitted. Names are discovered from:
//
//   - literal include calls in templates, pages and posts
//   - Liquid fallbacks such as `assign sec_icon = 'user'` / `default: 'dot'`
//   - icon('name') calls in assets/js (rendered into <template id="site-icons">)
//   - data: _data/uses.yml, _data/skills.yml, _data/projects.yml
//   - post front matter: icon: (Lucide), tech: / techs: (Devicon)
//
// Run `npm run icons:build` after introducing a new icon name. An unknown name
// fails this script; a name this script could not discover renders with a
// data-icon-missing attribute, which ./bin/lint reports.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as loadYaml } from 'js-yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const lucideDir = join(root, 'node_modules/lucide-static/icons');
const deviconDir = join(root, 'node_modules/devicon');
const outFile = join(root, '_data/icons.json');

const read = (path) => readFileSync(join(root, path), 'utf8');

function walk(dir, extensions, found = []) {
  const absolute = join(root, dir);

  if (!existsSync(absolute)) {
    return found;
  }

  for (const entry of readdirSync(absolute)) {
    const relative = join(dir, entry);

    if (statSync(join(root, relative)).isDirectory()) {
      walk(relative, extensions, found);
    } else if (extensions.includes(extname(entry))) {
      found.push(relative);
    }
  }

  return found;
}

function frontMatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  return match ? loadYaml(match[1]) || {} : {};
}

// --- Discover the icon names in use ------------------------------------------

const lucideNames = new Set();
const deviconNames = new Set();

const templates = [
  ...walk('_includes', ['.html']),
  ...walk('_layouts', ['.html']),
  ...walk('blog', ['.html']),
  ...walk('_posts', ['.md']),
  ...readdirSync(root).filter((file) => ['.html', '.md'].includes(extname(file))),
];

for (const file of templates) {
  const source = read(file);

  for (const match of source.matchAll(/include icon\.html name="([a-z0-9-]+)"/g)) {
    lucideNames.add(match[1]);
  }

  for (const match of source.matchAll(/include tech-icon\.html name="([a-z0-9-]+)"/g)) {
    deviconNames.add(match[1]);
  }

  // Liquid fallbacks feeding a dynamic icon name, e.g.
  //   {% assign sec_icon = 'user' %}  /  {{ item.lucide | default: 'dot' }}
  for (const match of source.matchAll(/assign \w*icon\w* = (?:[\w.]+ \| default: )?['"]([a-z0-9-]+)['"]/g)) {
    lucideNames.add(match[1]);
  }

  // ...and the same for tech logos, e.g. {% assign tech = "rails-plain" %}
  for (const match of source.matchAll(/assign \w*tech\w* = (?:[\w.]+ \| default: )?['"]([a-z0-9-]+)['"]/g)) {
    deviconNames.add(match[1]);
  }
}

for (const file of walk('assets/js', ['.js'])) {
  for (const match of read(file).matchAll(/\bicon\('([a-z0-9-]+)'/g)) {
    lucideNames.add(match[1]);
  }
}

for (const file of walk('_posts', ['.md'])) {
  const meta = frontMatter(read(file));

  if (meta.icon) {
    lucideNames.add(meta.icon);
  }

  for (const tech of [meta.tech, ...(meta.techs || [])].filter(Boolean)) {
    deviconNames.add(tech);
  }
}

for (const group of loadYaml(read('_data/uses.yml')) || []) {
  if (group.icon) {
    lucideNames.add(group.icon);
  }

  for (const item of group.items || []) {
    if (item.icon) {
      deviconNames.add(item.icon);
    }

    if (item.lucide) {
      lucideNames.add(item.lucide);
    }
  }
}

for (const group of loadYaml(read('_data/skills.yml')) || []) {
  for (const skill of group.skills || []) {
    if (skill.class) {
      deviconNames.add(skill.class);
    }
  }
}

for (const project of loadYaml(read('_data/projects.yml')) || []) {
  for (const tech of project.technologies || []) {
    deviconNames.add(tech);
  }
}

// --- Extract the SVG bodies --------------------------------------------------

const errors = [];

// Returns the markup between the outer <svg> tags. Icons come from pinned
// packages, but they are inlined into every page, so anything that is not
// plain drawing markup is rejected outright rather than stripped (stripping
// with regexes is easy to get wrong).
function innerSvg(svg, label) {
  const open = svg.indexOf('<svg');
  const start = open === -1 ? -1 : svg.indexOf('>', open);
  const end = svg.lastIndexOf('</svg>');

  if (start === -1 || end === -1 || end < start) {
    errors.push(`${label} is not a well-formed SVG file`);
    return null;
  }

  const body = svg
    .slice(start + 1, end)
    .replace(/\s*\n\s*/g, '')
    .replace(/\s+\/>/g, '/>')
    .trim();

  const forbidden = ['<!--', '<script', '<style', '<foreignObject', '<iframe', 'javascript:', ' on'].find((token) =>
    token === ' on' ? /\son[a-z]+\s*=/i.test(body) : body.toLowerCase().includes(token.toLowerCase())
  );

  if (forbidden) {
    errors.push(`${label} contains unsupported markup (${forbidden.trim()})`);
    return null;
  }

  return body;
}

function lucideIcon(name) {
  const file = join(lucideDir, `${name}.svg`);

  if (!existsSync(file)) {
    errors.push(`Lucide icon "${name}" does not exist in lucide-static`);
    return null;
  }

  return innerSvg(readFileSync(file, 'utf8'), `Lucide icon "${name}"`);
}

const deviconIndex = JSON.parse(readFileSync(join(deviconDir, 'devicon.json'), 'utf8'));

// "rails-plain" -> icons/rails/rails-plain.svg, following Devicon's aliases
// (e.g. react-plain is an alias of react-original) exactly as its font does.
function deviconIcon(className) {
  const entry = deviconIndex
    .filter((icon) => className.startsWith(`${icon.name}-`))
    .sort((a, b) => b.name.length - a.name.length)[0];

  if (!entry) {
    errors.push(`Devicon "${className}" does not match any Devicon name`);
    return null;
  }

  let version = className.slice(entry.name.length + 1);
  const alias = (entry.aliases || []).find((candidate) => candidate.alias === version);

  if (alias) {
    version = alias.base;
  }

  const file = join(deviconDir, 'icons', entry.name, `${entry.name}-${version}.svg`);

  if (!entry.versions.font.includes(version) || !existsSync(file)) {
    errors.push(`Devicon "${className}" has no "${version}" glyph (font versions: ${entry.versions.font.join(', ')})`);
    return null;
  }

  const svg = readFileSync(file, 'utf8');
  const viewBox = (svg.match(/viewBox="([^"]+)"/) || [])[1] || '0 0 128 128';

  // The icon font flattens every glyph to a single colour; do the same so the
  // logo takes the surrounding text colour (fill="currentColor" on the <svg>).
  const inner = innerSvg(svg, `Devicon "${className}"`);

  if (inner === null) {
    return null;
  }

  const body = inner
    .replace(/\s(?:fill|stroke)="(?!none)[^"]*"/g, '')
    .replace(/\sstyle="[^"]*"/g, '')
    .replace(/\sclass="[^"]*"/g, '');

  if (/url\(#|<image|<linearGradient|<radialGradient|<mask|<clipPath/.test(body)) {
    errors.push(`Devicon "${className}" uses gradients/masks and cannot be flattened to one colour`);
    return null;
  }

  return { viewBox, body };
}

const sorted = (names) => [...names].sort();
const icons = { lucide: {}, devicon: {} };

for (const name of sorted(lucideNames)) {
  const body = lucideIcon(name);

  if (body) {
    icons.lucide[name] = body;
  }
}

for (const name of sorted(deviconNames)) {
  const icon = deviconIcon(name);

  if (icon) {
    icons.devicon[name] = icon;
  }
}

if (errors.length) {
  console.error(`Icon build failed:\n  - ${errors.join('\n  - ')}`);
  process.exit(1);
}

writeFileSync(outFile, `${JSON.stringify(icons, null, 2)}\n`);

console.log(
  `Wrote _data/icons.json — ${Object.keys(icons.lucide).length} Lucide icons, ` +
    `${Object.keys(icons.devicon).length} Devicon logos.`
);
