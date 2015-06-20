function enemy () {
    this.speed = [8, 5];
    this.bounce = true;
}

enemy.prototype = new unit();