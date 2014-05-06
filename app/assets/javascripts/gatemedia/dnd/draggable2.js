
DnD.Draggable2 = Ember.Mixin.create({
  classNameBindings: 'draggable dragged'.w(),
  dragged: false,

  draggable: function () {
    if (this.get('canDrag')) {
      return 'true';
    } else {
      return 'false';
    }
  }.property('canDrag'),

  mouseDown: function (event) {
    if (this.get('canDrag')) {
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
      // Ember.tryInvoke(this, 'click', [event]);

      var currentCoordinates = DnD.portableCoordinates(event),
          x = currentCoordinates.x,
          y = currentCoordinates.y,
          deltaX = 0,
          deltaY = 0;
      x -= deltaX;
      y -= deltaY;

      this.set('_dragMeta', Ember.Object.create({
        fromX: x,
        fromY: y,
        deltaX: deltaX,
        deltaY: deltaY,
        zIndex: this.$().css('z-index'),
        backdrop: backdrop
      }));
      this._sendDragEvent('dragBegin', x, y);

      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  },
  mouseMove: function (event) {
    if (this.get('dragged')) {
      if (event.which === 0) {
        this.set('dragged', false);
      } else {
        var currentCoordinates = DnD.portableCoordinates(event),
            dragMeta = this.get('_dragMeta'),
            x = currentCoordinates.x - dragMeta.get('deltaX'),
            y = currentCoordinates.y - dragMeta.get('deltaY');

        // this.setCssProperties({
        //   x: x,
        //   y: y
        // });
        this._sendDragEvent('dragMove', x, y);
      }

      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  },
  mouseUp: function (event) {
    if (this.get('dragged')) {
      var dragMeta = this.get('_dragMeta');

      this.set('dragged', false);
      this.$().css('z-index', dragMeta.get('zIndex'));
      dragMeta.get('backdrop').remove();

      var currentCoordinates = DnD.portableCoordinates(event),
          x = currentCoordinates.x - dragMeta.get('deltaX'),
          y = currentCoordinates.y - dragMeta.get('deltaY');

      this._sendDragEvent('dragEnd', x, y);
      this.set('_dragMeta', null);

      event.preventDefault();
      event.stopPropagation();
      return false;
    }
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

  _sendDragEvent: function (name, x, y) {
    var dragMeta = this.get('_dragMeta'),
        fromX = dragMeta.get('fromX'),
        fromY = dragMeta.get('fromY');

    dragMeta.setProperties({
      x: x,
      y: y
    });

    Ember.tryInvoke(this, name, [{
      x: x,
      y: y,
      fromX: fromX,
      fromY: fromY,
      dx: x - fromX,
      dy: y - fromY
    }]);
  },

  _dragChanged: function () {
    this.$().css('z-index', this.get('dragged') ? 10001 : undefined);
  }.observes('dragged'),

  /** To be implemented by draggable */
  canDrag: true,

  /** To be implemented by draggable */
  dragBegin: Ember.K,
  dragMove: Ember.K,
  dragEnd: Ember.K
});
