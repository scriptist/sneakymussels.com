'use strict';

const objectAssign = require('object-assign');


const defaultSettings = {
	x: 0,
	y: 0,
	hidden: false,
	size: 100,
	parent: document.body,
};

module.exports = class Mussel {
	constructor(settings) {
		this.settings = objectAssign({}, defaultSettings, settings);
		[this.x, this.y] = [this.settings.x, this.settings.y];
		this.hidden = this.settings.hidden;
		this.scale = 1;
		this.createElement();
	}

	createElement() {
		this.elm = document.createElement('div');
		this.elm.className = 'mussel';

		this.settings.parent.appendChild(this.elm);
		this.render();
	}

	hide() {
		this.hidden = true;
		this.render();
	}

	show() {
		this.hidden = false;
		this.render();
	}

	setPosition(x, y, scale, transition) {
		[this.x, this.y] = [x, y];

		if (typeof scale === 'number')
			this.setScale(scale, transition);
		else
			this.render(transition);
	}

	setScale(scale, transition) {
		this.scale = scale;
		this.render(transition);
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
		const x = this.x - this.settings.size / 2;
		const y = this.y - this.settings.size / 2;
		this.elm.style.transform = `translate(${x}px, ${y}px) scale(${this.scale})`;

		if (transition !== true) {
			this.elm.offsetWidth;
			this.elm.style.transition = '';
			this.elm.style.transitionDuration = '';
			this.elm.style.transitionTimingFunction = '';
		}
	}
};
