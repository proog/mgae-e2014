mainState = gamvas.State.extend({
    init: function() {
        // if no levels have been loaded yet, don't try to set up the game
        if(!this.levels) {
            return;
        }

        this.dustEmitter = new dustEmitter('dustemitter');
        this.addActor(this.dustEmitter);

        this.playerWoundEmitter = new playerWoundEmitter('playerwoundemitter');
        this.addActor(this.playerWoundEmitter);

        this.collectibleEmitter = new collectibleEmitter('collectibleemitter');
        this.addActor(this.collectibleEmitter);

        this.goalEmitter = new goalEmitter('goalemitter');
        this.addActor(this.goalEmitter);

        // clean up leftover physics objects when restarting
        gamvas.physics.resetWorld();

        // for the first level
        if(typeof this.levelIndex == 'undefined')
            this.levelIndex = 0;

        this.overlayAlpha = 1;
        this.overlayDelay = 1.5;
        this.overlayFadeInSpeed = 0.4;
        this.overlayFadeOutSpeed = 1.2;

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
                death: this.addSound('resources/hero_death.mp3'),
                goal: this.addSound('resources/goal.mp3'),
                collectible: this.addSound('resources/collectible.mp3'),
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

        // celebratory particles on win
        if(this.gameObjects.player.hasWon) {
            this.goalEmitter.rotate(5 * t);
        }

        // fade in overlay on win and death, and fade it out on level start
        if(this.gameObjects.player.hasWon || this.gameObjects.player.isDead) {
            this.overlayDelay -= t;
            if(this.overlayDelay < 0 && this.overlayAlpha < 1)
                this.overlayAlpha += this.overlayFadeInSpeed * t;
        }
        else {
            if(this.overlayAlpha > 0)
                this.overlayAlpha -= this.overlayFadeOutSpeed * t;
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

        this.dustEmitter.draw(t);
        this.playerWoundEmitter.draw(t);
        this.collectibleEmitter.draw(t);
        this.goalEmitter.draw(t);

        //gamvas.physics.drawDebug();
    },
    postDraw: function(t) {
        // draw score if there are any collectibles in the level
        if(this.gameObjects.collectibles.length > 0) {
            this.c.textAlign = 'left';
            this.c.font = 'normal 30px consolas';
            this.c.fillStyle = '#000';
            var scorePosX = 10;
            var scorePosY = 30;
            this.c.fillText('Score: ' + this.gameObjects.player.score + '/' + this.gameObjects.collectibles.length, scorePosX, scorePosY);
        }

        this.c.textAlign = 'center';
        var pos = gamvas.getCanvasDimension();

        // uses toFixed() to avoid a bug with exponentially small numbers
        this.c.fillStyle = 'rgba(0,0,0,' + this.overlayAlpha.toFixed(3) + ')';
        this.c.fillRect(0, 0, pos.w, pos.h);

        // handle player death
        if(this.gameObjects.player.isDead) {
            this.c.font = 'normal 70px consolas';
            this.c.fillStyle = 'rgba(255,255,255,' + this.overlayAlpha + ')';
            this.c.fillText('YOU DIED', pos.w/2, pos.h/2);
            this.c.font = 'normal 30px consolas';
            this.c.fillText('Space to try again', pos.w/2, pos.h/2 + 70);
        }

        // handle player win
        if(this.gameObjects.player.hasWon) {
            this.c.font = 'normal 70px consolas';
            this.c.fillStyle = 'rgba(255,255,255,' + this.overlayAlpha + ')';
            this.c.fillText('YOU WON', pos.w/2, pos.h/2);
            this.c.font = 'normal 30px consolas';
            this.c.fillText('Space to go to next level', pos.w/2, pos.h/2 + 70);
        }
    },
    onKeyDown: function(key) {
        // pause game on esc
        if(key == gamvas.key.ESCAPE && !this.gameObjects.player.isDead && !this.gameObjects.player.hasWon) {
            gamvas.state.setState('pause');
        }

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

        return gamvas.key.exitEvent();
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
    },
    loadGame: function(levels) {
        // load levels into the game - necessary for hotswapping files
        this.levels = levels;
        this.levelIndex = 0;
    }
});

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

        return gamvas.key.exitEvent();
    }
});
