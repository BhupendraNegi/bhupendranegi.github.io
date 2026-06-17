---
layout: cheatsheet
title: Dev Cheatsheet
description: A practical developer cheatsheet — copy-paste commands for Git, Ruby on Rails, RSpec, Yarn, Docker, Kamal, Lima/Colima, MySQL, and everyday shell work.
subtitle: A no-fluff reference for day-to-day development.
permalink: /cheatsheet/
---

The index on the left lists the top-level sections; each is split into smaller
groups below. Hover any block and hit **Copy**, and replace anything in
`<angle-brackets>` with your own values.

## Git

The everyday loop — branch, commit, rebase, and the occasional rescue.

### Everyday flow

```bash
git clone <repo-url>            # grab a repository
git checkout -b <branch-name>   # create + switch to a branch
git add .                       # stage everything
git commit -m "message"         # commit staged changes
git pull origin main            # update your branch from remote
git push origin <branch-name>   # publish your branch
git status                      # what's changed
git log --oneline --graph       # compact history with a graph
```

### Fetch & sync

`fetch` downloads remote commits **without** touching your working branch; `pull`
is `fetch` + integrate. How `pull` integrates is controlled by one config flag:

```bash
git fetch <remote>              # download remote refs, don't merge
git fetch --all --prune         # fetch every remote, drop deleted branches
git pull                        # fetch + integrate the current branch
git pull --rebase               # integrate by rebasing, just this once

# Set the default strategy for `git pull`:
git config --global pull.rebase false   # merge  (default)
git config --global pull.rebase true    # rebase
git config --global pull.ff only        # fast-forward only
```

When to pick which:

- **`pull.rebase false` (merge)** — safe default; records a merge commit when
  histories diverge. Fine for shared branches, but the log grows merge bubbles.
- **`pull.rebase true` (rebase)** — replays your local commits on top of upstream
  for a clean, linear history. Great solo or before pushing; avoid rebasing
  commits you've already shared.
- **`pull.ff only`** — refuses to auto-merge or rebase; forces you to decide,
  so you never get a surprise merge commit.

### Rebase

```bash
git rebase main                 # replay your branch on top of main
git rebase -i HEAD~3            # interactively squash/edit last 3 commits
git rebase --continue           # after resolving conflicts
git rebase --abort              # bail out and restore the branch
```

### Cherry-pick & reset

```bash
git cherry-pick <commit>        # apply one commit onto the current branch
git cherry-pick <a>^..<b>       # apply a range of commits (a..b inclusive)
git cherry-pick --continue      # after resolving conflicts
git cherry-pick --abort         # cancel and restore

git reset --soft HEAD~1         # move HEAD back, keep changes staged
git reset --mixed HEAD~1        # move HEAD back, unstage changes (default)
git reset --hard <commit>       # move HEAD back, discard all changes (careful)
git reset <file>                # unstage a file, keep its changes
git revert <commit>             # new commit that undoes an existing one
```

### Stash & clean

```bash
git stash                       # shelve uncommitted changes
git stash pop                   # bring them back
git stash list                  # see stashed entries
git restore <file>              # discard unstaged changes to a file
git clean -df                   # delete untracked files + directories
```

### Remotes

```bash
git remote -v                              # list remotes
git remote add <name> <repo-url>           # add a remote
git remote set-url origin <new-url>        # repoint origin
git fetch --all --prune                    # refresh remotes, drop stale branches
```

### Branches

```bash
git branch                      # list local branches
git switch <branch>             # switch branches (modern checkout)
git switch -c <branch>          # create + switch
git checkout -                  # jump back to the previous branch
git branch -d <branch>          # delete a merged branch
git branch -D <branch>          # force-delete a branch
git branch -m <new-name>        # rename the current branch
git push -u origin <branch>     # push + set upstream tracking
```

### Inspect & rescue

```bash
git diff                        # unstaged changes
git diff --staged               # staged changes (what you're about to commit)
git show <commit>               # what a single commit changed
git log -p <file>               # a file's history, with diffs
git blame <file>                # who last touched each line
git reflog                      # every HEAD move — your safety net
git reset --hard <reflog-ref>   # recover a "lost" commit or branch
git bisect start                # binary-search for the commit that broke things
git tag -a v1.0 -m "release"    # create an annotated tag
```

### Oh My Zsh git aliases

Shortcuts from the [Oh My Zsh git plugin](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/git) — the ones I type all day:

