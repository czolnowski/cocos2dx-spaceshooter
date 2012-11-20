var MyLayer = cc.Layer.extend({
  _playerSprite: null,
  
  _meteors: new Array(),
  _meteorsAmount: 0,
  
  _shots: new Array(),
  
  _size: {},
  
  _killed: false,
  _killedLabel: null,
  
  _crosshair: null,
  _crosshairRect: null,
  
  _points: 0,
  _pointsLabel: null,
  
  _lifeLabel: null,
  
  _endGameMenu: null,
  
  init: function() {
    this._super();
    this._size = cc.Director.getInstance().getWinSize();
    
    // create background layer
        var background = new Background(this);

    // add player ship
        this._playerSprite = new PlayerSprite();
        this._playerSprite.placeInLayer(this._size.width, this._size.height);
        this._playerSprite.scheduleUpdate();
        this.addChild(this._playerSprite);
    

    // add crosshair
        this._crosshair = new Crosshair();
        this._crosshair.setPosition(new cc.Point(80,this._size.height - 80));
        this.addChild(this._crosshair);
        this._crosshairRect = new Rect(
            20, this._size.height - 140, 90, 90
        );
    
    // add score label
        this._pointsLabel = cc.LabelTTF.create(
            "Score: " + this._points, "Ubuntu", 20
        );
        this._pointsLabel.setPosition(
            new cc.Point(this._size.width - 100, this._size.height - 30)
        );
        this.addChild(this._pointsLabel);
    
    // add life label
        var maxLife = this._playerSprite.getMaxLife();
        this._lifeLabel = cc.LabelTTF.create(
            "Life: " + maxLife + "/" + maxLife, "Ubuntu", 20
        );
        this._lifeLabel.setPosition(
            new cc.Point(this._size.width - 100, 30)
        );
        this.addChild(this._lifeLabel);
    
    this.setKeyboardEnabled(true);
    this.setTouchEnabled(true);
    this.scheduleUpdate();
    
    return true;
  },
  
  onKeyDown: function(event) {
    if(this._playerSprite != null ) {
        if(event == cc.KEY.space) {
            laserFire(
                this._playerSprite.getPosition(),
                this._size, this, this._shots
            );
        } else {
            this._playerSprite.handleKey(event);
        }
    }
  },
  
  onTouchesBegan: function(pTouch, pEvent) {
    this._handleTouch(pTouch[0].getLocation());
  },
  
  onTouchesMoved: function(pTouch, pEvent) {
    this._handleTouch(pTouch[0].getLocation());
  },
  
  _handleTouch: function(p) {
    if(this._playerSprite != null) {
        if(!Rect.containsPoint(this._crosshairRect,p)) {
            this._playerSprite.handleTouchMove(p);
        } else {
            laserFire(
                this._playerSprite.getPosition(),
                this._size, this, this._shots
            );
        }
    }
  },

  update: function() {
    if(this._killed)
        return false;
  
    this.updateLife();
    if(this._playerSprite.isDestroyed()) {
        for(i in this._meteors) {
            this._destroyMeteor(i);
        }
        for(s in this._shots) {
            this.removeChild(this._shots[s]);
            delete this._shots[s];
        }
        
        this.removeChild(this._playerSprite);
        delete this._playerSprite;
        
        this.removeChild(this._crosshair);
        delete this._crosshair;
        
        this._killed = true;
        
        this._killedLabel = cc.LabelTTF.create(
            "You Lose! [" + this._points + "]", "Ubuntu", 50
        );
        this._killedLabel.setPosition(
            new cc.Point(this._size.width / 2, this._size.height / 2)
        );
        this.addChild(this._killedLabel);
        
        var newGameItem = cc.MenuItemLabel.create(
            cc.LabelTTF.create(
                "Start new game", "Ubuntu", 20
            ), this
        );
        newGameItem.setCallback('_startNewGame', this);

        this._endGameMenu = cc.Menu.create(newGameItem);
        this._endGameMenu.setPosition(
            new cc.Point(this._size.width / 2, ( this._size.height / 2) - 40 )
        );
        this.addChild(this._endGameMenu);
        
        return false;
    }
  
    if(this._meteorsAmount < 3 ) {
        for(var i = this._meteorsAmount; i < 3; ++i ) {
            var meteor = new Meteor(this._size);
            this._meteors.push(meteor);
            meteor.scheduleUpdate();
            this.addChild(meteor);
            ++this._meteorsAmount;
        }
    }
    
    var playerRect = this._playerSprite.getRect();
    for(i in this._meteors) {
        if(this._meteors[i].isDone()) {
            this._destroyMeteor(i);
        } else {
            var meteorRect = this._meteors[i].getRect();
            var meteorDestroyed = false;
            for(s in this._shots) {
                if(this._shots[s].isDone()) {
                    this.removeChild(this._shots[s]);
                    delete this._shots[s];
                } else {
                    if(Rect.isIntersect(this._shots[s].getRect(), meteorRect)) {
                        this.updateScore(this._meteors[i].getPoints());
                        
                        this._destroyMeteor(i);
                        meteorDestroyed = true;
                        
                        this.removeChild(this._shots[s]);
                        delete this._shots[s];
                        
                        break;
                    }
                }
            }
            
            if(!meteorDestroyed) {
                if(Rect.isIntersect(playerRect, meteorRect)) {
                    this._destroyMeteor(i);
                    this._playerSprite.damage();
                }
            }
        }
    }
  },
  
  _destroyMeteor: function(i) {
    this.removeChild(this._meteors[i]);
    delete this._meteors[i];
    --this._meteorsAmount;
  },
  
  _startNewGame: function() {
    this._killed = false;
    
    // add player ship
        this._playerSprite = new PlayerSprite();
        this._playerSprite.placeInLayer(this._size.width, this._size.height);
        this._playerSprite.scheduleUpdate();
        this.addChild(this._playerSprite);
    

    // add crosshair
        this._crosshair = new Crosshair();
        this._crosshair.setPosition(new cc.Point(80,this._size.height - 80));
        this.addChild(this._crosshair);
    
    this.removeChild(this._killedLabel);
    this.removeChild(this._endGameMenu);
    this._updateScore();
    this._updateLife();
    
  },
  
  updateScore: function(newPoints) {
    this._points += newPoints;
    this._pointsLabel.setString("Score: " + this._points);
  },
  
  updateLife: function() {
    var currentLife = this._playerSprite.getCurrentLife();
    var maxLife     = this._playerSprite.getMaxLife()
    this._lifeLabel.setString("Life: " + currentLife + "/" + maxLife);
  }

});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});
