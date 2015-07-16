var enemys = new objectList();
var playerBullets = new objectList();
var enemyBullets = new objectList();
var supplyItems = new objectList();
var keyMap = {87: false, 83: false, 65: false, 68:false, 74: false, 49: false, 50: false, 51: false};
// w - 87, s - 83, a - 65, d - 68
// 1 - 49, 2 - 50, 3 - 51
// j - 74
var frameTimer;
var frameRate = 60;
var counter = 0;
var player;
// size = [width, height]
var size = [320, 640];
var game;
var enemy_freq = 200; 
var score = 0;
var isInvader = false;
var enemyType = "enemyA";
var sendCounter = 0;

$(document).ready(function () {
	$(window).keydown( function (e) {
			keyMap[e.keyCode] = true;
			$("#console").text(e.keyCode + " Down");
	});

	$(window).keyup( function (e) {
			keyMap[e.keyCode] = false;
			$("#console").text(e.keyCode + " Up");
	});

	// configure game
	game = $("#game");
	player = new player();
	player.x = size[0] / 2;
	player.y = size[1] - 100;
	player.init($("#player"), null);

	// configure communicator
	// WebSocketを呼び出すURL
	var url = 'ws://' + document.location.host;
	// consoleに対応するHTML要素
	var console = document.getElementById('console');
	// ボタンの状態を更新する関数
	function updateButtons() {
		if (communicator.socket == null) {
			// WebSocketが開いていなければ，コネクトボタンを有効にする
			$('#connect_button').prop('disabled', false);
			$('#connect_defender_button').prop('disabled',false);
			$('#disconnect_button').prop('disabled', true);
		} else {
			// WebSocketが開いている場合
			$('#connect_button').prop('disabled', true);
			$('#connect_defender_button').prop('disabled',true);
			$('#disconnect_button').prop('disabled', false);
		}
	};

	communicator = new Communicator(url, console, updateButtons);
	
	function sendEnemy(enemyType, enemyPosition, supply) {
		communicator.sendJsonMsg({
			type: 'enemy',
			enemy: enemyType,
			position: enemyPosition,
			supply: supply
		});
	}

	// configure connect buttons
	// connect as defender
	$('#connect_defender_button').on('click', function() {
		//disable player
		player.width = 0;
		player.height = 0;
		player.dom.hide();
		$("#state_display").text("1 - Enemy A");

		communicator.connect($('#name').val());
		
		start_loop();
	});

	// connect as invader
	$('#connect_button').on('click', function() {
		communicator.connect($('#name').val());
		isInvader = true;
		
		start_loop();
	});

	$('#disconnect_button').on('click', function() {
		communicator.disconnect();
		isInvader = false;
		// stop loop
		clearInterval(frameTimer);
	});
	
	// send enemy
	$("#game").on('click', function (e) {
		if (!isInvader){
			var supply = "null";
			if (sendCounter % 3 == 0){
				supply = "health";
			} else if (sendCounter % 5 == 0){
				supply = "weapon";
			}
			sendEnemy(enemyType, e.clientX, supply);
			sendCounter++;
		}
	});

	$('#clear_all_button').on('click', function() {
		communicator.sendJsonMsg({type: 'clearAll'});
	});

	// 他のブラウザとできるだけ衝突しないように名前の初期値を設定する
	$('#name').attr('value', (function() {
		var d = new Date();
		return 'user' + (d.getTime() % 10000);
	})());

	// ボタンの表示を更新する
	updateButtons();


});

function start_loop() {
		frameTimer = setInterval(step, 1000/frameRate);
}

function step() {
	if (isInvader){
		// move player
		// direction -> (x, y)
		var direction = [0, 0]
		// key "w" -> up 
		if (keyMap[87]) {
				direction[1] = -1;
		}
		// key "s" -> down
		if (keyMap[83]) {
				direction[1] = 1;
		}
		// key "a" -> left
		if (keyMap[65]) {
				direction[0] = -1;
		}
		// key "d" -> right
		if (keyMap[68]) {
				direction[0] = 1;
		}
		//player move
		player.move(direction[0], direction[1]);
		
		//key "j" -> fire
		if (keyMap[74]) {
				player.fire();
		}
		
		// check hit
		player.hit_check();
	} else {
		if (keyMap[49]) {
			enemyType = "enemyA";
			$("#state_display").text("1 - Enemy A");
		}
		if (keyMap[50]) {
			enemyType = "enemyB";
			$("#state_display").text("2 - Enemy B");
		}
		if (keyMap[51]) {
			enemyType = "enemyC";
			$("#state_display").text("3 - Enemy C");
		}
	}
		// move enemys
		for (var i in enemys.items) {
				try {
						enemys.items[i].step();
						enemys.items[i].hit_check();
						enemys.items[i].fire();
				} catch (error) {
						//console.log(error);
				}
		}
		// move bullets
		for (var i in playerBullets.items) {
				playerBullets.items[i].step();
		}
		for (var i in enemyBullets.items) {
				enemyBullets.items[i].step();
		}
		// move supply
		for (var i in supplyItems.items) {
				supplyItems.items[i].step();
		}
					 
		// counter
		counter++;
}

function add_enemy (enemyType, x, bonus, speedX) {
		var new_enemy;
	switch (enemyType){
		case "enemyA":
			new_enemy = new enemyA();
			break;
		case "enemyB":
			new_enemy = new enemyB();
			break;
		case "enemyC":
			new_enemy = new enemyC();
			break;
		default:
			console.log("unknown enemy " + enemyType);
			break;
	}
	if (bonus !== "null"){
		new_enemy.bonus = bonus;
	}
	if (typeof speedX !== "undefined"){
		new_enemy.speed[0] = speedX;
	}
		var new_id = enemys.add(new_enemy);
		game.append("<div id='enemy_" + new_id + "' class='" + enemyType + " enemy object'></div>");
		// random(TODO)
		enemys.items[new_id].x = x;
		enemys.items[new_id].y = 50;
		enemys.items[new_id].init($("#enemy_" + new_id), enemys);
}

function setScore (new_score) {
		score = new_score;
		$("#score_display").text(score);
}
		
function gameOver (win) {
	if (win){
		$("#state_display").text("Mission Accomplished");
	} else {
		player = null;
		$("#state_display").text("Game Over");
	}
	//clear stage
	for (var i=0; i<stage.timers.length; i++) {
			clearTimeout(stage.timers[i]);
	}
	stage = null;
}