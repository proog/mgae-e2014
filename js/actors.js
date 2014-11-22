baseActor = gamvas.Actor.extend({
    create: function(name, object) {
        this.object = object;
        this.direction = Common.directions.RIGHT;
        this.fontSize = Common.tileSize.height;

        var pos = getObjectWorldPosition(object);
        this._super(name, pos.x, pos.y);
    }
});

obstacleActor = baseActor.extend({
    create: function(name, object) {
        this._super(name, object);

        this.addState(new obstacleActorState('obstacle'), true);

        this.friction = 0;
        this.restitution = 0;

        this.bodyRect(this.position.x, this.position.y,
                this.object.size.width * Common.tileSize.width,
                this.object.size.height * Common.tileSize.height,
                gamvas.physics.STATIC);
    }
});

enemyActor = baseActor.extend({
    create: function(name, object) {
        this._super(name, object);
        this.addState(new enemyActorPatrollingState('patrolling'));
        this.addState(new enemyActorChasingState('chasing'));
        this.setState('patrolling');

        this.friction = 0;
        this.restitution = 0;
        this.density = 10000; // this dude is really heavy

        this.bodyRect(this.position.x, this.position.y,
                this.object.size.width * Common.reducedTileSize.width,
                this.object.size.height * Common.reducedTileSize.height,
                gamvas.physics.DYNAMIC);
        this.setFixedRotation(true);
    }
});

footActor = gamvas.Actor.extend({
    create: function(name, x, y, playerActor) {
        this._super(name, x, y);
        this.onPlatform = false;
        this.maxJumps = 2;
        this.jumps = 0; // wait for platform touch
        this.player = playerActor;
        this.restitution = 0;
        this.friction = 0;
        this.density = 0;
        this.object = {
            role: Common.roles.PASSIVE
        };
        this.addState(new footActorState('footState'), true);
        this.bodyRect(this.position.x, this.position.y, Common.reducedTileSize.width/2, Common.reducedTileSize.height/3, gamvas.physics.DYNAMIC);
        this.setFixedRotation(true);
        this.setSensor(true);
    }
});

playerActor = baseActor.extend({
    create: function(name, object) {
        this._super(name, object);

        this.addState(new playerActorState('player'), true);

        this.friction = 0;
        this.restitution = 0;

        this.bodyRect(this.position.x, this.position.y,
                this.object.size.width * Common.reducedTileSize.width,
                this.object.size.height * Common.reducedTileSize.height,
                gamvas.physics.DYNAMIC);
        this.setFixedRotation(true);

        this.foot = new footActor('foot', this.position.x, this.position.y, this);
        var joint = new Box2D.Dynamics.Joints.b2RevoluteJointDef;
        joint.bodyA = this.body;
        joint.bodyB = this.foot.body;
        joint.collideConnected = false;
        joint.localAnchorA.Set(0, 0.25);
        joint.localAnchorB.Set(0, 0);
        gamvas.physics.getWorld().CreateJoint(joint);
    }
});

dangerActor = baseActor.extend({
    create: function(name, object) {
        this._super(name, object);

        this.addState(new dangerActorState('danger'), true);

        this.friction = 0;
        this.restitution = 0;

        this.bodyRect(this.position.x, this.position.y,
                this.object.size.width * Common.tileSize.width,
                this.object.size.height * Common.tileSize.height,
            gamvas.physics.STATIC);
    }
});

passiveActor = baseActor.extend({
    create: function(name, object) {
        this._super(name, object);

        this.addState(new baseActorState('passive'), true);

        this.friction = 0;
        this.restitution = 0;

        this.bodyRect(this.position.x, this.position.y,
                this.object.size.width * Common.tileSize.width,
                this.object.size.height * Common.tileSize.height,
            gamvas.physics.STATIC);
        this.setSensor(true);
    }
});

goalActor = passiveActor.extend({
    create: function(name, object) {
        this._super(name, object);
    }
});

wallActor = obstacleActor.extend({
    create: function(name, col, height) {
        var object = {
            position: {
                row: 0,
                col: col
            },
            size: {
                width: 1,
                height: height
            },
            role: Common.roles.OBSTACLE,
            string: ''
        };

        this._super(name, object);
    }
});