function createWorld(world, objects) {
    return gamvas.State.extend({
        init: function() {
            this.worldDimensions = {
                width: world.width * Common.tileSize.width,
                height: world.height * Common.tileSize.height
            };

            this.gameObjects = {
                player: null,
                obstacles: [],
                dangers: [],
                enemies: [],
                collectibles: [],
                passives: [],
                goals: []
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
                    case Common.roles.GOAL:
                        this.gameObjects.goals.push(new goalActor('goalActor' + (this.gameObjects.goals.length), objects[i]));
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

             for(var key in this.gameObjects) {
                 if(key == 'player') {
                    this.gameObjects.player.draw(t);
                 }
                 else {
                    for(var i = 0; i < this.gameObjects[key].length; i++) {
                        this.gameObjects[key][i].draw(t);
                    }
                 }
             }

            gamvas.physics.drawDebug();
        },
        postDraw: function(t) {
            this.c.font = 'normal 70px consolas';
            this.c.textAlign = 'center';
            var pos = gamvas.getCanvasDimension();

            // handle player death
            if(this.gameObjects.player.isDead) {
                this.c.fillStyle = '#ff0000';
                this.c.fillText('YOU DIED', pos.w/2, pos.h/2);
            }

            // handle player death
            if(this.gameObjects.player.hasWon) {
                this.c.fillStyle = '#00ff00';
                this.c.fillText('YOU WON', pos.w/2, pos.h/2);
            }
        }
    });
}
