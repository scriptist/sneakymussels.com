'use strict';

const objectAssign = require('object-assign');
const Vue = require('Vue');

const defaultSettings = {
	parent: document.body,
};

module.exports = class SneakMussels {
	constructor(settings) {
		this.settings = objectAssign({}, defaultSettings, settings);

		this.state = 'loading';
		this.loadedAmount = 0;
		this.load();

		this.vue = new Vue({
			el: this.settings.parent,
			data: this,
			methods: {
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
};
