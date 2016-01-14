'use strict';

const objectAssign = require('object-assign');
let Bubble = require('Bubble.es6');

const defaultSettings = {
	x: 0,
	y: 0,
	rate: 10,
	drift: 1,
	maxDrift: null,
	lift: 4,
	grow: [2, 5],
	size: [10, 20],
	start: false,
	bubbleClass: '',
	parent: document.body,
	positionElement: null,
};

module.exports = class BubbleEmitter {
	constructor(settings) {
		this.settings = objectAssign({}, defaultSettings, settings);
		[this.x, this.y] = [this.settings.x, this.settings.y];

		this.active = false;
		this.timeout = null;

		if (this.settings.start)
			this.start();
	}

	emitBubble() {
		let [x, y] = [this.x, this.y];
		if (this.settings.positionElement) {
			const elm = this.settings.positionElement;
			[x, y] = [elm.offsetLeft, elm.offsetTop];
		}

		new Bubble({
			x: x,
			y: y,
			drift: this.settings.drift,
			maxDrift: this.settings.maxDrift,
			lift: this.settings.lift,
			grow: this.random.apply(this, this.settings.grow),
			size: this.random.apply(this, this.settings.size),
			class: this.settings.bubbleClass,
			parent: this.settings.parent,
		});
	}

	random(min, max) {
		return Math.random() * (max - min) + min;
	}

	setPosition(x, y) {
		[this.x, this.y] = [x, y];
	}

	start() {
		if (this.active)
			return;

		this.active = true;
		this.tick();
	}

	stop() {
		if (!this.active)
			return;

		this.active = false;
		window.clearTimeout(this.timeout);
		this.timeout = null;
	}

	tick() {
		if (!this.visibilityState || this.visibilityState === 'visible')
			this.emitBubble();

		const rate = this.settings.rate;
		const timeUntilNext = 1000 / this.random(rate * 0.5, rate * 1.5);
		this.timeout = window.setTimeout(this.tick.bind(this), timeUntilNext);
	}
};