```bash
gst        # git status
gco        # git checkout
gcb        # git checkout -b   (new branch)
gcm        # git checkout the main branch
ga         # git add
gaa        # git add --all
gcmsg      # git commit -m
gc!        # git commit --amend
gd         # git diff
glog       # git log --oneline --decorate --graph
ggpush     # git push origin <current-branch>
ggpull     # git pull origin <current-branch>
grbi       # git rebase -i
gstp       # git stash pop
```

## Files & Processes

The shell muscle memory.

### Files & directories

```bash
mkdir -p path/to/dir             # create nested directories
cp -r <src> <dest>               # copy recursively
mv <src> <dest>                  # move / rename
rm -rf <path>                    # delete recursively (careful)
ln -s <target> <link>            # create a symlink
ls -lah                          # detailed, human-readable listing
tree -L 2                        # directory tree, 2 levels deep
du -sh *                         # size of each item here
df -h                            # free disk space by mount
```

### Find files

```bash
find . -name "*.log"                          # by name
find . -type f -mtime -1                       # modified in the last day
find . -size +100M                             # larger than 100 MB
find . -name "*.tmp" -delete                   # find and delete
find . -name "*.rb" -exec grep -l TODO {} +    # run a command on matches
find . -name "*log" -exec truncate --size 0 {} \;   # empty every log file in place
```

### Permissions

```bash
chmod +x <file>                  # make a script executable
chmod 644 <file>                 # rw for owner, read for others
chmod -R 755 <dir>               # recurse into a directory
chown -R <user>:<group> <path>   # change ownership
```

### Archives & compression

```bash
tar czf out.tar.gz <dir>         # create a gzipped tarball
tar xzf out.tar.gz               # extract one
tar tzf out.tar.gz               # list contents without extracting
zip -r out.zip <dir>             # create a zip
unzip out.zip -d <dir>           # extract into a directory
```

### Search & text

```bash
grep -rn "<text>" .              # recursive search with line numbers
grep -i "<text>" <file>          # case-insensitive
tail -f <file>                   # follow a file as it grows
less <file>                      # page through a file (q to quit)
head -n 50 <file>                # first 50 lines
wc -l <file>                     # count lines
sort <file> | uniq -c            # count unique lines
sed -i '' 's/old/new/g' <file>   # in-place find/replace (macOS)
awk '{print $1}' <file>          # print the first column
<cmd> | xargs <other-cmd>        # feed output as arguments
```

### JSON & YAML (jq / yq)

```bash
curl -s <url> | jq .             # pretty-print JSON
jq '.items[].name' file.json     # extract a field
yq '.services.web.image' file.yml  # query YAML
yq -i '.version = "2"' file.yml  # edit YAML in place
```

### Processes & ports

```bash
ps aux | grep <name>             # find a process
pgrep -fl <name>                 # find PIDs by name
kill <pid>                       # ask a process to stop (SIGTERM)
kill -9 <pid>                    # force-kill (SIGKILL)
pkill -f <pattern>               # kill by command pattern
lsof -i :<port>                  # what's listening on a port
htop                             # interactive process viewer
```

### Environment

```bash
export VAR=value                 # set an env var for this shell
echo $VAR                        # print a variable
env | grep <name>                # list matching env vars
which <cmd>                      # path of an executable
source ~/.zshrc                  # reload your shell config
```

## Homebrew & macOS

Keep packages and the shell healthy.

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew update && brew upgrade      # refresh + upgrade everything
brew doctor                      # diagnose problems
brew install <package>           # install
brew uninstall <package>         # remove
brew list                        # what's installed
```

### Oh My Zsh + handy plugins

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

git clone https://github.com/zsh-users/zsh-autosuggestions \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

Add them to `plugins=(...)` in `~/.zshrc`, then `source ~/.zshrc`.

## SSH

Keys, config, tunnels, and moving files between machines.

### Generate & copy

```bash
ssh-keygen -t ed25519 -C "you@example.com"   # create a key (name it per host)
chmod 600 ~/.ssh/id_ed25519                  # private key perms
chmod 644 ~/.ssh/id_ed25519.pub              # public key perms
cat ~/.ssh/id_ed25519.pub | pbcopy           # copy public key (macOS)
```

Paste the public key into GitHub / GitLab / Bitbucket → **SSH keys**.

### Per-host config

Keep different keys for different hosts in `~/.ssh/config`:

```text
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes

Host bitbucket.org
  HostName bitbucket.org
  User git
  IdentityFile ~/.ssh/bb_ed25519
  IdentitiesOnly yes
