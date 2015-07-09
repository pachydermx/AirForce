/**
 * dice_images
 */
$(document).ready(function() {

	$("#switch").click(function() {
		if (running) {
			stop();
		} else {
			start();
		}
	})

});

var running = false;
var timer;

function start() {
	running = true;
	$("#switch").text("ストップ");

	timer = setTimeout(step, 100);
}

function stop() {
	running = false;
	$("#switch").text("スタート");
	clearTimeout(timer);

}

function step() {
	var result = Math.floor(6 * Math.random() + 1);
	$("#switch").attr("src", "img/dice" + result +".png");
	timer = setTimeout(step, 200);
}