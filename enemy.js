function enemy () {
    this.speed = [8, 3];
    this.bounce = true;
}

enemy.prototype = new unit();