function supply (type) {
    this.bounce = true;
    this.auto_delete = false;
    this.speed = [5, 5];
	this.type = type;
}

supply.prototype = new unit();