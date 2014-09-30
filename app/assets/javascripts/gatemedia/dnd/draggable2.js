
DnD.Draggable2 = Ember.Mixin.create({
  classNameBindings: 'dragged'.w(),

  init: function() {
    this._super();
    this.set('dragged', false);
  },

  tryDrag: function (event, binding, callback) {
    if ((event.which || Ember.get(event, 'originalEvent.which')) === 0) {
      this.set('dragged', false);
    } else {
      if (this.get('canDrag')) {
        var position,
            dragMeta = this.get('_dragMeta'),
            coordinates = DnD.portableCoordinates(event);

        if (this.get('dragged') && dragMeta) {
          var x = coordinates.x - dragMeta.get('deltaX'),
              y = coordinates.y - dragMeta.get('deltaY');

          position = this._generateDragData(x, y);
        } else {
          var backdrop = Ember.$('<div></div>');
          backdrop.prependTo(this.$());
          backdrop.css({
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10000
          });

          this.setProperties({
            dragged: true
          });

          var deltaX = 0,
              deltaY = 0;

          this.set('_dragMeta', Ember.Object.create({
            fromX: coordinates.x,
            fromY: coordinates.y,
            deltaX: deltaX,
            deltaY: deltaY,
            zIndex: this.$().css('z-index'),
            backdrop: backdrop
          }));

          position = this._generateDragData(coordinates.x, coordinates.y);
        }
        this.set('dragged', true);
        return callback.apply(binding, [position]);
      }
    }
  },
  tryDrop: function (event, binding, callback) {
    var dragMeta = this.get('_dragMeta');

    if (this.get('dragged') && dragMeta) {
      this.$().css('z-index', dragMeta.get('zIndex'));
      dragMeta.get('backdrop').remove();

      var coordinates = DnD.portableCoordinates(event),
          x = coordinates.x - dragMeta.get('deltaX'),
          y = coordinates.y - dragMeta.get('deltaY');

      var position = this._generateDragData(x, y);
      this.set('_dragMeta', null);

      return callback.apply(binding, [position]);
    }
    this.set('dragged', false);
  },

  // touchStart: function (event) {
  //   var currentCoordinates = DnD.portableCoordinates(event);
  //   if (this.get('canDrag')) {
  //     // Drag object.
  //     var object = this.dragObject(currentCoordinates.x, currentCoordinates.y);
  //     // Set last dragged from in DnD since we won't have dataTransfer for touch events.
  //     DnD.set('lastDraggedFrom', '%@:%@'.fmt(currentCoordinates.x, currentCoordinates.y));
  //     event.stopPropagation();
  //   } else {
  //     event.preventDefault();
  //     return false;
  //   }
  // },

  _generateDragData: function (x, y) {
    var dragMeta = this.get('_dragMeta'),
        fromX = dragMeta.get('fromX'),
        fromY = dragMeta.get('fromY');

    dragMeta.setProperties({
      x: x,
      y: y
    });
    return {
      x: x,
      y: y,
      fromX: fromX,
      fromY: fromY,
      dx: x - fromX,
      dy: y - fromY
    };
  },

  _dragChanged: function () {
    this.$().css('z-index', this.get('dragged') ? 10001 : undefined);
  }.observes('dragged'),

  /** To be implemented by draggable */
  canDrag: true
});
