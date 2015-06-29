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
var size = [400, 640];
var game;
var enemy_freq = 200;
var score = 0;

var stage = new stage([
	['enemyA', 5000, 'weapon', 25],
	['enemyA', 6000, null, 50],
	['enemyA', 7000, null, 75],
	['enemyA', 10000, 'weapon', 75],
	['enemyA', 10500, null, 50],
	['enemyA', 11000, null, 25],
	['enemyB', 15000, 'weapon', 50],
	['enemyA', 15500, null, 75],
	['enemyA', 16000, null, 25],
	['enemyB', 20000, 'weapon', 50, 0],
	['enemyB', 22000, 'weapon', 50, -5],
	['enemyB', 26000, 'health', 50, 5],
	['enemyA', 30000, 'weapon', 50],
	['enemyA', 30500, null, 25],
	['enemyA', 31000, null, 75],
	['enemyC', 40000, 'health', 50]
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
    
function gameOver () {
    alert("Game Over");
}