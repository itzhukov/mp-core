const io = require('socket.io')(3030);
const fs = require('fs');
const Player = require('./player.js');

let playerID = null;
let players = [];

let frameTime = 45; //  45ms, 22hz
let lastTime = 0;
let currTime = Date.now()
let timeToCall = 0;
let connect = null;

io.on('connection', onConnected);

setTimeout(frameWatcher, frameTime);

function onConnected(socket){
	console.log('-> Player connected', socket.id);

	socket.on('disconnect', onDisconnect.bind(this, socket) );
	socket.on('clientUpdate', onClientUpdate.bind(this, socket) );

	connect = socket;
	playerID = socket.id;

	players.push( new Player(playerID) )

	socket.emit('connected', { playerID });
	socket.broadcast.emit('anotherConnected', { playerID });

	printPlayers();
}

function onClientUpdate(socket, data){
	// console.log('-> ClientUpdate', data);

	let playerID = data.playerID;
	let x = data.x;
	let y = data.y;

	players.map( (p) => {
		if (p.id == playerID) p.moveTo(x, y);
	});
}

function onDisconnect(socket){
	let playerID = socket.id;

	console.log('-> Player disconnected', playerID);

	players = players.filter( (p) => {
		console.log( p.id !== playerID);
		return p.id !== playerID;
	});

	socket.emit('disconnected', { playerID });
	socket.broadcast.emit('anotherDisconnected', { playerID });

	printPlayers();
	
}

function tick() {
	// console.log('-> tick', currTime);

	if (connect){
		console.log('-> serverUpdate', currTime);

		connect.emit('serverUpdate', {
			players: players
		});

		connect.broadcast.emit('serverUpdate', {
			players: players
		});
	}

	lastTime = currTime + timeToCall;

	setTimeout(frameWatcher, frameTime);
}

function frameWatcher() {
	currTime = Date.now(),
	timeToCall = Math.max( 0, frameTime - ( currTime - lastTime ) );
	
	if (timeToCall == 0) tick();
}

function printPlayers(){
	console.log('------------------players----------------');

	players.map( (p) => {
		console.log( p );
	});

	console.log('--------------------------------------------');
}
