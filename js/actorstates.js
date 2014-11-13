baseActorState = gamvas.ActorState.extend({
    init: function() {
        var state = gamvas.state.getCurrentState();
        this.actor.setFile(state.resource.getImage('resources/tile.png'));
    },
    draw: function(t) {
        this._super(t);

        var a = this.actor.getCurrentAnimation();
        a.c.fillStyle = '#000';
        a.c.font = 'normal 30px consolas';
        a.c.textAlign = 'center';
        a.c.textBaseline = 'middle';
        a.c.fillText(this.actor.object.symbol,
                this.actor.position.x,
                this.actor.position.y);
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

enemyActorPatrollingState = baseActorState.extend({
    init: function(){
        this._super();
        this.bound = 50;
        this.timeThreshold = 3;
        this.timeSpent = 0;
        this.directionX = -1;
        this.speed = 100;
        this.velocity = 0;
    },
    update: function(t){
        this.timeSpent += t;
        this.velocity = this.speed * this.directionX * t;
        if(this.timeSpent > this.timeThreshold){
            console.log("switching enemy direction");
            this.directionX = this.directionX > 0 ? -1 : 1;
            this.timeSpent = 0;
        }
        this.actor.move(this.velocity, 0);
    },
    draw: function(t){
        this._super(t);
    }
});

enemyActorChasingState = baseActorState.extend({
    init: function(){
        this._super();
        this.direction = 1;
        this.speed = 100;
        this.velocity = 0;
        this.targetPositionX = 0;
    },
    update: function(t){

    },
    draw: function(t){
        this._super(t);
    }
});

dangerActorState = baseActorState.extend({
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
            right: Math.floor(Math.max(this.worldDimensions.width, canvasDim.w) - (canvasDim.w / 2)),
            top: Math.floor(canvasDim.h / 2),
            bottom: Math.floor(Math.max(this.worldDimensions.height, canvasDim.h) - (canvasDim.h / 2))
        };
        this.camera = gamvas.state.getCurrentState().camera;
    },
    update: function(t) {
        // listen for input and move actor
        var currentVelocity = this.actor.body.GetLinearVelocity();
        var newImpulseY = 0;
        var newVelocityX = 0;

        if(gamvas.key.isPressed(gamvas.key.SPACE) && this.actor.canJump) {
            newImpulseY = -0.8;
        }

        if(gamvas.key.isPressed(gamvas.key.LEFT)) {
            this.actor.setAwake(true);
            newVelocityX = -5;
        }
        if(gamvas.key.isPressed(gamvas.key.RIGHT)) {
            this.actor.setAwake(true);
            newVelocityX = 5;
        }

        if(!gamvas.key.isPressed(gamvas.key.LEFT) && !gamvas.key.isPressed(gamvas.key.RIGHT)) {
            newVelocityX = 0;
        }

        var velocityChange = newVelocityX - currentVelocity.x;
        var newImpulseX = this.actor.body.GetMass() * velocityChange;
        this.actor.body.ApplyImpulse(new gamvas.Vector2D(newImpulseX, newImpulseY), this.actor.body.GetWorldCenter());

        //Camera movement
        var cameraPositionX = Math.max(Math.min(this.actor.position.x, this.cameraBounds.right), this.cameraBounds.left);
        var cameraPositionY = Math.max(Math.min(this.actor.position.y, this.cameraBounds.bottom), this.cameraBounds.top);
        this.camera.setPosition(cameraPositionX, cameraPositionY);
    },
    draw: function(t) {
        this._super(t);
    },
    doCollide: function(other) {
        return true;
    },
    onCollisionEnter: function(other) {
        if(other.object.role == Common.roles.OBSTACLE)
            this.actor.canJump = true;
        else if(other.object.role == Common.roles.DANGER || other.object.role == Common.roles.ENEMY)
            this.actor.isDead = true;
    },
    onCollisionLeave: function(other) {
        this.actor.canJump = false;
    }
});