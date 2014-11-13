function createWorld(world, objects) {
    return gamvas.State.extend({
        init: function() {
            var size = indexToWorldPosition(world.height, world.width);
            this.worldDimensions = {
                width: size.x + Common.tileSize.width,
                height: size.y + Common.tileSize.height
            };

            this.gameObjects = {
                player: null,
                obstacles: [],
                dangers: [],
                enemies: [],
                collectibles: [],
                passives: []
            };

            for(var i = 0; i < objects.length; i++) {
                switch(objects[i].role) {
                    case Common.roles.OBSTACLE:
                        this.gameObjects.obstacles.push(new obstacleActor('obstacleActor' + (this.gameObjects.obstacles.length), objects[i]));
                        break;
                    case Common.roles.PLAYER:
                        this.gameObjects.player = new playerActor('playerActor', objects[i]);
                        break;
                    case Common.roles.ENEMY:
                        this.gameObjects.enemies.push(new enemyActor('enemyActor' + (this.gameObjects.enemies.length), objects[i]));
                        break;
                    case Common.roles.DANGER:
                        this.gameObjects.dangers.push(new dangerActor('dangerActor' + (this.gameObjects.dangers.length), objects[i]));
                        break;
                    case Common.roles.PASSIVE:
                        this.gameObjects.passives.push(new passiveActor('passiveActor' + (this.gameObjects.passives.length), objects[i]));
                        break;
                    default:
                        this.gameObjects.obstacles.push(new obstacleActor('obstacleActor' + (this.gameObjects.obstacles.length), objects[i]));
                        break;
                }
            }

            gamvas.physics.setGravity(new gamvas.Vector2D(0, 9.81));
        },
        draw: function(t) {
            var dimensions = gamvas.getCanvasDimension();
            var pos = this.camera.position;
            this.c.fillStyle = 'pink';
            this.c.fillRect(pos.x - dimensions.w/2, pos.y - dimensions.h/2, dimensions.w, dimensions.h);

             for(var gameObject in this.gameObjects){
                 if(gameObject == 'player'){
                    this.gameObjects.player.draw(t);
                 }
                 else {
                    for(var i = 0; i < this.gameObjects[gameObject].length; i++){
                        this.gameObjects[gameObject][i].draw(t);
                    }
                 }
             }

            gamvas.physics.drawDebug();
        },
        postDraw: function(t) {
            // handle player death
            if(this.gameObjects.player.isDead) {
                this.c.fillStyle = '#ff0000';
                this.c.font = 'normal 70px consolas';
                this.c.textAlign = 'center';

                var pos = gamvas.getCanvasDimension();
                this.c.fillText('YOU DIED', pos.w/2, pos.h/2);
            }
        }
    });
}
