function enemyA(){
	this.speed = [2, 5];
	this.health = 5;
}

enemyA.prototype = new enemy();

function enemyB(){
	this.speed = [3, 2];
	this.health = 10;
}

enemyB.prototype = new enemy();

function enemyC(){
	this.isBoss = true;
	this.speed = [4, 1];
	this.health = 30;
}

enemyC.prototype = new enemy();
