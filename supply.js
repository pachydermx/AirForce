function supply () {
    this.bounce = true;
    this.auto_delete = false;
    this.speed = [5, 5];
}

supply.prototype = new unit();