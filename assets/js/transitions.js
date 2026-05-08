// Transition used when leaving the home page.
// Animates the four section boxes off-screen while borders expand.
var HideShowTransition = Barba.BaseTransition.extend({
  start: function() {
    this.newContainerLoading.then(this.finish.bind(this));
  },

  finish: function() {
    var _this = this;
    document.body.scrollTop = 0;
    $("html").css("overflow-y", "hidden");

    $(this.newContainer).css({ visibility: "visible", opacity: 1 });
    $(this.newContainer).show();

    $(".my-borders").css({ height: "1px", width: "1px" });

    var pro1 = new Promise(function(resolve) {
      $(".about-border").animate({ height: "100%" }, 400, resolve);
    });
    var pro2 = new Promise(function(resolve) {
      $(".projects-border").animate({ width: "100%" }, 400, resolve);
    });
    var pro3 = new Promise(function(resolve) {
      $(".blog-border").animate({ width: "100%" }, 400, resolve);
    });
    var pro4 = new Promise(function(resolve) {
      $(".contact-border").animate({ height: "100%" }, 400, resolve);
    });

    Promise.all([pro1, pro2, pro3, pro4]).then(function() {
      $(".top-row").css("background-color", "transparent");

      var aboutW   = $(".about").width(),    aboutH   = $(".about").height();
      var contactW = $(".contact").width(),  contactH = $(".contact").height();
      var projW    = $(".projects").width(), projH    = $(".projects").height();
      var blogW    = $(".blog").width(),     blogH    = $(".blog").height();

      $(_this.oldContainer).find(".about").animate({ left: "-=" + aboutW, top: "-=" + aboutH }, 400);
      $(_this.oldContainer).find(".contact").animate({ left: "+=" + contactW, top: "+=" + contactH }, 400);
      $(_this.oldContainer).find(".projects").animate({ left: "+=" + projW, top: "-=" + projH }, 400);

      var $blog = $(_this.oldContainer).find(".blog");
      var cleanup = function() {
        $("html").css("overflow-y", "visible");
        _this.done();
      };

      if ($blog.length) {
        $blog.animate({ left: "-=" + blogW, top: "+=" + blogH }, 400, cleanup);
      } else {
        cleanup();
      }
    });
  }
});

// Transition used when entering any non-home page, and also when returning to home.
// Uses a simple fade between inner pages, or a reverse fly-in animation for the home page.
var FadeTransition = Barba.BaseTransition.extend({
  start: function() {
    this.newContainerLoading.then(this.fadeIn.bind(this));
  },

  fadeIn: function() {
    var _this = this;
    var $new  = $(this.newContainer);
    var $old  = $(this.oldContainer);

    // Returning to home page — reverse the box fly-in animation.
    if (window.location.pathname === '/') {
      $(".my-borders").css({ height: "1px", width: "1px" });
      $(".about-border").css({ height: "100%" });
      $(".contact-border").css({ height: "100%" });
      $(".projects-border").css({ width: "100%" });
      $(".blog-border").css({ width: "100%" });

      var aboutW   = $(".about").width(),    aboutH   = $(".about").height();
      var contactW = $(".contact").width(),  contactH = $(".contact").height();
      var projW    = $(".projects").width(), projH    = $(".projects").height();
      var blogW    = $(".blog").width(),     blogH    = $(".blog").height();

      $new.find(".about").css({ left: "-=" + aboutW, top: "-=" + aboutH });
      $new.find(".contact").css({ left: "+=" + contactW, top: "+=" + contactH });
      $new.find(".projects").css({ left: "+=" + projW, top: "-=" + projH });
      $new.find(".blog").css({ left: "-=" + blogW, top: "+=" + blogH });

      var pro1 = new Promise(function(resolve) {
        $new.find(".about").animate({ left: "+=" + aboutW, top: "+=" + aboutH }, 400, resolve);
      });
      var pro2 = new Promise(function(resolve) {
        $new.find(".contact").animate({ left: "-=" + contactW, top: "-=" + contactH }, 400, resolve);
      });
      var pro3 = new Promise(function(resolve) {
        $new.find(".projects").animate({ left: "-=" + projW, top: "+=" + projH }, 400, resolve);
      });
      var pro4 = new Promise(function(resolve) {
        $new.find(".blog").animate({ left: "+=" + blogW, top: "-=" + blogH }, 400, resolve);
      });

      Promise.all([pro1, pro2, pro3, pro4]).then(function() {
        $(".blog-border").css("top", "-1px");
        _this.done();

        // Collapse borders after Barba is done
        $(".about-border").animate({ height: "0%" }, 400);
        $(".projects-border").animate({ width: "0%" }, 400);
        $(".blog-border").animate({ width: "0%" }, 400);
        $(".contact-border").animate({ height: "0%" }, 400);
      });

    } else {
      // Standard fade between inner pages
      $new.css({ visibility: "visible", opacity: 0 });
      $old.animate({ opacity: 0 }, 300, function() {
        $old.hide();
        $new.animate({ opacity: 1 }, 300, function() {
          $("html, body").animate({ scrollTop: 0 }, 250);
          _this.done();
        });
      });
    }
  }
});
