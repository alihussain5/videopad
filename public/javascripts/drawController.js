var isPressed = false;
var ctx;
var prevX, prevY;

var colour;
var thickness = 5;

var socket = io();

function init() {
	ctx = document.getElementById('whiteboard').getContext('2d');

	$('#whiteboard').mousedown(function(e) {
		isPressed = true;
		draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
	});

	$('#whiteboard').mousemove(function(e) {
		if (isPressed) {
			draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
		}
	});

	$('#whiteboard').mouseup(function(e) {
		isPressed = false;
	});

	$('#whiteboard').mouseleave(function(e) {
		isPressed = false;
	});
}

socket.on('drawReceived', function(colour, thickness, prevX, prevY, x, y) {
	drawReceived(colour, thickness, prevX, prevY, x, y);
});

function draw(x, y, mousePressed) {
	if (mousePressed) {
		ctx.beginPath();
		ctx.strokeStyle = colour;
		ctx.lineWidth = thickness;
		ctx.lineJoin = 'round';
		ctx.moveTo(prevX, prevY);
		ctx.lineTo(x, y);
		ctx.closePath();
		ctx.stroke();

		socket.emit('draw', ctx.strokeStyle, ctx.lineWidth, prevX, prevY, x, y);
	}
	prevX = x;
	prevY = y;
}

function drawReceived(colour, thickness, prevX, prevY, x, y) {
	ctx.beginPath();
	ctx.strokeStyle = colour;
	ctx.lineWidth = thickness;
	ctx.lineJoin = 'round';
	ctx.moveTo(prevX, prevY);
	ctx.lineTo(x, y);
	ctx.closePath();
	ctx.stroke();
}

$('#thin').on('click', function() {
    thickness = 1;
});

$('#medium').on('click', function() {
    thickness = 5;
});

$('#thick').on('click', function() {
    thickness = 10;
});

$('.colourpicker').on('changeColor', function(ev) {
    colour = ev.color.toHex();
});

$('#clear').on('click', function() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
});