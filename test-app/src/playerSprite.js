var PlayerSprite = cc.Sprite.extend({
  _currentPosition: {x: 0, y: 0},
  _destinationPosition: {x: 0, y:0},
  _maxPositions: {x: {l: 0, r: 0}, y: {t: 0, b: 0}},
  _size: {width: 99, height: 75},
  _life: 0,
  _maxLife: 10,
  
  ctor: function() {
    this.initWithFile('./res/player.png');
    this._life = this._maxLife;
  },
  
  placeInLayer: function(lWidth, lHeight) {
    this.setPosition(new cc.Point(
      lWidth / 2, (this._size.height + 20) / 2
    ));
    this._currentPosition.x = this._destinationPosition.x = lWidth / 2;
    this._currentPosition.y = this._destinationPosition.y = (this._size.height + 20) / 2;
    
    this._maxPositions.x.l  = Math.floor(this._size.width / 2);
    this._maxPositions.x.r  = Math.floor(lWidth - this._size.width / 2);
    this._maxPositions.y.t  = Math.floor(this._size.height / 2);
    this._maxPositions.y.b  = Math.floor(lHeight - this._size.height / 2);
    
  },
  
  update: function() {
    if(this._destinationPosition.x != this._currentPosition.x) {
      this._changeXPosition();
    }
    
    if(this._destinationPosition.y != this._currentPosition.y) {
      this._changeYPosition();
    }
  },
  
  _changeXPosition: function() {
    var xDiff = this._currentPosition.x - this._destinationPosition.x;
    if(xDiff > 15 || xDiff < -15)
      xDiff /= 4;
    this._currentPosition.x -= xDiff;
    this.setPosition(new cc.Point(
      this._currentPosition.x, this._currentPosition.y
    ));
  },
  
  _changeYPosition: function() {
    var yDiff = this._currentPosition.y - this._destinationPosition.y;
    if(yDiff > 15 || yDiff < -15)
      yDiff /= 4;
    this._currentPosition.y -= yDiff;
    this.setPosition(new cc.Point(
      this._currentPosition.x, this._currentPosition.y
    ));
  },
  
  handleKey: function(event) {
    if(event == cc.KEY.left) {
      this._destinationPosition.x -= 15;
    } else if(event == cc.KEY.right) {
      this._destinationPosition.x += 15;
    } else if(event == cc.KEY.down) {
      this._destinationPosition.y -= 15;
    } else if(event == cc.KEY.up) {
      this._destinationPosition.y += 15;
    }

    this._checkDestinationPositions();
  },
  
  handleTouchMove: function(location) {
    this._destinationPosition.x = location.x;
    this._destinationPosition.y = location.y;
    this._checkDestinationPositions();
  },
  
  _checkDestinationPositions: function() {
    if(this._destinationPosition.x < this._maxPositions.x.l)
      this._destinationPosition.x = this._maxPositions.x.l;
    if(this._destinationPosition.x > this._maxPositions.x.r)
      this._destinationPosition.x = this._maxPositions.x.r;
      
    if(this._destinationPosition.y < this._maxPositions.y.t)
      this._destinationPosition.y = this._maxPositions.y.t;
    if(this._destinationPosition.y > this._maxPositions.y.b)
      this._destinationPosition.y = this._maxPositions.y.b;
  },
  
  getRect: function() {
    var size = cc.SIZE_POINTS_TO_PIXELS(this.getContentSize());
    return new Rect(
        this._position.x - (size.width / 2),
        this._position.y - (size.height / 2),
        size.width, size.height
    );
  },
  
  damage: function() {
    --this._life;
    if(this._life == 5 ) {
        this.setTexture(
            cc.TextureCache.getInstance().addImage("./res/playerDamaged.png")
        );
    }
  },
  
  isDestroyed: function() {
    return this._life < 1;
  },
  
  getMaxLife: function() {
    return this._maxLife;
  },
  
  getCurrentLife: function() {
    return this._life;
  }
});
