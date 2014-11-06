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
    draw: function(time){
        var dimensions = gamvas.getCanvasDimension();
        var tileWidth = dimensions.w / tilesPerRow;
        var tileHeight = dimensions.h / tilesPerColumn;
        for(var i = 0; i < tilesPerColumn; i++){
            for(var j = 0; j < tilesPerRow; j++){
                var position = getOffsetPosition(j * tileWidth, i * tileHeight);
                this.c.fillStyle = (i+j) % 2 == 0 ? colorBlack : colorWhite;
                this.c.fillRect(position.x, position.y, tileWidth, tileHeight);
            }
        }
    }
})

testActor = gamvas.Actor.extend({
    create: function(name, x, y){
        this.__super(name, x, y);
        var state = gamvas.state.getCurrentState();
        this.setFile(state.resource.getImage(null), 64, 64, 10, 20);
        var defState = this.testActor.getCurrentState();
        defState.update = function(t) {
            this.actor.move(10 * t, 0);
        }
    }
})

function drawActor(name, position, img){

}

function positionFromIndex(i, j){
    return {"x": tileWidth * i, "y": tileHeight * j};
}

gamvas.event.addOnLoad(function() {
    gamvas.state.addState(new mainState('mainGame'));
    gamvas.start('gameCanvas');
})

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

