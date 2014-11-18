baseActorState = gamvas.ActorState.extend({
    init: function() {
        var state = gamvas.state.getCurrentState();
        //this.actor.setFile(state.resource.getImage('resources/tile.png'));
    },
    draw: function(t) {
        this._super(t);

        var a = this.actor.getCurrentAnimation();
        a.c.fillStyle = '#000';
        a.c.font = 'normal 30px consolas';
        a.c.textAlign = 'center';
        a.c.textBaseline = 'middle';
        var startPos = this.actor.position.x - Common.tileSize.width * this.actor.object.size.width / 2 + Common.tileSize.width/2;
        for(var i = 0; i < this.actor.object.size.width; i++) {
            a.c.fillText(this.actor.object.symbol,
                startPos + Common.tileSize.width * i,
                this.actor.position.y);
        }
    }
});

passiveActorState = baseActorState.extend({
    init: function() {
        this._super();
    },
    update: function(t) {

    },
    draw: function(t) {
        this._super(t);
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

baseEnemyActorState = baseActorState.extend({
    init: function() {
        this._super();
        this.timeThreshold = 3;
        this.patrollingBound = 2; //number of tiles on either side
        this.directionX = -1;
        this.timeSpent = 0;
        this.speed = 40;
        this.velocity = 0;
        this.chaseDistance = 4; //number of tiles
        this.basePatrollingPositionX = this.actor.position.x;
        this.target = gamvas.state.getCurrentState().gameObjects.player;
    },
    update: function(t){

    },
    draw: function(t){
        this._super(t);
    }
});

enemyActorPatrollingState = baseEnemyActorState.extend({
    init: function(){
        this._super();
    },
    update: function(t){
        if(!this.target.isDead && Math.abs(this.target.position.x - this.actor.position.x) < this.chaseDistance * Common.tileSize.width){
            console.log("You lookin' at me?!");
            this.actor.setState("chasing");
            return;
        }
        if(Math.abs(this.actor.position.x - this.basePatrollingPositionX) >= this.patrollingBound * Common.tileSize.width){
            this.directionX = -this.directionX;
            console.log("switching enemy direction");
        }
        //this.timeSpent += t;
        this.velocity = this.speed * this.directionX * t;
        /*if(this.timeSpent > this.timeThreshold){
            console.log("switching enemy direction");
            this.directionX = this.directionX > 0 ? -1 : 1;
            this.timeSpent = 0;
        }*/
        this.actor.move(this.velocity, 0);
    },
    draw: function(t){
        this._super(t);
    }
});

enemyActorChasingState = baseEnemyActorState.extend({
    init: function(){
        this._super();
    },
    update: function(t){
        if(Math.abs(this.target.position.x - this.actor.position.x) > this.chaseDistance * Common.tileSize.width) {
            console.log("Hmpf, I'll let you go this time");
            this.actor.setState("patrolling");
            this.actor.getCurrentState().basePatrollingPositionX = this.actor.position.x;
            return;
        }
        if(this.target.position.x < this.actor.position.x){
            this.direction = -1;
        } else {
            this.direction = 1;
        }
        this.velocity = this.speed * this.direction * t;
        this.actor.move(this.velocity, 0);
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

footActorState = gamvas.ActorState.extend({
    onCollisionEnter: function(other) {
        if(other.object.role == Common.roles.OBSTACLE)
            this.actor.canJump = true;
    },
    onCollisionLeave: function(other) {
        if(other.object.role == Common.roles.OBSTACLE)
            this.actor.canJump = false;
    },
    doCollide: function(other) {
        return true;
    },
    update: function(t){
        var velocity = this.actor.body.GetLinearVelocity();
        var jumpImpulse = 0;
        var desiredVelocity = 0;

        if(gamvas.key.isPressed(gamvas.key.SPACE) && this.actor.canJump)
            jumpImpulse = this.actor.body.GetMass() * (-8 - velocity.y);
        if(gamvas.key.isPressed(gamvas.key.LEFT))
            desiredVelocity = -5;
        else if(gamvas.key.isPressed(gamvas.key.RIGHT))
            desiredVelocity = 5;
        else if(!gamvas.key.isPressed(gamvas.key.LEFT) && !gamvas.key.isPressed(gamvas.key.RIGHT))
            desiredVelocity = 0;

        var change = desiredVelocity - velocity.x;
        var impulse = this.actor.body.GetMass() * change;
        this.actor.setAwake(true);
        this.actor.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(impulse, jumpImpulse), this.actor.body.GetWorldCenter());
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
        // update foot state
        this.actor.foot.getCurrentState().update(t);

        // check for out of bounds
        if(this.actor.position.y > this.worldDimensions.height)
            this.actor.isDead = true;

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
        switch(other.object.role) {
            case Common.roles.DANGER:
            case Common.roles.ENEMY:
                this.actor.isDead = true;
                break;
            case Common.roles.GOAL:
                this.actor.hasWon = true;
                break;
        }
    },
    onCollisionLeave: function(other) {

    }
});