function enemy () {
    this.speed = [8, 5];
    this.bounce = true;
    this.auto_delete = false;
}

enemy.prototype = new unit();