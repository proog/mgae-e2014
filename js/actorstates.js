baseActorState = gamvas.ActorState.extend({
    init: function() {
        var state = gamvas.state.getCurrentState();
        this.actor.setFile(state.resource.getImage('resources/tile.png'));
    },
    draw: function(t) {
        this._super(t);

        var a = this.actor.getCurrentAnimation();
        a.c.fillStyle = '#000';
        a.c.font = 'normal 46px consolas';
        a.c.textAlign = 'center';
        a.c.fillText(this.actor.object.symbol, this.actor.position.x + a.width/2, this.actor.position.y + a.height);
        //console.log(a.width + ' x ' + a.height);
    }
});

obstacleActorState = baseActorState.extend({
    init: function() {
        this._super();
    },
    update: function(t) {

    },
    draw: function(t) {
        this._super(t);
    }
});

playerActorState = baseActorState.extend({
    init: function() {
        this._super();
        this.worldDimensions = gamvas.state.getCurrentState().worldDimensions;
        var canvasDim = gamvas.getCanvasDimension();
        this.cameraBounds = {
            left: Math.floor(canvasDim.w / 2),
            right: Math.floor(Math.min(this.worldDimensions.width, canvasDim.w) - (canvasDim.w / 2)),
            top: Math.floor(canvasDim.h / 2),
            bottom: Math.floor(Math.min(this.worldDimensions.height, canvasDim.h) - (canvasDim.h / 2))
        };
        this.camera = gamvas.state.getCurrentState().camera;
    },
    update: function(t) {
        //Player movement
        if (gamvas.key.isPressed(gamvas.key.UP)) {
            this.actor.move(0, -Common.playerVars.SPEED*t);
        }

        if (gamvas.key.isPressed(gamvas.key.DOWN)) {
            this.actor.move(0, Common.playerVars.SPEED*t);
        }

        if (gamvas.key.isPressed(gamvas.key.LEFT)) {
            this.actor.move(-Common.playerVars.SPEED*t, 0);
        }

        if (gamvas.key.isPressed(gamvas.key.RIGHT)) {
            this.actor.move(Common.playerVars.SPEED*t, 0);
        }

        if(this.actor.position.x < 0){
            this.actor.position.x = 0;
        }
        else if(this.actor.position.x >= this.worldDimensions.width - Common.tileSize.width){
            this.actor.position.x = this.worldDimensions.width - Common.tileSize.width;
        }

        if(this.actor.position.y < 0){
            this.actor.position.y = 0;
        }
        else if(this.actor.position.y >= this.worldDimensions.height - Common.tileSize.height){
            this.actor.position.y = this.worldDimensions.height - Common.tileSize.height;
        }

        //Camera movement
        var cameraPositionX = Math.max(Math.min(this.actor.position.x, this.cameraBounds.right), this.cameraBounds.left);
        var cameraPositionY = Math.max(Math.min(this.actor.position.y, this.cameraBounds.bottom), this.cameraBounds.top);
        this.camera.setPosition(cameraPositionX, cameraPositionY);
    },
    draw: function(t) {
        this._super(t);
    }
});