
DnD.Droppable = Ember.Mixin.create({

    dragEnter: DnD.cancel,
    dragOver: DnD.cancel,

    drag: function (event) {
        var currentCoordinates = DnD.portableCoordinates(event);

        this.dragAction(currentCoordinates.x, currentCoordinates.y, event); // item cannot be get from drag event...

        event.preventDefault();
        return false;
    },

    drop: function (event) {
        var
            self = this,
            positionDelta = this._computeDelta(event),
            object = this.lookupDraggable(event.dataTransfer.getData('object'));

        if (object && object.then) {
            object.then(function (object) {
                self.dropAction(object, positionDelta, event);
            });
        } else {
            this.dropAction(object, positionDelta, event);
        }

        event.preventDefault();
        return false;
    },

    _computeDelta: function (event) {
        var
            currentCoordinates = DnD.portableCoordinates(event),
            originCoordinates = event.dataTransfer.getData('from').split(':');

        return {
            dx: currentCoordinates.x - originCoordinates[0],
            dy: currentCoordinates.y - originCoordinates[1],
        };
    },

    /** To be overriden by droppable */
    lookupDraggable: Ember.K,

    /** To be overriden by droppable */
    dropAction: function (object, positionDelta, event) {
        Ember.Logger.warn('Ignored drop action for ' + object.toString());
    }
});
