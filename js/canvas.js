/**
 * Created by Jacob on 04/11/2014.
 */

var colorBlack = "#000000";
var colorWhite = "#FFFFFF";
var tilesPerRow = 10;
var tilesPerColumn = 6;

var tileWidth = 30;
var tileHeight = 30;

function getOffsetPosition(x, y){
    var dimensions = gamvas.getCanvasDimension();
    var offsetx = dimensions.w / 2;
    var offsety = dimensions.h / 2;
    return {"x": x - offsetx, "y": y - offsety};
}

mainState = gamvas.State.extend({
    init: function() {
        this.passives = [];
        this.passives.push(new testActor('test', 0, 0));

        this.passives.push(new testActor('test2', 200, 0));
    },
    draw: function(t){
        var dimensions = gamvas.getCanvasDimension();

        this.c.fillStyle = '#ff0000';
        this.c.fillRect(-dimensions.w/2, -dimensions.h/2, dimensions.w, dimensions.h);

        for(var i = 0; i < this.passives.length; i++) {
            this.passives[i].draw(t);
        }
    }
});

testActorState = gamvas.ActorState.extend({
    init: function() {
        // define our local variables
        this.counter = 0;
    },

    // this is the actors brain, t is time in seconds since last tought
    update: function(t) {
        // count up PI per second, which means we will move
        // one second up, one second down, as 360 degrees is 2*Math.PI in
        // radians
        this.counter += Math.PI*t;

        // clamp our counter to 360 degrees aka 2*Math.PI in radians
        if (this.counter > 2*Math.PI) {
            this.counter -= 2*Math.PI;
        }

        // move our actor the sin value of counter, which gives him
        // a smooth circular motion
        this.actor.move(0, -10*Math.sin(this.counter));
    },
    draw: function(t) {
        this._super(t);

        var a = this.actor.getCurrentAnimation();
        a.c.fillStyle = '#000';
        a.c.font = 'normal 46px consolas';
        a.c.textAlign = 'center';
        a.c.fillText('S', this.actor.position.x + a.width/2, this.actor.position.y + a.height);
        console.log(a.width + ' x ' + a.height);
    }
});

testActor = gamvas.Actor.extend({
    create: function(name, x, y) {
        this._super(name, x, y);
        var state = gamvas.state.getCurrentState();
        this.setFile(state.resource.getImage('resources/tile.png'));
        this.addState(new testActorState('test'));
        this.setState('test');
    }
});

function drawActor(name, position, img){

}

function positionFromIndex(i, j){
    return {"x": tileWidth * i, "y": tileHeight * j};
}

gamvas.event.addOnLoad(function() {
    gamvas.state.addState(new mainState('mainGame'));
    gamvas.start('gameCanvas');
});

function drawtiles(id, tilesPerRow, tilesPerColumn){
    var element = document.getElementById(id);
    var context = element.getContext("2d");
    var canvasWidth = element.offsetWidth;
    var canvasHeight = element.offsetHeight;
    var tileWidth = canvasWidth / tilesPerRow;
    var tileHeight = canvasHeight / tilesPerColumn;
    var red = "#FF0000";
    var black = "#000000";

    for(var i = 0; i < tilesPerColumn; i++){
        for(var j = 0; j < tilesPerRow; j++){
            var x = j * tileWidth;
            var y = i * tileHeight;
            context.fillStyle = (i+j) % 2 == 0 ? red : black;
            context.fillRect(x, y, tileWidth, tileHeight);
        }
    }
}

