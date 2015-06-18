var objects = [];
var keyMap = {87: false, 83: false, 65: false, 68:false};
// w - 87, s - 83, a - 65, d - 68
var frameTimer;
var frameRate = 30;
var player;

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
    player = new player($("#player"));
    
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
}