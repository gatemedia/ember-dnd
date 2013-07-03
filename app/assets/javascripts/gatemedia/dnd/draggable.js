
DnD.Draggable = Ember.Mixin.create({
    attributeBindings: 'draggable',

    draggable: function () {
        if (this.get('canDrag')) {
            return 'true';
        } else {
            return 'false';
        }
    }.property('canDrag'),

    dragStart: function (event) {
        var
            currentCoordinates = DnD.portableCoordinates(event),
            dataTransfer = event.dataTransfer,
            object;

        if (this.get('canDrag')) {
            object = this.dragObject(currentCoordinates.x, currentCoordinates.y);

            dataTransfer.setData('object', object);
            dataTransfer.setData('from', '%@:%@'.fmt(currentCoordinates.x, currentCoordinates.y));
            if (object && DnD.completeDragSupport()) {
                dataTransfer.setDragImage($('img.blank')[0], 0, 0);
            }

            event.stopPropagation();
        } else {
            event.preventDefault();
            return false;
        }
    },

    /** To be implemented by draggable */
    canDrag: true,

    /** To be implemented by draggable */
    dragObject: Ember.K
});
