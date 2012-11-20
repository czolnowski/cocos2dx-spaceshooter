var Background = cc.Sprite.extend({
    ctor: function(layer) {
        this.initWithFile('./res/background.png');
        this.setPosition(new cc.Point(0,0));
        layer.addChild(this);
    }
});
