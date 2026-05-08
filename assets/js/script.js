$(document).ready(function() {
  initializeScripts();

  // Clean up Materialize overlays at the moment a link is clicked,
  // before the transition begins — prevents stuck overlays blocking the new page.
  Barba.Dispatcher.on('linkClicked', function() {
    $('#sidenav-overlay').remove();
    $('.lean-overlay').remove();
    $('.drag-target').remove();
    $('body').css({ overflow: '', width: '' });
  });

  // Re-run page setup after every Barba transition completes.
  Barba.Dispatcher.on('transitionCompleted', function() {
    initializeScripts();
  });

  // Choose transition based on the outgoing page at click time.
  Barba.Pjax.getTransition = function() {
    return window.location.pathname === '/' ? HideShowTransition : FadeTransition;
  };

  Barba.Pjax.start();
});
