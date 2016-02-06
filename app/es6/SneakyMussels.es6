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
		this.actionCount = 0;

		this.vue = new Vue({
			el: this.settings.parent,
			data: this,
			methods: {
				start: this.start.bind(this),
				happyValentinesDay: this.happyValentinesDay.bind(this),
			},
		});
	}

	initAudio() {
		this.audioContext = new AudioContext();
		this.sounds = {};

		['run', 'peek'].forEach((key) => {
			this.loadFile(`/sound/${key}.ogg`, (response) => {
				this.audioContext.decodeAudioData(response, (buffer) => {
					this.sounds[key] = buffer;
				});
			});
		});
	}

	playSound(key, delay) {
		if (!this.sounds[key])
			return false;

		delay = delay || 0;

		let source = this.audioContext.createBufferSource();
		source.buffer = this.sounds[key];
		source.connect(this.audioContext.destination);

		source.start(this.audioContext.currentTime + delay);
	}

	loadFile(url, cb) {
		let request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = () => cb(request.response);
		request.send();
	}

	load() {
		this.initAudio();

		// Fake loader
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

		window.setTimeout(this.nextAction.bind(this), 2000);
	}

	nextAction() {
		let option;
		if (++this.actionCount < 4) {
			option = 'peek';
		} else if (this.actionCount === 4) {
			option = 'run';
		} else {
			option = Math.random() > 0.5 ? 'run' : 'peek';
		}
		this[option](() => {
			const nextTime = this.random(3000, 5000);
			window.setTimeout(this.nextAction.bind(this), nextTime);
		});
	}

	peek(cb) {
		if (this.state !== 'sneak')
			return;

		this.playSound('peek', 0.3);

		this.mussel.elm.classList.add('mussel--behind-seafloor');

		const time = 1000;
		const scale = 0.2;
		const xOffset = this.mussel.settings.size * scale;
		const x = this.random(xOffset, window.innerWidth - xOffset);
		const y = window.innerHeight * 0.4;
		const yHidden = window.innerHeight * 0.6;

		this.mussel.setPosition(x, yHidden, scale, false);
		this.mussel.show();
		this.mussel.emitter.start();
		this.mussel.setPosition(x, y, scale, time / 2);

		window.setTimeout(() => {
			this.mussel.setPosition(x, yHidden, scale, time / 2);
		}, time / 2);

		this.actionEndTimeout = window.setTimeout(() => {
			this.mussel.hide();
			this.mussel.emitter.stop();
			this.mussel.elm.classList.remove('mussel--behind-seafloor');
			if (typeof cb === 'function')
				cb();
		}, time);
	}

	run(cb) {
		if (this.state !== 'sneak')
			return;

		this.playSound('run');

		const speed = 0.75; // px per ms
		const time = window.innerWidth / speed;
		const scale = 0.3;
		const xOffset = this.mussel.settings.size * scale;
		const y = this.random(window.innerHeight * 0.8, window.innerHeight - scale * this.mussel.settings.size);
		this.mussel.setPosition(-xOffset, y, scale, false);
		this.mussel.show();
		this.mussel.emitter.start();
		this.mussel.setPosition(window.innerWidth + xOffset, y, scale, time);

		this.actionEndTimeout = window.setTimeout(() => {
			this.mussel.hide();
			this.mussel.emitter.stop();
			if (typeof cb === 'function')
				cb();
		}, time);
	}

	catch() {
		if (this.state !== 'sneak' || this.actionCount < 4)
			return;

		window.clearTimeout(this.actionEndTimeout);
		this.mussel.emitter.stop();

		this.state = 'caught';
		this.mussel.setPosition(window.innerWidth / 2, window.innerHeight / 2, 1);

		setTimeout(() => {
			this.state = 'prize';
			this.mussel.setPosition((window.innerWidth - this.mussel.settings.size) / 2, window.innerHeight / 2, 1);
		}, 1500);
	}

	happyValentinesDay() {
		const scale = 0.5;
		this.state = 'happyValentinesDay';
		this.mussel.setPosition(window.innerWidth / 2, window.innerHeight - this.mussel.settings.size / 2 * scale, scale);
		setTimeout(() => {
			window.h = new BubbleEmitter({
				x: window.innerWidth / 2,
				y: window.innerHeight - this.mussel.settings.size * scale,
				rate: 3,
				lift: 4,
				drift: 2,
				size: [80, 200],
				bubbleClass: 'heart',
				start: true,
			});
		}, 600);
	}

	random(min, max) {
		return Math.random() * (max - min) + min;
	}
};
