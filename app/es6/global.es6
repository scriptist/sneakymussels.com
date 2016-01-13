'use strict';

const BubbleEmitter = require('BubbleEmitter.es6');

console.log(BubbleEmitter);

window.emitter = new BubbleEmitter({
	start: true,
	rate: 10,
	x: window.innerWidth / 2,
	y: window.innerHeight - 20,
});