```

### Manage the agent

```bash
ssh-add -l                       # list loaded keys
ssh-add ~/.ssh/id_ed25519        # load a key
ssh-add -D                       # remove all loaded keys
ssh -T git@github.com            # test the connection
```

### Connect & run

```bash
ssh <user>@<host>                       # open a shell
ssh <user>@<host> -p 2222               # non-default port
ssh <user>@<host> "df -h"               # run one command and return
ssh-copy-id <user>@<host>               # install your public key on a server
ssh -J <jump-host> <user>@<host>        # hop through a bastion / jump host
ssh -v <user>@<host>                    # verbose — debug auth/connection issues
```

### Tunnels & port forwarding

```bash
# Local forward: reach a remote service as if it were local.
# e.g. a DB on the server's localhost:5432 -> your localhost:5432
ssh -L 5432:localhost:5432 <user>@<host>

# Remote forward: expose your local service on the remote host.
# e.g. share your local :3000 as the server's :8080
ssh -R 8080:localhost:3000 <user>@<host>

# Dynamic forward: a local SOCKS proxy that tunnels all traffic through the host.
ssh -D 1080 <user>@<host>

# Add -N (no shell) and -f (background) for a forward-only tunnel:
ssh -fNL 5432:localhost:5432 <user>@<host>
```

`-L` = **L**ocal (pull a remote port to you), `-R` = **R**emote (push a local port
out), `-D` = **D**ynamic (a SOCKS proxy on the given port).

### Copy files (scp / rsync)

```bash
scp <file> <user>@<host>:<path>             # copy a file to a server
scp <user>@<host>:<path>/file .             # copy from a server
scp -r <dir> <user>@<host>:<path>           # copy a directory

rsync -avz <dir>/ <user>@<host>:<path>/     # sync a tree (only changed files)
rsync -avz --delete <dir>/ <user>@<host>:<path>/   # mirror, removing extras
rsync -avz -e "ssh -p 2222" <src> <dst>     # rsync over a non-default port
```

## Networking & HTTP

Hit APIs, check what's listening, and chase down DNS.

### HTTP requests (curl)

```bash
curl <url>                                   # GET, print the body
curl -i <url>                                # include response headers
curl -L <url>                                # follow redirects
curl -O <url>                                # save with the remote filename
curl -H "Authorization: Bearer <token>" <url>   # send a header
curl -X POST -H "Content-Type: application/json" \
  -d '{"key":"value"}' <url>                 # POST JSON
curl -s <url> | jq .                         # pretty-print a JSON API
wget <url>                                   # download a file
```

### Connectivity & DNS

```bash
ping <host>                      # is it reachable?
dig +short <domain>              # DNS records (short form)
nslookup <domain>                # DNS lookup
traceroute <host>                # the path packets take
nc -vz <host> <port>             # test whether a TCP port is open
```

### Ports & interfaces

```bash
lsof -i :<port>                  # what's using a port
lsof -nP -iTCP -sTCP:LISTEN      # all listening TCP sockets
ipconfig getifaddr en0           # your LAN IP (macOS)
curl -s ifconfig.me              # your public IP
```

## Ruby & Rails

Version managers, dependencies, the run stack, and migrations.

### mise

[mise](https://mise.jdx.dev/) is a polyglot version + tool manager (a fast
successor to asdf) — one `mise.toml` pins every language and tool a project needs:

```bash
mise use -g ruby@3.3.7           # set a global Ruby
mise use ruby@3.3.7              # pin a tool for this project (writes mise.toml)
mise use -g node@lts python@3.12 # manage several languages at once
mise install                     # install everything declared in mise.toml
mise ls                          # installed tools + versions (+ which file requested them)
mise ls-remote ruby              # list installable versions of a tool
mise trust                       # trust a project's mise.toml
mise exec -- <cmd>               # run a command with mise's tools on PATH
mise run <task>                  # run a task defined in mise.toml
mise upgrade                     # update installed tools
```

It manages far more than language runtimes. Languages like `ruby`, `node`,
`python`, `rust`, `go`; CLI tools like `terraform`, `packer`, `sops`, `age`,
`gitleaks`, `direnv`, `yq`, `overmind`, and even `yarn` — all pinned per project
and kept off your global `PATH`. Plug-in backends reach packages that aren't in
the core registry:

```bash
mise use -g npm:gitlab-ci-local      # install from npm
mise use -g cargo:fracturedjson      # build from a Rust crate
mise use -g github:akiomik/mado      # download a GitHub release
mise use -g aqua:pipx:<pkg>          # other backends: aqua, pipx, go, etc.
mise registry                        # browse everything mise can install
```

### Ruby (rbenv / rvm)

```bash
# rbenv
rbenv install -l                 # list installable versions
rbenv install 3.3.0
rbenv global 3.3.0               # set the default
rbenv local 3.3.0                # pin per-project (.ruby-version)
rbenv versions

