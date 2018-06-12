var $ = jQuery;

( function( $ ) {
  var Neu = Neu || {};

  $.fn.launchRocket = function(options) {
      return this.each(function() {
          var launchRocket = Object.create(Neu.launchRocket);
          launchRocket.init(this, options);
      });
  };

  $.fn.launchRocket.options = {
      rocket: ".rocket",
      static: ".rocket__static",
      animated: ".rocket__animated"
  };

  Neu.launchRocket = {
      init: function(elem, options) {
          var self = this;
          self.$container = $(elem);
          self.options = $.extend({}, $.fn.launchRocket.options, options);
          self.bindElements();
          self.bindEvents();
      },
      bindElements: function() {
        var self = this;

        self.$rocket = self.$container.find(self.options.rocket);
      },
      bindEvents: function() {
        var self = this;

        self.$rocket.each( function() {
          var container = $(this),
            static = container.find(self.options.static),
            animated = container.find(self.options.animated),
            url = animated.attr("src");

          container.on("click", function() {
            var timeout = 0;

            static.css("opacity", 0);
            animated.show();

            setTimeout(function() {
              if ( animated.attr("src") === " " ) {
                animated.attr("src", url);
              }
            }, timeout);


            setTimeout( function() {
            }, 5500);

            setTimeout( function() {
              static.css("opacity", 1);
              animated.attr("src", " ");
              animated.hide();
            }, 6000);
          });
        });
      }
  };

}( $ ) );

(function init () {
  $(document).ready(function() {
    $(".rockets").launchRocket();
  });
})();

var $ = jQuery;

( function( $ ) {
  var Neu = Neu || {};

  $.fn.scrollmagicControls = function(options) {
      return this.each(function() {
          var scrollmagicControls = Object.create(Neu.scrollmagicControls);
          scrollmagicControls.init(this, options);
      });
  };

  $.fn.scrollmagicControls.options = {
      pinned: ".pinned-content"
  };

  Neu.scrollmagicControls = {
      init: function(elem, options) {
          var self = this;
          self.$container = $(elem);
          self.options = $.extend({}, $.fn.scrollmagicControls.options, options);
          self.bindElements();
          self.bindEvents();

          $(document).ready( function() {
              self.triggerScrollMagic();
          });
      },
      bindElements: function() {
        var self = this;

        self.$pinned = self.$container.find(self.options.pinned);
        self.controller = new ScrollMagic.Controller();
        self.parallaxController = new ScrollMagic.Controller({vertical: false});
    },
    bindEvents: function() {
      var self = this;
    },
    triggerScrollMagic: function() {
      var self = this;

      //if you want the same function to run for multiple slides you can use the function below. The for function goes through all slides with the class name "pinned-content" and adds a pinned scrollmagic slide for each.
      for (var i=0; i<self.$pinned.length; i++) {
  			var slide = self.$pinned[i];
        var duration;

        duration = $(slide).height();

  			new ScrollMagic.Scene({
					triggerElement: slide,
					duration: duration,
					triggerHook: 0,
					reverse: true
				})
				.setPin(slide)
        .on("enter leave", function(e) {
          //if you want something to happen on enter and/or leave, you can add it below. If it should only happen on enter then remove "leave" above.

          //the trigger is ".pinned-content"
          var trigger = this.triggerElement();
          var triggerClass = $(trigger).attr("class");

          if (e.type === "leave") {
          } else {
          }
        })
				.addTo(self.controller);
  		}

      //Parallax scene
      // build tween
      var tween = new TimelineMax ()
      .add([
        TweenMax.fromTo("#parallaxText .layer1", 1, {top: "50vh"}, {top: "-25vh", ease: Linear.easeNone}),
      ]);

      // build scene
      var scene = new ScrollMagic.Scene({triggerElement: "#parallaxWrapper", duration: $(window).height()})
      .setTween(tween)
      .addTo(self.controller);

      //if you want a function to only run for a specific slide, you can use the function below.
      // var customScene = new ScrollMagic.Scene({
      //   triggerElement: "#customScene",
      //   duration: 1000,
      //   reverse: true
      // })
      // .setClassToggle("#customScene", "custom-active")
      // .on("enter", function() {
      //   $(".box").animate({
      //     height: "300px",
      //     width: "400"
      //   });
      // })
      // .on("leave", function() {
      //   $(".box").animate({
      //     height: "150px",
      //     width: "200"
      //   });
      // })
      // .addTo(self.controller);
    }
  };

}( $ ) );

(function init () {
  $(document).ready(function() {
    $(".wrapper").scrollmagicControls();
  });
})();
