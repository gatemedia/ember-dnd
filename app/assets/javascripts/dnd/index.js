//= require_self
//= require_tree .

DnD = Ember.Namespace.create({

    cancel: function (event) {
        event.preventDefault();
        return false;
    };


    completeDragSupport: function () {
        if (window.hasOwnProperty('chrome')) {
            return true;
        }
        return false; // FF broken D&D: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
    }


    portableCoordinates: function (event) {
        return {
            x: event.originalEvent.x || event.originalEvent.screenX,
            y: event.originalEvent.y || event.originalEvent.screenY
        };
    };
});
