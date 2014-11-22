function createWorld(levels) {
    var mainState = gamvas.State.extend({
        init: function() {
            // clean up leftover physics objects when restarting
            gamvas.physics.resetWorld();

            this.levels = levels;

            // for the first level
            if(typeof this.levelIndex == 'undefined')
                this.levelIndex = 0;

            var objects = this.levels[this.levelIndex].objects;
            var world = this.levels[this.levelIndex].world;
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

            // side walls
            this.gameObjects.obstacles.push(new wallActor('leftWall', -1, world.height));
            this.gameObjects.obstacles.push(new wallActor('rightWall', world.width, world.height));

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
                    case Common.roles.COLLECTIBLE:
                        this.gameObjects.collectibles.push(new collectibleActor('collectibleActor' + (this.gameObjects.collectibles.length), objects[i]));
                        break;
                    default:
                        this.gameObjects.obstacles.push(new obstacleActor('obstacleActor' + (this.gameObjects.obstacles.length), objects[i]));
                        break;
                }
            }

            gamvas.physics.setGravity(new gamvas.Vector2D(0, 9.81));

            // if this is not a restarted level, load music
            if(!this.sounds) {
                this.sounds = {
                    music: this.addSound('resources/bgm2.mp3'),
                    jump: this.addSound('resources/jump.mp3'),
                    death: this.addSound('resources/death.wav'),
                    goal: this.addSound('resources/goal.wav'),
                    collectible: this.addSound('resources/collectible.wav'),
                    musicPlaying: false
                };
            }
        },
        update: function(t) {
            // play music
            if(!this.sounds.musicPlaying && this.sounds.music.isReady()) {
                this.sounds.music.loop();
                this.sounds.musicPlaying = true;
            }
        },
        draw: function(t) {
            var dimensions = gamvas.getCanvasDimension();
            var pos = this.camera.position;
            this.c.fillStyle = 'white';
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
            // draw score if there are any collectibles in the level
            if(this.gameObjects.collectibles.length > 0) {
                this.c.textAlign = 'left';
                this.c.font = 'normal 30px consolas';
                this.c.fillStyle = '#000';
                var scorePosX = 10;
                var scorePosY = 90;
                this.c.fillText('Score: ' + this.gameObjects.player.score + '/' + this.gameObjects.collectibles.length, scorePosX, scorePosY);
            }

            this.c.textAlign = 'center';
            var pos = gamvas.getCanvasDimension();

            // handle player death
            if(this.gameObjects.player.isDead) {
                this.c.font = 'normal 70px consolas';
                this.c.fillStyle = '#ff0000';
                this.c.fillText('YOU DIED', pos.w/2, pos.h/2);
                this.c.font = 'normal 30px consolas';
                this.c.fillText('Space to try again', pos.w/2, pos.h/2 + 70);
            }

            // handle player win
            if(this.gameObjects.player.hasWon) {
                this.c.font = 'normal 70px consolas';
                this.c.fillStyle = '#00ff00';
                this.c.fillText('YOU WON', pos.w/2, pos.h/2);
                this.c.font = 'normal 30px consolas';
                this.c.fillText('Space to go to next level', pos.w/2, pos.h/2 + 70);
            }
        },
        onKeyDown: function(key) {
            // pause game on esc
            if(key == gamvas.key.ESCAPE && !this.gameObjects.player.isDead && !this.gameObjects.player.hasWon)
                gamvas.state.setState('pause');

            // action on space
            if(key == gamvas.key.SPACE) {
                if(this.gameObjects.player.hasWon) {
                    this.nextLevel();
                }

                if(this.gameObjects.player.isDead) {
                    console.log('resetting world');
                    this.init();
                }
            }
        },
        enter: function() {
            this.sounds.music.resume();
        },
        leave: function() {
            this.sounds.music.stop();
        },
        nextLevel: function() {
            if(this.levelIndex + 1 < this.levels.length) {
                this.levelIndex++;
                this.init();
            }
            else {
                // game finished?
                this.levelIndex = 0;
                this.init();
            }
        }
    });

    return mainState;
}

pauseState = gamvas.State.extend({
    init: function() {

    },
    update: function(t) {

    },
    draw: function(t) {
        this.c.font = 'normal 70px consolas';
        this.c.textAlign = 'center';
        this.c.fillStyle = '#fff';
        this.c.fillText('PAUSED', 0, 0);

        this.c.font = 'normal 30px consolas';
        this.c.fillText('Esc to resume', 0, 70);
    },
    onKeyDown: function(key) {
        if(key == gamvas.key.ESCAPE)
            gamvas.state.setState('game');
    }
});