baseActorState = gamvas.ActorState.extend({
    init: function() {
        //var state = gamvas.state.getCurrentState();
        //this.actor.setFile(state.resource.getImage('resources/tile.png'));
        this.bobbing = false;
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
                this.actor.position.y + (this.bobbing ? 1 : 0) // bobbing offset
            );
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

collectibleActorState = passiveActorState.extend({
    draw: function(t) {
        if(!this.actor.collected)
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
        this.patrollingBound = 2; //number of tiles on either side
        this.velocity = 0;
        this.chaseDistanceX = 4; //number of tiles
        this.chaseDistanceY = 2;
        this.basePatrollingPositionX = this.actor.position.x;
        this.onPlatform = true;
        this.patrollingSpeed = 1.5;
        this.chasingSpeed = 2;
        this.bobDuration = 0.15;
        this.timeSinceBob = 0;
    },
    update: function(t){
        this.target = gamvas.state.getCurrentState().gameObjects.player;
        this.actor.running = true;
    },
    draw: function(t){
        // handle bobbing calculation
        this.timeSinceBob += t;
        if(this.timeSinceBob > this.bobDuration && this.actor.onPlatform && this.actor.running) {
            this.bobbing = !this.bobbing;
            this.timeSinceBob = 0;
        }

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
        //If the player was directly above the enemy during a chase
        if(this.actor.direction === Common.directions.NONE)
            if(Math.floor(Math.random()) % 2 == 0)
                this.actor.direction = Common.directions.LEFT;
            else
                this.actor.direction = Common.directions.RIGHT;

        //Switch direction when it reaches the patrolling bound
        else if(Math.abs(this.actor.position.x - this.basePatrollingPositionX) >= this.patrollingBound * Common.tileSize.width){
            if(this.actor.position.x < this.basePatrollingPositionX){
                this.actor.direction = Common.directions.RIGHT;
            } else {
                this.actor.direction = Common.directions.LEFT;
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
            this.actor.running = false;
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
            // emit dust when landing on an obstacle
            var dustEmitter = gamvas.state.getCurrentState().dustEmitter;
            dustEmitter.setPosition(this.actor.position.x, this.actor.position.y);
            dustEmitter.reset();
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
        // emit dust when moving on a platform
        if(this.actor.running && this.actor.onPlatform){
            var dustEmitter = gamvas.state.getCurrentState().dustEmitter;
            dustEmitter.setPosition(this.actor.position.x, this.actor.position.y);
            dustEmitter.reset();
        }

        var velocity = this.actor.body.GetLinearVelocity();
        var jumpImpulse = 0;
        var desiredVelocity = 0;

        // winning and dying is like letting go of all keys
        if(!this.actor.player.hasWon && !this.actor.player.isDead) {
            // handle jumping
            if(gamvas.key.isPressed(gamvas.key.SPACE) && !this.jumpKeyHeld && this.actor.jumps > 0) {
                jumpImpulse = this.actor.body.GetMass() * (-5 - velocity.y);

                // only decrease jumps here if the player is already in mid-air, the other case is handled by onCollisionLeave
                if(!this.actor.onPlatform)
                    this.actor.jumps--;

                var dustEmitter = gamvas.state.getCurrentState().dustEmitter;
                dustEmitter.setPosition(this.actor.position.x, this.actor.position.y);
                dustEmitter.reset();

                gamvas.state.getCurrentState().sounds.jump.play();
            }

            if(gamvas.key.isPressed(gamvas.key.LEFT)) {
                desiredVelocity = -3;
                this.actor.player.direction = Common.directions.LEFT;
                this.actor.running = true;
            }
            else if(gamvas.key.isPressed(gamvas.key.RIGHT)) {
                desiredVelocity = 3;
                this.actor.player.direction = Common.directions.RIGHT;
                this.actor.running = true;
            }
            else {
                this.actor.running = false;
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
        this.bobDuration = 0.15;
        this.timeSinceBob = 0;
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
        // don't draw if dead
        if(this.actor.isDead)
            return;

        // handle bobbing calculation
        this.timeSinceBob += t;
        if(this.timeSinceBob > this.bobDuration && this.actor.foot.onPlatform && this.actor.foot.running) {
            this.bobbing = !this.bobbing;
            this.timeSinceBob = 0;
        }

        this._super(t);
    },
    onCollisionEnter: function(other) {
        // only process these if the player is neither dead or winning
        if(this.actor.isDead || this.actor.hasWon)
            return;

        switch(other.object.role) {
            case Common.roles.DANGER:
            case Common.roles.ENEMY:
                this.actor.isDead = true;
                gamvas.state.getCurrentState().sounds.death.play();
                var woundEmitter = gamvas.state.getCurrentState().playerWoundEmitter;
                woundEmitter.setPosition(this.actor.position.x, this.actor.position.y);
                break;
            case Common.roles.GOAL:
                this.actor.hasWon = true;
                this.actor.foot.running = false;
                gamvas.state.getCurrentState().sounds.goal.play();
                var emitter = gamvas.state.getCurrentState().goalEmitter;
                emitter.setPosition(other.position.x, other.position.y);
                emitter.reset();
                break;
            case Common.roles.COLLECTIBLE:
                // only collect if not already collected
                if(!other.collected) {
                    this.actor.score++;
                    other.collected = true;
                    gamvas.state.getCurrentState().sounds.collectible.play();
                    var emitter = gamvas.state.getCurrentState().collectibleEmitter;
                    emitter.setPosition(other.position.x, other.position.y);
                    emitter.reset();
                }
                break;
        }
    },
    onCollisionLeave: function(other) {

    }
});