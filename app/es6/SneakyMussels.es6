'use strict';

const objectAssign = require('object-assign');
const Vue = require('Vue');
const Mussel = require('Mussel.es6');

const defaultSettings = {
	parent: document.body,
};

module.exports = class SneakMussels {
	constructor(settings) {
		this.settings = objectAssign({}, defaultSettings, settings);

		this.state = 'loading';
		this.loadedAmount = 0;
		this.load();
		this.mussel = new Mussel({
			hidden: true,
			parent: this.settings.parent,
		});

		this.vue = new Vue({
			el: this.settings.parent,
			data: this,
			methods: {
				start: this.start.bind(this),
			},
		});
	}

	load() {
		const i = setInterval(() => {
			this.loadedAmount += 0.1;
			if (this.loadedAmount >= 0.99) {
				this.loadedAmount = 1;
				this.state = 'start';
				clearInterval(i);
			}
		}, 200);
	}

	start() {
		if (this.state !== 'start')
			return;

		this.state = 'sneak';


	}
};
