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

	setPosition(x, y, scale) {
		[this.x, this.y] = [x, y];

		if (typeof scale === 'number')
			this.setScale(scale);
		else
			this.render();
	}

	setScale(scale) {
		this.scale = scale;
		this.render();
	}

	render() {
		const x = this.x - this.settings.size / 2;
		const y = this.y - this.settings.size / 2;
		this.elm.style.transform = `translate(${x}px, ${y}px) scale(${this.scale})`;
	}
};
