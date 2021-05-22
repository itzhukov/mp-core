const socketServer = require('http').createServer();
const io = require('socket.io')(socketServer, {pingInterval: 45} );
const UPDATE_RATE = 45; // 45ms, 22hz;

let clients = {};
let socket = null;
const gameStartTime = new Date().getTime();
let STATE = [];

io.on('connection', (client) => {
	socket = client;

	let id = client.id;

	clients[id] = {
		id: id,
		x: 0,
		y: 0
	}

	console.log('-> connection: ', id);

	client.on('event', (data) => {
		if (clients[data.id]){
			clients[data.id].x = lerp(clients[data.id].x, data.x, 0.1);
			clients[data.id].y = lerp(clients[data.id].y, data.y, 0.1);
		}
	});

	client.on('disconnect', () => {
		console.log('-> disconnect: ', id);
		delete clients[id];
	});


	function lerp (start, end, amt){
		return (1-amt) * start + amt * end
	}


});

socketServer.listen(9090);

loop();

function loop() {
	io.sockets.emit('tick', {
		clients,
		gameStartTime,
		gameNowTime: gameStartTime + new Date().getTime()
	});

	monitor();

	setTimeout(loop, UPDATE_RATE);
}

function monitor() {
	let message = '';

	for (let i in clients){
		if ( clients.hasOwnProperty(i) ){
			let client = clients[i];
			let id = client.id;
			let x = client.x;
			let y = client.y;

			message += ` ${id} x:${x} y:${y}  |`;
		}
	}

	console.log(message);
}
