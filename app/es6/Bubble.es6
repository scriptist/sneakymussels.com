'use strict';

const objectAssign = require('object-assign');


const defaultSettings = {
	x: 0,
	y: 0,
	drift: 1,
	lift: 10,
	grow: 1,
	size: 10,
	parent: document.body,
};

module.exports = class Bubble {
	constructor(settings) {
		this.settings = objectAssign({}, defaultSettings, settings);
		[this.x, this.y] = [this.settings.x, this.settings.y];
		this.deltaX = this.deltaY = 0;
		this.scale = 1 / this.settings.grow;

		this.createElement();
	}

	createElement() {
		this.elm = document.createElement('div');
		this.elm.className = 'bubble';
		this.elm.style.width = this.elm.style.height = `${this.settings.size}px`;

		this.setTransform();

		this.settings.parent.appendChild(this.elm);
	}

	setTransform() {
		const x = this.x - this.settings.size / 2;
		const y = this.y - this.settings.size / 2;
		this.elm.style.transform = `translate(${x}px, ${y}px) scale(${this.scale})`;
	}
};
