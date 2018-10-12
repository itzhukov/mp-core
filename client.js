import io from 'socket.io-client';

const socket = io('http://10.8.160.171:9090');
const PARTICLE_SIZE = 5;
const UPDATE_RATE = 60/1000; // 16ms / 60hz;

let canvas = document.createElement('canvas');
let c = canvas.getContext('2d');
let x = 0;
let y = 0;
let clients = {};
let latency = 0;

document.body.appendChild(canvas);
window.addEventListener('resize', resize);
resize();
step();

function step(event){
	c.fillStyle = "rgba(0, 0, 0, 0)";
	c.fillRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = "rgba(255, 255, 255, 1)";

	for (let i in clients){
		if ( clients.hasOwnProperty(i) ){
			let client = clients[i];
			let id = client.id;
			let x = Math.floor(client.x);
			let y = Math.floor(client.y);

			c.beginPath();
			c.arc(client.x, client.y, PARTICLE_SIZE, 0, 2*Math.PI);
			c.fill();
			c.stroke();
		}
	}
	requestAnimationFrame(step);
}


socket.on('connect_error', function(err) {
	console.log('Error connecting to server');
});

socket.on('connect', (connection) => {
	console.log('-> on connect');
	console.log(socket.id);
	window.addEventListener('mousemove', moved);
	window.addEventListener('touchstart', touchmove);
	window.addEventListener('touchmove', touchmove);

	loop();
});

socket.on('tick', (data) => {
	// console.log(data);
	clients = data.clients;
	const realServerTime = data.gameNowTime + (latency / 2);
	document.querySelector('.timer').innerText = moment(realServerTime).format('hh:mm:ss SSS');
});

socket.on('pong', function(ms) {
    latency = ms;
});

function touchmove(e) {
	let targetTouches = e.targetTouches[0]
	x = targetTouches.clientX;
	y = targetTouches.clientY;
}

function touchstart(e) {

}

function moved(e) {
	x = e.x;
	y = e.y;
}

function loop() {
	socket.emit('event', {
		id: socket.id,
		x: Math.floor(x),
		y: Math.floor(y)
	})

	setTimeout(loop, UPDATE_RATE);
}

function resize(){
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
}
