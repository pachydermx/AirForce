/*
 * timer_app
 */
$(document).ready(function() {

	switchSignal();
	$("#green_time").keyup(updateTime);
	$("#yellow_time").keyup(updateTime);


});

var state = 0;
var waitTime = [500, 1000];

function updateTime() {
	waitTime[0] = parseInt($("#yellow_time").val());
	waitTime[1] = parseInt($("#green_time").val());
	$("#red_time").val(waitTime[0] + waitTime[1]);
}

function switchSignal(){
	var actual_state = state % 4;
	switch(actual_state){
		case 0:
			setSignalOneWay("v", 0);
			setSignalOneWay("h", 2);
			break;
		case 1:
			setSignalOneWay("v", 0);
			setSignalOneWay("h", 1);
			break;
		case 2:
			setSignalOneWay("v", 2);
			setSignalOneWay("h", 0);
			break;
		case 3:
			setSignalOneWay("v", 1);
			setSignalOneWay("h", 0);
			break;
		default:
			break;
	}
	state++;
	setTimeout(switchSignal, waitTime[state % 2]);
}

function setSignalOneWay(direction , state){
	var signals;
	if (direction == "v"){
		signals = ["signal_n", "signal_s"];
	} else {
		signals = ["signal_w", "signal_e"];
	}
	for (var i in signals){
		setSignal(signals[i], state);
	}
}

function setSignal(selector, state){
	$("#" + selector + " td").removeClass("active");
	switch(state){
		case 0:
			$("#" +selector + " .red").addClass("active");
			break;
		case 1:
			$("#" +selector + " .yellow").addClass("active");
			break;
		case 2:
			$("#" +selector + " .green").addClass("active");
			break;
		default:
			break;
		
	}
}