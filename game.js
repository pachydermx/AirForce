var enemys = new objectList();
var playerBullets = new objectList();
var enemyBullets = new objectList();
var supplyItems = new objectList();
var keyMap = {87: false, 83: false, 65: false, 68:false, 74: false};
// w - 87, s - 83, a - 65, d - 68
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
// [enemyType, appearTime, bonus, x, speedX]
// x in [0, 100]

//step begin time
sTime = [0, 5000, 10000, 15000, 20000];
var stage = new stage([
    // step 0
    ['enemyA', 1000, 'weapon', 25],
	['enemyA', 1500, null, 50],
	['enemyA', 2000, null, 75, 4],
	['enemyA', 2500, null, 50],
	['enemyA', 3000, null, 25],
	['enemyB', 4000, 'weapon', 50],
    // step 1
    ['enemyA', sTime[1] + 2000, null, 50, -3],
    ['enemyA', sTime[1] + 2400, null, 50, -3],
    ['enemyA', sTime[1] + 2800, null, 50, -3],
    ['enemyA', sTime[1] + 3200, null, 50, -2],
    ['enemyA', sTime[1] + 3600, null, 50, -2],
    ['enemyA', sTime[1] + 4000, null, 50, -2],
    ['enemyA', sTime[1] + 4400, null, 50, -1],
    ['enemyA', sTime[1] + 4800, null, 50, -1],
    ['enemyB', sTime[1] + 5200, 'weapon', 50, -1],
    // step 2
    ['enemyA', sTime[2] + 2000, null, 50, 3],
    ['enemyA', sTime[2] + 2400, null, 50, 3],
    ['enemyA', sTime[2] + 2800, null, 50, 3],
    ['enemyA', sTime[2] + 3200, null, 50, 2],
    ['enemyA', sTime[2] + 3600, null, 50, 2],
    ['enemyA', sTime[2] + 4000, 'health', 50, 2],
    ['enemyA', sTime[2] + 4400, null, 50, 1],
    ['enemyA', sTime[2] + 4800, null, 50, 1],
    ['enemyB', sTime[2] + 5200, 'weapon', 50, 1],
    // step 3
    ['enemyA', sTime[3] + 2000, null, 100, -4],
    ['enemyA', sTime[3] + 2400, null, 100, -4],
    ['enemyA', sTime[3] + 2800, null, 100, -4],
    ['enemyA', sTime[3] + 3200, null, 100, -3],
    ['enemyA', sTime[3] + 3600, null, 100, -3],
    ['enemyA', sTime[3] + 4000, null, 100, -3],
    ['enemyA', sTime[3] + 4400, null, 100, -2],
    ['enemyA', sTime[3] + 4800, null, 100, -2],
    ['enemyB', sTime[3] + 5200, 'weapon', 100, -2],
    ['enemyA', sTime[3] + 2000, null, 0, 4],
    ['enemyA', sTime[3] + 2400, null, 0, 4],
    ['enemyA', sTime[3] + 2800, null, 0, 4],
    ['enemyA', sTime[3] + 3200, null, 0, 3],
    ['enemyA', sTime[3] + 3600, null, 0, 3],
    ['enemyA', sTime[3] + 4000, 'health', 0, 3],
    ['enemyA', sTime[3] + 4400, null, 0, 2],
    ['enemyA', sTime[3] + 4800, null, 0, 2],
    ['enemyB', sTime[3] + 5200, 'weapon', 0, 2],
	]);

$(document).ready(function () {
    $(window).keydown( function (e) {
        keyMap[e.keyCode] = true;
        $("#console").text(e.keyCode + " Down");
    });
    
    $(window).keyup( function (e) {
        keyMap[e.keyCode] = false;
        $("#console").text(e.keyCode + " Up");
    });
    
    // configure
    game = $("#game");
    player = new player();
	player.x = size[0] / 2;
	player.y = size[1] - 100;
    player.init($("#player"), null);
    
	stage.play();
    
    start_loop();
    
});

function start_loop() {
    frameTimer = setInterval(step, 1000/frameRate);
}

function step() {
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
    
    // move enemys
    for (var i in enemys.items) {
        try {
            enemys.items[i].step();
            enemys.items[i].hit_check();
        } catch (error) {
            //console.log(error);
        }
    }
    // move bullets
    for (var i in playerBullets.items) {
        playerBullets.items[i].step();
    }
    // move supply
    for (var i in supplyItems.items) {
        supplyItems.items[i].step();
    }
    // check hit
    player.hit_check();
           
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
    enemys.items[new_id].x = size[0] * x / 100;
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
		$("#state_display").text("Game Over");
	}
}