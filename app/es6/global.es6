'use strict';

const BubbleEmitter = require('BubbleEmitter.es6');

window.emitter = new BubbleEmitter({
	start: true,
	rate: 10,
	drift: 0.5,
	maxDrift: 30,
	lift: 2,
	x: window.innerWidth / 2,
	y: window.innerHeight - 20,
});
