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
