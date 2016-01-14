'use strict';

const objectAssign = require('object-assign');
const Vue = require('Vue');
const Mussel = require('Mussel.es6');
const BubbleEmitter = require('BubbleEmitter.es6');

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
				happyValentinesDay: this.happyValentinesDay.bind(this),
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
		}, 100);
	}

	start() {
		if (this.state !== 'start')
			return;

		this.state = 'sneak';
		this.mussel.elm.addEventListener('click', this.catch.bind(this));
		this.mussel.elm.style.cursor = 'pointer';
		this.mussel.setPosition(300, 300, 0.5).show();
	}

	catch() {
		if (this.state !== 'sneak')
			return;

		this.mussel.elm.style.cursor = '';
		this.state = 'caught';
		this.mussel.setPosition(window.innerWidth / 2, window.innerHeight / 2, 1);

		setTimeout(() => {
			this.state = 'prize';
		}, 1500);
	}

	happyValentinesDay() {
		const scale = 0.5;
		this.state = 'happyValentinesDay';
		this.mussel.setPosition(window.innerWidth / 2, window.innerHeight - this.mussel.settings.size / 2 * scale, scale);
		setTimeout(() => {
			window.h = new BubbleEmitter({
				x: window.innerWidth / 2,
				y: window.innerHeight - this.mussel.settings.size / 2 * scale,
				rate: 5,
				lift: 4,
				drift: 2,
				size: [80, 200],
				bubbleClass: 'heart',
				start: true,
			});
		}, 600);
	}
};
