'use strict';

const objectAssign = require('object-assign');
const BubbleEmitter = require('BubbleEmitter.es6');

const defaultSettings = {
	x: 0,
	y: 0,
	hidden: false,
	size: 300,
	parent: document.body,
};

module.exports = class Mussel {
	constructor(settings) {
		this.x = this.y = this.scale = null;

		this.settings = objectAssign({}, defaultSettings, settings);
		this.hidden = this.settings.hidden;
		this.createElement();
		this.setPosition(this.settings.x, this.settings.y, this.settings.scale, false);
		this.emitter = new BubbleEmitter({
			positionElement: this.elm,
			y: -this.settings.size / 4,
		});
	}

	createElement() {
		this.elm = document.createElement('div');
		this.elm.className = 'mussel';
		this.elm.style.height = this.elm.style.width = `${this.settings.size}px`;

		this.settings.parent.appendChild(this.elm);
	}

	hide() {
		this.hidden = true;
		return this.render();
	}

	show() {
		this.hidden = false;
		return this.render();
	}

	setPosition(x, y, scale, transition) {
		[this.x, this.y] = [x, y];

		if (typeof scale === 'number')
			return this.setScale(scale, transition);
		else
			return this.render(transition);
	}

	setScale(scale, transition) {
		this.scale = scale;
		return this.render(transition);
	}

	render(transition = true) {
		if (!transition) {
			this.elm.style.transition = 'none';
			this.elm.offsetWidth;
		} else if (typeof transition === 'number') {
			this.elm.style.transitionDuration = `${transition}ms`;
			this.elm.style.transitionTimingFunction = 'linear';
			this.elm.offsetWidth;
		}

		this.elm.style.left = `${this.x}px`;
		this.elm.style.top  = `${this.y}px`;
		this.elm.style.transform = `translate(-50%, -50%) scale(${this.scale})`;
		this.elm.style.display = this.hidden ? 'none' : '';

		if (transition !== true) {
			this.elm.offsetWidth;
			this.elm.style.transition = '';
			this.elm.style.transitionDuration = '';
			this.elm.style.transitionTimingFunction = '';
		}

		return this;
	}
};
