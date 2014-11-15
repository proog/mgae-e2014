baseActor = gamvas.Actor.extend({
    create: function(name, object) {
        this.object = object;

        var pos = indexToWorldPosition(object.position.row, object.position.col);
        this._super(name, pos.x, pos.y);
    }
});

obstacleActor = baseActor.extend({
    create: function(name, object) {
        this._super(name, object);

        this.addState(new obstacleActorState('obstacle'));
        this.setState('obstacle');

        this.friction = 0;
        this.restitution = 0;

        this.bodyRect(this.position.x + Common.tileSize.width/2, this.position.y + Common.tileSize.height/2,
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
    }
})

playerActor = baseActor.extend({
    create: function(name, object) {
        this._super(name, object);

        this.addState(new playerActorState('player'));
        this.setState('player');

        this.friction = 0;
        this.restitution = 0;
        this.canJump = false;

        this.bodyRect(this.position.x + Common.tileSize.width/2, this.position.y + Common.tileSize.height/2,
                this.object.size.width * Common.tileSize.width,
                this.object.size.height * Common.tileSize.height,
                gamvas.physics.DYNAMIC);

        this.setFixedRotation(true);

        var fixtureShape = new Box2D.Collision.Shapes.b2PolygonShape();
        fixtureShape.SetAsOrientedBox(0.1, 0.1, new Box2D.Common.Math.b2Vec2(0,0.2), 0);
        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = fixtureShape;
        fixtureDef.density = 1;
        fixtureDef.isSensor = true;

        this.body.CreateFixture(fixtureDef);
    }
});

dangerActor = baseActor.extend({
    create: function(name, object) {
        this._super(name, object);

        this.addState(new dangerActorState('danger'));
        this.setState('danger');

        this.friction = 0;
        this.restitution = 0;

        this.bodyRect(this.position.x + Common.tileSize.width/2, this.position.y + Common.tileSize.height/2,
                this.object.size.width * Common.tileSize.width,
                this.object.size.height * Common.tileSize.height,
            gamvas.physics.STATIC);
    }
});

passiveActor = baseActor.extend({
    create: function(name, object) {
        this._super(name, object);

        this.addState(new baseActorState('passive'));
        this.setState('passive');

        this.friction = 0;
        this.restitution = 0;

        this.bodyRect(this.position.x + Common.tileSize.width/2, this.position.y + Common.tileSize.height/2,
                this.object.size.width * Common.tileSize.width,
                this.object.size.height * Common.tileSize.height,
            gamvas.physics.STATIC);
    }
});