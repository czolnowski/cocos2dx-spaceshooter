var LaserShot = cc.Sprite.extend({
    _position: {x: 0, y: 0},
    _winSize: null,
    
    ctor: function(initialPos, winSize) {
        this._winSize = winSize;
        this.initWithFile('./res/laserGreen.png');
        this.setPosition(initialPos);
        this._position = initialPos;
    },
    
    update: function() {
        this._position.y += 25;
        this.setPosition(this._position);
    },
    
    getRect: function() {
        var size = cc.SIZE_POINTS_TO_PIXELS(this.getContentSize());
        return new Rect(
            this._position.x - (size.width / 2),
            this._position.y - (size.height / 2),
            size.width, size.height
        );
    },
    
    isDone: function() {
        return this._position.y >= this._winSize.height;
    }
});

var laserFire = function(pos, size, l, shots) {
    var shot = new LaserShot(pos, size);
    shot.scheduleUpdate();
    l.addChild(shot);
    shots.push(shot);
};
