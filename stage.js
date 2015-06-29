// enemyList [[enemyType, appearTime, bonus, x, speedX]]
function stage(enemyList) {
	this.enemyList = enemyList;
}

stage.prototype.play = function () {
	for (var i in this.enemyList){
		var item = this.enemyList[i];
		setTimeout(
			"add_enemy('"+item[0]+"', "+item[3]+", '"+item[2]+"', "+item[4]+")"
		, item[1]);
	}
}