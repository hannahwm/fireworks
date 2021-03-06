var $ = jQuery;
// var ScrollMagic = bundleLib.run();

( function( $ ) {
  var Neu = Neu || {};

  $.fn.scrollmagicControls = function(options) {
      return this.each(function() {
          var scrollmagicControls = Object.create(Neu.scrollmagicControls);
          scrollmagicControls.init(this, options);
      });
  };

  $.fn.scrollmagicControls.options = {
      pinned: ".pinned-content",
      first: ".first",
      scienceTrigger: ".scienceTrigger",
      historyTrigger: ".fireworks-history",
      lastTrigger: ".firework-last-pinned"
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
              var ctaOffset = $(".firework-first-cta").offset();
              var historyOffset = $(".fireworks-history").offset();

              if (ctaOffset.top > historyOffset.top) {
                $(".firework-first-cta").fadeOut();
              }

              //remove empty p tags
              var pTags = $(document).find("p");
              for (var i=0; i<pTags.length; i++) {
                var elm = pTags[i];

                if ($(elm).html().replace(/\s|&nbsp;/g, '').length == 0) {
                  $(elm).css("display", "none");
                }
              }
          });
      },
      bindElements: function() {
        var self = this;

        self.$pinned = self.$container.find(self.options.pinned);
        self.$first = self.$container.find(self.options.first);
        self.$scienceTrigger = self.$container.find(self.options.scienceTrigger);
        self.historyTrigger = self.$container.find(self.options.historyTrigger);
        self.lastTrigger = self.$container.find(self.options.lastTrigger);
        self.controller = new ScrollMagic.Controller();
        self.controller2 = new ScrollMagic.Controller();
        self.controller3 = new ScrollMagic.Controller();
        self.parallaxController = new ScrollMagic.Controller({vertical: false});
    },
    bindEvents: function() {
      var self = this;



      $(document).on("scroll", function() {
        if ($(window).scrollTop() > 100) {
          $(".firework-first-cta").fadeOut();
        } else {
          $(".firework-first-cta").fadeIn();
        }
      });
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
				.addTo(self.controller);
  		}

      for (var i=0; i<self.lastTrigger.length; i++) {
        var slide = self.lastTrigger[i];
        var duration;

        duration = $(slide).parent(".firework-last").height();

        new ScrollMagic.Scene({
          triggerElement: slide,
          duration: duration,
          triggerHook: 0,
          reverse: true
        })
        .setPin(slide)
        .addTo(self.controller);
      };

      for (var i=0; i< self.$first.length; i++) {
  			var slide = self.$first[i];
        var duration;

        duration = $(slide).height();

        if ( $(window).width > 600 ) {
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

  		}



      //Parallax scene
      // build tween
      var calcOffset = $(window).height() / 2;
      var offset = "-" + calcOffset + "px";
      var tween = new TimelineMax ()
      .add([
        TweenMax.fromTo("#parallaxText .layer1", 1, {top: "70vh"}, {top: 0, ease: Linear.easeNone}),
      ]);

      // build scene
      var scene = new ScrollMagic.Scene({
        triggerElement: "#parallaxWrapper",
        duration: $(window).height(),
        offset: offset
      })
      .setTween(tween)
      .addTo(self.controller);

      $("#fireworksScience").each(function() {
        var slide = ".science-pinned";
        var duration2 = $(window).height() * 4;

        var scienceScene = new ScrollMagic.Scene({
          triggerElement: slide,
          duration: duration2,
          triggerHook: 0,
					reverse: true
        })
        .setPin(slide)
        .setClassToggle("#fireworksScience", "fixed")
        .on("enter", function() {
          $(".firework-info-text").fadeIn("slow");

          $(".fireworks-close").bind("click touchstart", function() {
            $(".firework-info-text").fadeOut("slow");
          });
        })
        .on("leave", function() {
          $(".firework-info-text").hide();
        })
        .addTo(self.controller);
      });


      for (var i=0; i<self.$scienceTrigger.length; i++) {
        var triggerEl = self.$scienceTrigger[i];

        new ScrollMagic.Scene({triggerElement: triggerEl})
        .on("enter", function() {
          var trigger = this.triggerElement();
          var id = $(trigger).attr("id").replace(/science/, '');
          var target = ".science-info" + id;

          $(target).fadeIn();
        })
        .on("leave", function() {
          var trigger = this.triggerElement();
          var id = $(trigger).attr("id").replace(/science/, '');
          var target = ".science-info" + id;

          $(target).fadeOut();
        })
        .addTo(self.controller2);
      };

      for (var i=0; i<self.historyTrigger.length; i++) {
        var triggerEl = self.historyTrigger[i];

        var wipeAnimation = new TimelineMax()
          .fromTo("#fireworks-history-two", 1, {x: "100%"}, {x: "0%", ease: Linear.easeNone})
          .fromTo("#fireworks-history-three", 1, {x: "100%"}, {x: "0%", ease: Linear.easeNone})

        new ScrollMagic.Scene({
          triggerElement: triggerEl,
          triggerHook: "onLeave",
          duration: "300%"
        })
        .setPin(triggerEl)
        .setTween(wipeAnimation)
        .addTo(self.controller3);
      };



    }
  };

}( $ ) );

(function init () {
  $(document).ready(function() {
    $(".fireworksWrapper").scrollmagicControls();
  });
})();

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
      animated: ".rocket__animated",
      answer: ".rocket-answer"
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
        self.$answer = self.$container.siblings(self.options.answer);
      },
      bindEvents: function() {
        var self = this;

        self.$rocket.each( function() {
          var container = $(this),
            static = container.find(self.options.static),
            animated = container.find(self.options.animated),
            url = animated.attr("src"),
            answer = $(self.options.answer),
            color = static.attr("data-color"),
            text = static.attr("data-text");

          container.on("click", function() {
            var timeout = 0;

            answer.hide();

            static.css("opacity", 0);
            animated.show();

            setTimeout(function() {
              if ( animated.attr("src") === " " ) {
                animated.attr("src", url);
              }
            }, timeout);


            setTimeout( function() {
              answer.fadeIn();
              $(answer).text(text);
              $(answer).css("color", color);
            }, 3500);

            setTimeout( function() {
              static.css("opacity", 1);
              animated.attr("src", " ");
              animated.hide();
              answer.fadeOut();
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