# rvm
rvm list known                   # installable versions
rvm install 3.3.0
rvm use 3.3.0 --default          # install + set the default
rvm gemset list                  # gemsets for the current Ruby
```

### Node (nvm / npm)

```bash
# nvm — manage Node versions
nvm install --lts
nvm install <version>
nvm use <version>
nvm alias default <version>
nvm ls

# npm — Node's package manager
npm install                      # install deps from package.json
npm install <pkg>                # add a dependency
npm install -D <pkg>             # add a dev dependency
npm run <script>                 # run a package.json script
npm ls                           # list installed packages
```

### Bundler & gems

```bash
bundle install                   # install gems from the Gemfile
bundle update <gem>              # bump a single gem
bundle exec <command>           # run within the bundle
gem pristine --all              # restore installed gems
gem cleanup                     # remove old gem versions
```

### Run the stack

```bash
bin/rails s -p 3000              # start the server
bin/rails c                      # console
redis-server                     # start Redis
overmind start                   # start every Procfile process
overmind connect <process>       # attach to one process (e.g. web, workers)
overmind restart <process>       # restart a single process
bundle exec sidekiq -C config/sidekiq.yml          # background jobs (Sidekiq)
bundle exec rake resque:work QUEUE=*               # background jobs (Resque)
```

### Generators & migrations

```bash
bin/rails g migration <Name>                 # create a migration
bin/rails g scaffold <Name> field:type       # scaffold a resource
bin/rails db:setup                           # create + load schema + seed
bin/rails db:migrate                         # run migrations
bin/rails db:migrate:status                  # see migration state
bin/rails db:rollback                        # undo the last migration
bin/rails db:migrate:down VERSION=<ts>       # revert a specific migration
bin/rails db:seed                            # load seeds
```

### Rake tasks

```bash
bundle exec rake -T                  # list available tasks
bundle exec rake <task>              # run a task
bundle exec rake "<task>[arg1,arg2]" # run a task with arguments
```

## Testing

RSpec for unit/integration specs, Cucumber for feature specs.

### RSpec

```bash
bundle exec rspec                            # run the whole suite
bundle exec rspec spec/models/user_spec.rb   # one file
bundle exec rspec spec/models/user_spec.rb:42  # one example at a line
bundle exec rspec --tag focus                # only tagged examples
bundle exec rspec --fail-fast                # stop at the first failure
bundle exec rspec --only-failures            # rerun what failed last time
```

### Cucumber

```bash
cucumber                                 # run all features
cucumber features/login.feature          # one feature
cucumber features/login.feature:42       # the scenario at a line
cucumber --tags @wip                     # run tagged scenarios
cucumber -f progress                     # compact dot output
```

## Node & Yarn

Front-end dependencies and build scripts.

```bash
yarn install                 # install deps from package.json
yarn add <pkg>               # add a dependency
yarn add -D <pkg>            # add a dev dependency
yarn remove <pkg>            # remove a dependency
yarn upgrade <pkg>           # upgrade a package
yarn why <pkg>               # explain why a package is installed
yarn <script>                # run a package.json script (e.g. yarn build)
yarn cache clean             # clear the Yarn cache
```

## MySQL

User management, dumps, and a password reset that always saves the day.

### Users & privileges

```sql
CREATE USER '<user>'@'localhost' IDENTIFIED BY '<password>';
GRANT ALL PRIVILEGES ON *.* TO '<user>'@'localhost';
FLUSH PRIVILEGES;
SELECT user, host FROM mysql.user;
DROP USER '<user>'@'localhost';
```

### Dump & restore

```bash
mysqldump -u <user> -p <database> > backup.sql   # export
mysql -u <user> -p <database> < backup.sql        # import
gunzip -c backup.sql.gz | mysql -u <user> -p <database>   # import gzipped
```

### Reset the root password

```bash
# 1. Stop MySQL, then start it bypassing auth
sudo mysqld_safe --skip-grant-tables &

