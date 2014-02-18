//= require_self
//= require_tree .
/* global DnD:true */

DnD = Ember.Namespace.create({

  cancel: function (event) {
    event.preventDefault();
    return false;
  },

  completeDragSupport: function () {
    if (window.hasOwnProperty('chrome')) {
      return true;
    }
    return false; // FF broken D&D: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
  },
  touchEmulatedDragSupport: function() {
    return 'ontouchstart' in window // works on most browsers
      || 'onmsgesturechange' in window; // works on ie10
  },

  portableCoordinates: function (event) {
    return this.portableTouchCoordinates(event) || {
      x: event.originalEvent.x || event.originalEvent.screenX,
      y: event.originalEvent.y || event.originalEvent.screenY
    };
  },

  portableTouchCoordinates: function (event) {
    if (event.originalEvent.touches && event.originalEvent.touches.length) {
      return {
        x: event.originalEvent.touches[0].x || event.originalEvent.touches[0].screenX,
        y: event.originalEvent.touches[0].y || event.originalEvent.touches[0].screenY
      };
    }
  }

});
