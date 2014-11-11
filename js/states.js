function createWorld(world, objects) {
    return gamvas.State.extend({
        init: function() {
            var size = indexToPosition(world.height, world.width);
            this.worldDimensions = {
                width: size.x + Common.tileSize.width,
                height: size.y + Common.tileSize.height
            };

            this.gameObjects = [];

            for(var i = 0; i < objects.length; i++) {
                var object;
                switch(objects[i].role) {
                    case Common.roles.OBSTACLE:
                        object = new obstacleActor('gameObject' + i, objects[i]);
                        break;
                    case Common.roles.PLAYER:
                        object = new playerActor('gameObject' + i, objects[i]);
                        break;
                    default:
                        object = new obstacleActor('gameObject' + i, objects[i]);
                        break;
                }

                this.gameObjects.push(object);
            }
        },
        draw: function(t){
            var dimensions = gamvas.getCanvasDimension();

            this.c.fillStyle = '#ff0000';
            this.c.fillRect(-dimensions.w/2, -dimensions.h/2, dimensions.w, dimensions.h);

            for(var i = 0; i < this.gameObjects.length; i++) {
                this.gameObjects[i].draw(t);
            }
        }
    });
}
