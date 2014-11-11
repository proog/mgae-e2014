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
    },
    update: function(t) {
        // listen for input and move actor
        // check for collisions
    },
    draw: function(t) {
        this._super(t);
    }
});