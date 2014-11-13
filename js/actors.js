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

        /*this.bodyRect(this.position.x + Common.tileSize.width/2, this.position.y + Common.tileSize.height/2,
                this.object.size.width * Common.tileSize.width,
                this.object.size.height * Common.tileSize.height,
                gamvas.physics.DYNAMIC);*/

        this.bodyCircle(this.position.x + Common.tileSize.width/2, this.position.y + Common.tileSize.height/2,
                this.object.size.width * Common.tileSize.width / 2,
            gamvas.physics.DYNAMIC);

        this.setFixedRotation(true);
    }
});