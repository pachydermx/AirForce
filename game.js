var objects = new objectList();
var keyMap = {87: false, 83: false, 65: false, 68:false, 74: false};
// w - 87, s - 83, a - 65, d - 68
// j - 74
var frameTimer;
var frameRate = 60;
var counter = 0;
var player;
var size = [400, 640];
var game;
var enemy_freq = 100;

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
    player.init($("#player"));
    
    
    start_loop();
    
});

function start_loop() {
    frameTimer = setInterval(step, 1000/frameRate);
}

function step() {
    // move player
    var direction = [0, 0]
    if (keyMap[87]) {
        direction[1] = -1;
    }
    if (keyMap[83]) {
        direction[1] = 1;
    }
    if (keyMap[65]) {
        direction[0] = -1;
    }
    if (keyMap[68]) {
        direction[0] = 1;
    }
    player.move(direction[0], direction[1]);
    if (keyMap[74]) {
        player.fire();
    }
    // move objects
    for (var i in objects.items) {
        objects.items[i].step();
    }
    // add enemy
    if (counter % enemy_freq == 0){
        //add_enemy();
    }
    // counter
    counter++;
}

function add_enemy () {
    var new_enemy = new enemy();
    var new_id = objects.add(new_enemy);
    game.append("<div id='enemy_" + new_id + "' class='enemy object'></div>");
    objects.items[new_id].x = 100;
    objects.items[new_id].y = 50;
    objects.items[new_id].init($("#enemy_" + new_id));
}
    