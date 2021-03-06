//Player.js

DIRECTIONS = {
	RIGHT: 'right',
	LEFT: 'left'
};



/**
 * To be used as a base class for creating new characters - mainly to allow the implementation though I'm not sure 
 * we are going to need this level of abstraction but just incase
 * Call the super class constructor if your are extending this class
 */
class Character {

	constructor(options) {
		// Options must contain the game object
		this.game = options.game;

		// Positioning and Movement
		this.x = options.x ? options.x : 0;
		this.y = options.y ? options.y : 0;
		this.h = options.h ? options.h : 50;
		this.w = options.w ? options.w : 25;

		this.xv = options.xv ? options.xv : 0;
		this.yv = options.yv ? options.yv : 0;
		this.speed = options.speed ? options.speed : 3;

		// Status and Inputs
		this.onG = false;
		this.movingRight = false;
		this.movingLeft = false;
		this.jmpCnt = 0;
		this.fall = false;
		this.alive = true;

		// Interaction
		this.hurtBoxes = []; // List of rectangles relative to px,py
		this.hitBoxes = []; // List of rectangles relative to px,py
		this.currentPlatform = null;


		// Animation
		this.direction = DIRECTIONS.RIGHT;
		this.frameCounter = 0;
	}

	// Called when game determines that you are on a platform
	setCurrentPlatform(plat) {
		this.currentPlatform = plat;
		this.y = plat.y - this.h;
		this.onG = true;
		this.jmpCnt = 0;
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}

	setVelocities(xv, yv) {
		this.xv = xv;
		this.yv = yv;
	}

	/**
	 *	very basic move function, overwrite if necessary
	 */
	move() {
		// Are you moving
		if(this.movingLeft) {
			this.xv = -this.speed;
		} else if (this.movingRight) {
			this.xv = this.speed;
		}

		// slow down or fall
		if (this.onG) {
			this.xv *= 0.75;
			
			// Animation won't stop properly other wise
			if ( Math.abs(this.xv) < 0.5 ) {
				this.xv = 0;
			}
		} else {
			this.yv += this.game.grav;
		}

		this.x += this.xv;
		this.y += this.yv;

		if (this.fall && this.currentPlatform) {
			this.y = this.currentPlatform.y + this.currentPlatform.h - 5;
			this.currentPlatform = null;
		}
	}


	getFrame() {

	}

	getHurtBoxes() {
		var hurtBoxes = [];

		_.each(this.hurtBoxes, function(box) {
			hurtBoxes.push({
				x: box.x + this.x,
				y: box.y + this.y,
				h: box.h,
				w: box.w
			});
		}, this);

		return hurtBoxes;
	}
}

class ControllableCharacter extends Character {

	constructor(options) {
		super(options);
	}

		/************* CONTROLS **************/
	// To make characters do weird things, edit these functions!
	leftPress() {
		this.movingLeft = true;
		this.direction = DIRECTIONS.LEFT;
	}

	leftRelease() {
		this.movingLeft = false;
	}

	rightPress() {
		this.movingRight = true;
		this.direction = DIRECTIONS.RIGHT;
	}

	rightRelease() {
		this.movingRight = false;
	}

	upPress() {
		if (this.jmpCnt < 1) { 
			this.yv = -10;
			this.jmpCnt++;
		}
	}

	upRelease() {
		if (this.onG) {
			if (this.yv < -1) this.yv = -1;
		}
	}

	downPress() {
		this.fall = true;
	}

	downRelease() {
		this.fall = false;
	}
}