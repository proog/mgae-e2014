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
    }
});

playerActor = baseActor.extend({
    create: function(name, object) {
        this._super(name, object);

        this.addState(new playerActorState('player'));
        this.setState('player');
    }
});