# 2. In another shell
mysql -u root
```

```sql
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '<new-password>';
```

## Docker

Build, run, inspect, and ship images.

### Containers & images

```bash
docker ps -a                     # all containers (running + stopped)
docker images                    # local images
docker build -t <name>:<tag> .   # build from the Dockerfile here
docker run -it -d <name>:<tag>   # run detached, interactive
docker exec -it <container> bash # shell into a running container
docker logs -f <container>       # follow logs
docker stats                     # live CPU / memory per container
docker stop <container>          # stop it
docker rm <container>            # remove a container
docker rmi <image>               # remove an image
```

### Publish an image

```bash
docker commit <container> <user>/<name>:<tag>   # snapshot a container
docker push <user>/<name>:<tag>                 # push to a registry
docker pull <user>/<name>:<tag>                 # pull it elsewhere
```

### Compose

```bash
docker compose up -d             # start the stack in the background
docker compose ps                # service status
docker compose logs -f <service> # follow one service
docker compose stop              # stop everything
docker compose exec <service> sh # shell into a service
docker compose up -d <service>   # start specific services only
```

### Clean up

```bash
docker system df                 # where space is going
docker system prune -af          # remove unused data (careful)
docker volume prune              # drop dangling volumes
```

## Kamal Deploys

Kamal builds an image, pushes it to a registry, and runs it behind `kamal-proxy`
on a target host. Destinations live in `config/deploy.<dest>.yml` — I keep one per
environment (e.g. `local` for Colima, `lima-dev` for a Lima VM).

### Deploy

```bash
kamal server bootstrap -d <dest>   # one-time: install kamal-proxy on the host
kamal deploy -d <dest>             # build + push + deploy
kamal deploy -d <dest> --skip-push # redeploy current image, no rebuild
kamal build push -d <dest>         # build + push the image only (no deploy)
kamal rollback -d <dest>           # roll back to the previous image
kamal app stop -d <dest>           # stop the app containers
```

### Logs & status

```bash
kamal app logs -d <dest>           # last N lines
kamal app logs -d <dest> --tail    # follow live logs
kamal app details -d <dest>        # running containers + image SHA
```

### Console & one-off commands

```bash
kamal app exec -d <dest> -i -- bundle exec rails console
kamal app exec -d <dest> -- bundle exec rails db:migrate
kamal app exec -d <dest> -- bundle exec rake db:seed
kamal app exec -d <dest> -- bundle exec rails runner "puts Rails.env"
kamal app exec -d <dest> -- curl -s http://localhost:3000/up   # health check
```

### Proxy

```bash
kamal proxy boot -d <dest>         # start kamal-proxy (first time)
kamal proxy details -d <dest>      # proxy container status
kamal proxy logs -d <dest>         # proxy logs
```

## Lima & Colima VMs

Local Linux VMs that host the Docker engine my Kamal targets deploy onto.

### Lima lifecycle

```bash
limactl list                       # all VMs + SSH port + status
limactl start <vm>.yaml            # create + start from a config (first time)
limactl start <vm-name>            # restart an existing VM
limactl stop <vm-name>             # graceful stop
limactl stop --force <vm-name>     # hard stop
limactl delete <vm-name>           # delete the VM (destroys its disk)
```

### Shell & SSH into a VM

{% raw %}

```bash
limactl shell <vm-name>            # interactive shell inside the VM
limactl shell <vm-name> -- <cmd>   # run one command and return
limactl show-ssh <vm-name>         # print the ssh config block
limactl list --format '{{.SSHLocalPort}}' <vm-name>   # just the SSH port
```

{% endraw %}

### Dependency stack inside the VM

Bring up the backing services (database, cache, search) with Compose:

```bash
limactl shell <vm-name> -- bash -c "cd <app-dir> && docker compose \
  -f deploy/docker/compose.yaml \
  --env-file deploy/docker/.env.<dest> \
  --project-name <project> \
  up -d mysql valkey meilisearch"
```

### Colima

```bash
colima start                       # start the default VM
colima stop <profile>              # stop a profile
colima status                      # show status
colima delete <profile>            # delete a profile
```

### Tear down & rebuild

```bash
# Remove app + proxy, then destroy the VM (wipes all data)
kamal app stop -d <dest>
kamal proxy remove -d <dest>
limactl stop <vm-name>
limactl delete <vm-name>

# Bring it back from scratch
limactl start <vm>.yaml
source ~/.zshrc
```
