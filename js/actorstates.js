baseActorState = gamvas.ActorState.extend({
    init: function() {
        //var state = gamvas.state.getCurrentState();
        //this.actor.setFile(state.resource.getImage('resources/tile.png'));
    },
    draw: function(t) {
        this._super(t);

        var startPos = this.actor.position.x - Common.tileSize.width * this.actor.object.size.width / 2 + Common.tileSize.width/2;
        var a = this.actor.getCurrentAnimation();

        a.c.save();

        // mirror text if direction is left
        if(this.actor.direction == Common.directions.LEFT) {
            startPos = this.actor.position.x + Common.tileSize.width * this.actor.object.size.width / 2 - Common.tileSize.width/2;
            a.c.translate(startPos, this.actor.position.y);
            a.c.scale(-1,1);
            a.c.translate(-startPos, -this.actor.position.y);
        }

        // set up style
        a.c.fillStyle = '#000';
        a.c.font = 'normal ' + this.actor.fontSize + 'px consolas';
        a.c.textAlign = 'center';
        a.c.textBaseline = 'middle';

        // draw all symbols for this actor
        for(var i = 0; i < this.actor.object.size.width; i++) {
            a.c.fillText(this.actor.object.symbol[i],
                startPos + Common.tileSize.width * i,
                this.actor.position.y);
        }

        a.c.restore();
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
        this.chaseDistanceX = 4; //number of tiles
        this.chaseDistanceY = 2;
        this.basePatrollingPositionX = this.actor.position.x;
        this.canJump = true;
        this.patrollingSpeed = 1.5;
        this.chasingSpeed = 3;
    },
    update: function(t){
        this.target = gamvas.state.getCurrentState().gameObjects.player;
    },
    draw: function(t){
        this._super(t);
    },
    onCollisionEnter: function(other){
        if(other.object.role == Common.roles.OBSTACLE)
            this.actor.canJump = true;
    },
    onCollisionLeave: function(other) {
        if(other.object.role == Common.roles.OBSTACLE)
            this.actor.canJump = false;
    }
});

enemyActorPatrollingState = baseEnemyActorState.extend({
    init: function(){
        this._super();
    },
    update: function(t){
        this._super(t);

        if(!this.target)
            return;

        if(!this.target.isDead && Math.abs(this.target.position.x - this.actor.position.x) < this.chaseDistanceX * Common.tileSize.width
            && Math.abs(this.target.position.y - this.actor.position.y) < this.chaseDistanceY * Common.tileSize.height){
            console.log("You lookin' at me?!");
            this.actor.setState("chasing");
            return;
        }
        if(Math.abs(this.actor.position.x - this.basePatrollingPositionX) >= this.patrollingBound * Common.tileSize.width){
            if(this.actor.position.x < this.basePatrollingPositionX){
                this.actor.direction = Common.directions.RIGHT;
                console.log("Enemy direction: RIGHT");
            } else {
                this.actor.direction = Common.directions.LEFT;
                console.log("Enemy direction: LEFT");
            }
        }

        var velocity = this.actor.body.GetLinearVelocity();
        var desiredVelocity = this.patrollingSpeed * this.actor.direction;

        var change = desiredVelocity - velocity.x;
        var impulse = this.actor.body.GetMass() * change;
        this.actor.setAwake(true);
        this.actor.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(impulse, 0), this.actor.body.GetWorldCenter());
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
        this._super(t);

        if(!this.target)
            return;

        if(Math.abs(this.target.position.x - this.actor.position.x) > this.chaseDistanceX * Common.tileSize.width
            || Math.abs(this.target.position.y - this.actor.position.y) > this.chaseDistanceY * Common.tileSize.height) {
            console.log("Hmpf, I'll let you go this time");
            this.actor.setState("patrolling");
            this.actor.getCurrentState().basePatrollingPositionX = this.actor.position.x;
            return;
        }
        if(this.target.position.x + Common.tileSize.width / 2 < this.actor.position.x)
            this.actor.direction = Common.directions.LEFT;
        else if(this.target.position.x - Common.tileSize.width / 2 > this.actor.position.x)
            this.actor.direction = Common.directions.RIGHT;
        else
            this.actor.direction = Common.directions.NONE;

        var velocity = this.actor.body.GetLinearVelocity();
        var jumpImpulse = 0;
        if(this.actor.canJump) {
            jumpImpulse = this.actor.body.GetMass() * (-3 - velocity.y);
            gamvas.state.getCurrentState().jumpSound.play();
        }
        var desiredVelocity = this.chasingSpeed * this.actor.direction;

        var change = desiredVelocity - velocity.x;
        var impulse = this.actor.body.GetMass() * change;
        this.actor.setAwake(true);
        this.actor.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(impulse, jumpImpulse), this.actor.body.GetWorldCenter());
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
        if(other.object.role == Common.roles.OBSTACLE) {
            this.actor.jumps = this.actor.maxJumps;
            this.actor.canJump = true;
        }
    },
    onCollisionLeave: function(other) {

    },
    doCollide: function(other) {
        return true;
    },
    update: function(t){
        // don't process input if player is dead
        if(this.actor.player.isDead)
            return;

        var velocity = this.actor.body.GetLinearVelocity();
        var jumpImpulse = 0;
        var desiredVelocity = 0;

        if(gamvas.key.isPressed(gamvas.key.SPACE) && this.actor.canJump && !this.jumping) {
            jumpImpulse = this.actor.body.GetMass() * (-5 - velocity.y);
            this.actor.jumps--;
            this.actor.canJump = this.actor.jumps > 0;
            this.jumping = true;

            gamvas.state.getCurrentState().jumpSound.play();
        }

        if(gamvas.key.isPressed(gamvas.key.LEFT)) {
            desiredVelocity = -5;
            this.actor.player.direction = Common.directions.LEFT;
        }
        else if(gamvas.key.isPressed(gamvas.key.RIGHT)) {
            desiredVelocity = 5;
            this.actor.player.direction = Common.directions.RIGHT;
        }
        else if(!gamvas.key.isPressed(gamvas.key.LEFT) && !gamvas.key.isPressed(gamvas.key.RIGHT)) {
            desiredVelocity = 0;
        }

        var change = desiredVelocity - velocity.x;
        var impulse = this.actor.body.GetMass() * change;
        this.actor.setAwake(true);
        this.actor.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(impulse, jumpImpulse), this.actor.body.GetWorldCenter());
        this.jumping = gamvas.key.isPressed(gamvas.key.SPACE); // you need to release space to allow the next jump
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