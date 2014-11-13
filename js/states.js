function createWorld(world, objects) {
    return gamvas.State.extend({
        init: function() {
            var size = indexToWorldPosition(world.height, world.width);
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
                    case Common.roles.DANGER:
                        object = new dangerActor('gameObject' + i, objects[i]);
                        break;
                    case Common.roles.PASSIVE:
                        object = new passiveActor('gameObject' + i, objects[i]);
                        break;
                    default:
                        object = new obstacleActor('gameObject' + i, objects[i]);
                        break;
                }

                this.gameObjects.push(object);
            }

            gamvas.physics.setGravity(new gamvas.Vector2D(0, 9.81));
        },
        draw: function(t) {
            var dimensions = gamvas.getCanvasDimension();

            this.c.fillStyle = '#ff0000';
            this.c.fillRect(0, 0, dimensions.w, dimensions.h);

            for(var i = 0; i < this.gameObjects.length; i++) {
                this.gameObjects[i].draw(t);
            }

            gamvas.physics.drawDebug();
        },
        postDraw: function(t) {
            // handle player death
            if(!this.isDead) {
                this.c.fillStyle = '#ff0000';
                this.c.font = 'normal 70px consolas';
                this.c.textAlign = 'center';

                var pos = gamvas.getCanvasDimension();
                this.c.fillText('YOU DIED', pos.w/2, pos.h/2);
            }
        }
    });
}
