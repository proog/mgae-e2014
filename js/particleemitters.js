dustEmitter = gamvas.ParticleEmitter.extend({
	create: function(name, x, y) {
		this._super(name, x, y);
        // load the fire image, centered
		var st = gamvas.state.getCurrentState();
		var file = st.resource.getImage('resources/dustparticle.png');
		var dustImage = new gamvas.Image(file);
		dustImage.setCenter(file.width / 2, file.height / 2);
		this.setImage(dustImage);

        // Number of particles per emit
        this.setParticleLimit(5);

        // emit 40 particles per second. Number of emits per second = 40 / 5 = 8 ~ emit every 125th millisecond.
        this.setParticleRate(30);

        // Only emit in the lower half of a circle. A value of PI would cause emits in all directions (even though 2*PI would make more sense).
        this.setRotationRange(1.8);

        // Set a static rotation for a particle. Math.PI / 2 represents the maximum range of rotation for a square. (90 degrees)
        this.setParticleRotationRange(Math.PI / 2);

        //Vary the speed of the particles between 10-30
        this.setParticleSpeed(20);
        this.setParticleSpeedRange(10);

        // An entry in the table represents [time, alpha]. It must contain at least 2 entries.
        // It is currently set to 100% alpha at birth (0.0) slowly fading to 0% on death (1.0).
        this.setAlphaTable([ [0.0, 1.0], [1.0, 0.0]]);

        // Same procedure as above. Scale to 100% at birth. Begin scale decline after 0.3.
        this.setScaleTable([ [0.0, 1.0], [0.3, 1.0], [1.0, 0.0] ]);

        // A particle is alive between Lifetime - range and Lifetime + range.
        this.setParticleLifeTime(1.2);
        this.setParticleLifeTimeRange(0.5);
    },

    draw: function(t) {
        //Temporary 'fix' to avoid drawing the initial particle position at 0,0
        if(this.position.x == 0 && this.position.y == 0)
            return;

        this._super(t);
    }
});

playerWoundEmitter = dustEmitter.extend({
	create: function(name, x, y) {
		this._super(name, x, y);

        this.setParticleLimit(50);
        this.setParticleRate(500);
        this.setRotationRange(Math.PI * 2);
        this.setParticleSpeed(110);
        this.setParticleSpeedRange(90);
        this.setParticleLifeTime(2.5);
        this.setParticleLifeTimeRange(1.5);
    }
});

collectibleEmitter = dustEmitter.extend({
    create: function(name, x, y) {
        this._super(name, x, y);

        this.setParticleLimit(10);
        this.setParticleRate(500);
        this.setRotationRange(Math.PI * 2);
        this.setParticleSpeed(20);
        this.setParticleSpeedRange(10);
        this.setParticleLifeTime(1.2);
        this.setParticleLifeTimeRange(0.5);
    }
});

goalEmitter = dustEmitter.extend({
    create: function(name, x, y) {
        this._super(name, x, y);

        this.setParticleLimit(2000);
        this.setParticleRate(100);
        this.setRotation(Math.PI);
        this.setRotationRange(0);
        this.setParticleSpeed(80);
        this.setParticleSpeedRange(20);
        this.setParticleLifeTime(5);
        this.setParticleLifeTimeRange(1.5);
    }
});