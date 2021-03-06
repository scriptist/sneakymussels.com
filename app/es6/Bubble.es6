'use strict';

const objectAssign = require('object-assign');


const defaultSettings = {
	x: 0,
	y: 0,
	drift: 1,
	maxDrift: null,
	lift: 4,
	grow: 1,
	size: 10,
	class: '',
	parent: document.body,
};

module.exports = class Bubble {
	constructor(settings) {
		this.settings = objectAssign({}, defaultSettings, settings);
		[this.x, this.y] = [this.settings.x, this.settings.y];
		this.deltaX = this.deltaY = 0;
		this.scale = 1 / this.settings.grow;

		this.createElement();
		this.tick(true);
	}

	createElement() {
		this.elm = document.createElement('div');
		this.elm.className = 'bubble' + (this.settings.class ? ' bubble--' + this.settings.class : '');
		this.elm.style.fontSize = `${this.settings.size}px`;

		this.render();

		this.settings.parent.appendChild(this.elm);
	}

	destroy() {
		this.active = false;
		this.settings.parent.removeChild(this.elm);
	}

	render() {
		const x = this.x - this.settings.size / 2;
		const y = this.y - this.settings.size / 2;
		this.elm.style.transform = `translate(${x}px, ${y}px) scale(${this.scale})`;
	}

	tick(activate) {
		if (activate)
			this.active = true;
		else if (!this.active)
			return;

		this.update();


		if (this.y < -this.settings.size)
			this.destroy();
		else
			window.requestAnimationFrame(this.tick.bind(this));
	}

	update() {
		// First update deltas
		if (-this.deltaY < this.settings.lift)
			this.deltaY -= this.settings.lift / 100;

		if (typeof this.settings.maxDrift === 'number' && Math.abs(this.settings.x - this.x) > this.settings.maxDrift) {
			if (this.settings.x > this.x)
				this.deltaX += 0.25 * this.settings.drift / 10;
			else
				this.deltaX -= 0.25 * this.settings.drift / 10;
		} else {
			this.deltaX += (Math.random() * 2 - 1) * this.settings.drift / 10;
		}

		// Then update position
		this.x += this.deltaX;
		this.y += this.deltaY;

		if (this.scale < 1)
			this.scale += 0.005;

		this.render();
	}
};
