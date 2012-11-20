var Meteor = cc.Sprite.extend({
    _winSize: null,
    _position: {x: 0, y: 0},
    _speed: 1,
    _size: {width: 0, height: 0},
    _whichOne: null,
    
    ctor: function(winSize) {
        this._whichOne = this._whichOne();
        this._position.x = Math.round(winSize.width * Math.random());
        this._position.y = winSize.height;
        
        this.initWithFile(
            './res/meteor' + (
                this._whichOne.substring(0,1).toUpperCase() + this._whichOne.substring(1)
            ) + '.png'
        );
        this.setPosition(
            new cc.Point(this._position.x, this._position.y)
        );
        this._winSize = winSize;
        
        var speedMultiplex = 2;
        if(this._whichOne == 'small') {
            speedMultiplex = 5;
        }
        this._speed = Math.round((Math.random()*100)) % 8 + speedMultiplex;
    },
    
    _whichOne: function() {
        return Math.round((Math.random()*10)) % 2 > 0 ? 'big' : 'small';
    },
    
    update: function() {
        if(this._position.y > 0) {
            this._position.y -= this._speed;
            this.setPosition(
                new cc.Point(this._position.x, this._position.y)
            );
        }
    },
  
    isDone: function() {
        return this._position.y < 1;
    },
    
    getRect: function() {
        var size = cc.SIZE_POINTS_TO_PIXELS(this.getContentSize());
        return new Rect(
            this._position.x - (size.width / 2),
            this._position.y - (size.height / 2),
            size.width, size.height
        );
    },
    
    getPoints: function() {
        return this._whichOne == 'small' ? 3 : 1;
    }
});
