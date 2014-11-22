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
        for(var i = 0; i < this.actor.object.string.length; i++) {
            a.c.fillText(this.actor.object.string[i],
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
        this.onPlatform = true;
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
            this.actor.onPlatform = true;
    },
    onCollisionLeave: function(other) {
        if(other.object.role == Common.roles.OBSTACLE)
            this.actor.onPlatform = false;
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
        if(this.actor.onPlatform) {
            jumpImpulse = this.actor.body.GetMass() * (-3 - velocity.y);
            gamvas.state.getCurrentState().sounds.jump.play();
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
        // reset jump allowance
        if(other.object.role == Common.roles.OBSTACLE) {
            this.actor.jumps = this.actor.maxJumps;
            this.actor.onPlatform = true;
        }
    },
    onCollisionLeave: function(other) {
        // decrease jump allowance when the player leaves a platform
        if(other.object.role == Common.roles.OBSTACLE) {
            this.actor.jumps--;
            this.actor.onPlatform = false;
        }
    },
    doCollide: function(other) {
        return true;
    },
    update: function(t){
        // just let box2d do its job if the player is dead
        if(this.actor.player.isDead)
            return;

        var velocity = this.actor.body.GetLinearVelocity();
        var jumpImpulse = 0;
        var desiredVelocity = 0;

        // only process input if not in a winning state, i.e. winning is like letting go of all keys
        if(!this.actor.player.hasWon) {
            // handle jumping
            if(gamvas.key.isPressed(gamvas.key.SPACE) && !this.jumpKeyHeld && this.actor.jumps > 0) {
                jumpImpulse = this.actor.body.GetMass() * (-5 - velocity.y);

                // only decrease jumps here if the player is already in mid-air, the other case is handled by onCollisionLeave
                if(!this.actor.onPlatform)
                    this.actor.jumps--;

                gamvas.state.getCurrentState().sounds.jump.play();
            }

            if(gamvas.key.isPressed(gamvas.key.LEFT)) {
                desiredVelocity = -5;
                this.actor.player.direction = Common.directions.LEFT;
            }
            else if(gamvas.key.isPressed(gamvas.key.RIGHT)) {
                desiredVelocity = 5;
                this.actor.player.direction = Common.directions.RIGHT;
            }
        }

        var change = desiredVelocity - velocity.x;
        var impulse = this.actor.body.GetMass() * change;
        this.actor.setAwake(true);
        this.actor.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(impulse, jumpImpulse), this.actor.body.GetWorldCenter());
        this.jumpKeyHeld = gamvas.key.isPressed(gamvas.key.SPACE); // you need to release space to allow the next jump
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
                // only die if not in a winning state and not already dead
                if(!this.actor.isDead && !this.actor.hasWon) {
                    this.actor.isDead = true;
                    gamvas.state.getCurrentState().sounds.death.play();
                }
                break;
            case Common.roles.GOAL:
                // only accept win if not flung into goal while dead and not hitting goal a second time
                if(!this.actor.isDead && !this.actor.hasWon) {
                    this.actor.hasWon = true;
                    gamvas.state.getCurrentState().sounds.goal.play();
                }
                break;
        }
    },
    onCollisionLeave: function(other) {

    }
});