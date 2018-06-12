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
