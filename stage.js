// enemyList [[enemyType, appearTime, bonus, x, speedX]]
function stage(enemyList) {
	this.enemyList = enemyList;
	this.timers = [];
}

// start stage
stage.prototype.play = function () {
	for (var i in this.enemyList){
		var item = this.enemyList[i];
		this.timers.push(setTimeout(
			"add_enemy('"+item[0]+"', "+item[3]+", '"+item[2]+"', "+item[4]+")"
		, item[1]));
	}
}