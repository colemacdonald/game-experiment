//Player.js

CHAR_YEEZY = {
	speed: 3,
	frames: {
		'IDLE': {
			img_src: 'rsc/kyell-still.png',
			hurtboxes: [{x: 0, y:0, w: 25, h: 50}],
			hitboxes: []
		}
	}
};

DIRECTIONS = {
	RIGHT: 'right',
	LEFT: 'left'
};

STATES = {
	IDLE: {
		max_count: 7,
		right: [],
		left: []
	},
	WALKING: {
		x_offset: 40,
		right: [
			'rsc/kyell_walk/kyell_walk_hairmove0000.png',
			'rsc/kyell_walk/kyell_walk_hairmove0000.png',
			'rsc/kyell_walk/kyell_walk_hairmove0001.png',
			'rsc/kyell_walk/kyell_walk_hairmove0001.png',
			'rsc/kyell_walk/kyell_walk_hairmove0002.png',
			'rsc/kyell_walk/kyell_walk_hairmove0002.png',
			'rsc/kyell_walk/kyell_walk_hairmove0003.png',
			'rsc/kyell_walk/kyell_walk_hairmove0003.png',
			'rsc/kyell_walk/kyell_walk_hairmove0004.png',
			'rsc/kyell_walk/kyell_walk_hairmove0004.png',
			'rsc/kyell_walk/kyell_walk_hairmove0005.png',
			'rsc/kyell_walk/kyell_walk_hairmove0005.png',
			'rsc/kyell_walk/kyell_walk_hairmove0006.png',
			'rsc/kyell_walk/kyell_walk_hairmove0006.png',
			'rsc/kyell_walk/kyell_walk_hairmove0007.png',
			'rsc/kyell_walk/kyell_walk_hairmove0007.png',
			'rsc/kyell_walk/kyell_walk_hairmove0008.png',
			'rsc/kyell_walk/kyell_walk_hairmove0008.png',
			'rsc/kyell_walk/kyell_walk_hairmove0009.png',
			'rsc/kyell_walk/kyell_walk_hairmove0009.png',
			'rsc/kyell_walk/kyell_walk_hairmove0010.png',
			'rsc/kyell_walk/kyell_walk_hairmove0010.png',
			'rsc/kyell_walk/kyell_walk_hairmove0011.png',
			'rsc/kyell_walk/kyell_walk_hairmove0011.png',
			'rsc/kyell_walk/kyell_walk_hairmove0012.png',
			'rsc/kyell_walk/kyell_walk_hairmove0012.png',
			'rsc/kyell_walk/kyell_walk_hairmove0013.png',
			'rsc/kyell_walk/kyell_walk_hairmove0013.png'
		],
		left: [
			'rsc/kyell_walk/kyell_walk_hairmove0000.png',
			'rsc/kyell_walk/kyell_walk_hairmove0001.png',
			'rsc/kyell_walk/kyell_walk_hairmove0002.png',
			'rsc/kyell_walk/kyell_walk_hairmove0003.png',
			'rsc/kyell_walk/kyell_walk_hairmove0004.png',
			'rsc/kyell_walk/kyell_walk_hairmove0005.png',
			'rsc/kyell_walk/kyell_walk_hairmove0006.png',
			'rsc/kyell_walk/kyell_walk_hairmove0007.png',
			'rsc/kyell_walk/kyell_walk_hairmove0008.png',
			'rsc/kyell_walk/kyell_walk_hairmove0009.png',
			'rsc/kyell_walk/kyell_walk_hairmove0010.png',
			'rsc/kyell_walk/kyell_walk_hairmove0011.png',
			'rsc/kyell_walk/kyell_walk_hairmove0012.png',
			'rsc/kyell_walk/kyell_walk_hairmove0013.png'
		]
	},
	JUMPING: {
		max_count: 7,
		right: [],
		left: []
	},
	INAIR: {
		max_count: 7,
		right: [],
		left: []
	},
	JUMPING: {
		max_count: 7,
		right: [],
		left: []
	}
};



/**
 * To be used as a base class for creating new characters - mainly to allow the implementation though I'm not sure 
 * we are going to need this level of abstraction but just incase
 */
class Character {

	constructor(options) {
		// Options are optional
		options = options || {};

		// Positioning and Movement
		this.x = options.x ? options.x : 0;
		this.y = options.y ? options.y : 0;
		this.h = options.h ? options.h : 50;
		this.w = options.w ? options.w : 25;

		this.xv = options.xv ? options.xv : 0;
		this.yv = options.yv ? options.yv : 0;
		this.grav = options.grav ? options.grav : 0.5;
		this.speed = 3;

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

		if (this.fall) this.y = plat.y + plat.h + 5;
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}

	setVelocities(xv, yv) {
		this.xv = xv;
		this.yv = yv;
	}

	move() {
		if(this.movingLeft) {
			this.xv = -this.speed;
		} else if (this.movingRight) {
			this.xv = this.speed;
		}

		this.x += this.xv;
		this.y += this.yv;
	}

	nextFrame() {
		/** TO OVERRIDE **/
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

	/************* CONTROLS **************/
	// To make characters do weird things, override these functions!
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


class KYeezy extends Character {
	constructor(options) {
		options = options || {};

		options.h = 80;
		options.w = 40;
		

		// Call super class constructor
		super(options);

		// Based of top 
		this.hurtBoxes = [{ x: 5, y:10, h:70, w:30 }];
		this.hitBoxes = [];
	}

	getFrame() {
		var frameGroup,
			direction;
			
			
		// Find group
		if (this.onG && this.xv !== 0) {
			frameGroup = STATES.WALKING;
			
			// Update counter
			this.frameCounter = (this.frameCounter + 1) % frameGroup[this.direction].length;
			return { src: frameGroup[this.direction][this.frameCounter], x_offset: frameGroup.x_offset };
		}
		
		
		if (this.direction === DIRECTIONS.LEFT) {
			return { src: 'rsc/kyell_still_left.png', x_offset: 0 };
		} else {
			return { src: 'rsc/kyell_still_right.png', x_offset: 0 };
		}
	}
}