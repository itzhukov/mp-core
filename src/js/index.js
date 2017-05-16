import io from 'socket.io-client'
import Player from './player'

(function() {
	var requestAnimationFrame = window.requestAnimationFrame
							|| window.mozRequestAnimationFrame
							|| window.webkitRequestAnimationFrame
							|| window.msRequestAnimationFrame;

	window.requestAnimationFrame = requestAnimationFrame;
})();

const socket = io.connect('http://localhost:3030');
let player = new Player();

socket.on('connected', onConnected );
socket.on('serverUpdate', onServerUpdate );
socket.on('anotherConnected', onAnotherConnected );
socket.on('disconnected', onDisconnected );
socket.on('anotherDisconnected', onAnotherDisconnected );

let players = [];
let frameTime = 60/1000; // 16ms/ 60hz
let lastTime = 0;
let currTime = Date.now()
let timeToCall = 0;

const buttons = document.querySelectorAll('.button');

requestAnimationFrame(frameWatcher);

initKB();

function initKB() {
	buttons.forEach( (btn) => {
		btn.addEventListener('click', keyClick);
	});
}

function keyClick(event) {
	event.preventDefault();

	let target = event.target;
	let move = event.target.dataset.move;

	step (move);
}

function step(move = '') {
	switch(move){
		case 'up':
			player.moveTo(null, --player.y);
			break;

		case 'down':
			player.moveTo(null, ++player.y);
			break;

		case 'left':
			player.moveTo(--player.x, null);
			break;

		case 'right':
			player.moveTo(++player.x, null);
			break;
	}
	console.log(player);
}

function frameWatcher(timestamp) {
	currTime = Date.now(),
	timeToCall = Math.max( 0, frameTime - ( currTime - lastTime ) );
	
	if (timeToCall == 0) tick();
}

function tick() {
	socket.emit('clientUpdate', {
		playerID: player.id,
		x: player.x,
		y: player.y
	});

	lastTime = currTime + timeToCall;

	requestAnimationFrame(frameWatcher);
}

function onConnected(data) {
	console.log('-> connected', data);

	player.setId(data.playerID);
}

function onServerUpdate(data) {
	// console.log('-> serverUpdate', data);

	players = data.players;
}

function onAnotherConnected(data) {
	console.log('-> anotherConnected', data);
}

function onDisconnected(data) {
	console.log('-> disconnected', data);
}

function onAnotherDisconnected(data) {
	console.log('-> anotherDisconnected', data);
}

// (4.22208334636).fixed(n) will return fixed point value to n places, default n = 3
Number.prototype.fixed = function(n) {
	n = n || 3;
	return parseFloat( this.toFixed(n) );
}

// copies a 2d vector like object from one to another
function pos(a) {
	return {
		x:a.x,
		y:a.y
	}
}

// Add a 2d vector with another one and return the resulting vector
function v_add(a, b) {
	return {
		x:(a.x + b.x).fixed(),
		y:(a.y + b.y).fixed()
	}
}

// Subtract a 2d vector with another one and return the resulting vector
function v_sub(a, b) {
	return {
		x:(a.x - b.x).fixed(),
		y:(a.y - b.y).fixed()
	}
}

// Multiply a 2d vector with a scalar value and return the resulting vector
function v_mul_scalar(a, b) {
	return {
		x: (a.x*b).fixed(),
		y:(a.y*b).fixed()
	}
}

// Simple linear interpolation
function lerp(p, n, t) {
	var _t = Number(t);
	_t = ( Math.max( 0, Math.min(1, _t) ) ).fixed();
	return (p + _t * (n - p) ).fixed();
}

// Simple linear interpolation between 2 vectors
function v_lerp(v, tv, t) {
	return {
		x: this.lerp(v.x, tv.x, t),
		y:this.lerp(v.y, tv.y, t)
	};
}