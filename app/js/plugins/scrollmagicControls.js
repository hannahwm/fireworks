var $ = jQuery;
var ScrollMagic = bundleLib.run();

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
      scienceTrigger: ".scienceTrigger"
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
        self.$scienceTrigger = self.$container.find(self.options.scienceTrigger);
        self.controller = new ScrollMagic.Controller();
        self.controller2 = new ScrollMagic.Controller();
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

      //if you want a function to only run for a specific slide, you can use the function below.
      // var fireworksScience = new ScrollMagic.Scene({
      //   triggerElement: "#fireworksScience",
      //   duration: 200,
      //   reverse: true
      // })
      // .setClassToggle("fireworksScience-active")
      // .on("enter", function() {
      //
      // })
      // .on("leave", function() {
      //
      // })
      // .addTo(self.controller);

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
    }
  };

}( $ ) );

(function init () {
  $(document).ready(function() {
    $(".fireworksWrapper").scrollmagicControls();
  });
})();
