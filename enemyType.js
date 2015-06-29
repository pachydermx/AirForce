function enemyA(){
	this.health = 5;
}

enemyA.prototype = new enemy();

function enemyB(){
	this.health = 10;
}

enemyB.prototype = new enemy();

function enemyC(){
	this.health = 30;
}

enemyC.prototype = new enemy();
