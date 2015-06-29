function enemy () {
    this.bounce = true;
    this.point = 100;
    this.bonus = null;
    // hit check when be hit by player's bullets
}
// new a unit as the enemies' prototype
enemy.prototype = new unit();

enemy.prototype.hit_check = function () {
    var result = false;
    for (var i in playerBullets.items){
        if (this.collusion_check(playerBullets.items[i])){
            // delete objects
            this.hit();
            playerBullets.items[i].delete();
            // calc score
            setScore(score + this.point);
            // return result
            result = true;
        }
    }
    return result;
}

enemy.prototype.delete = function(hitToDie) {
    if (this.bonus != null && hitToDie){
        var new_supply = new supply(this.bonus);
        // add new supply as Object
        var new_id = supplyItems.add(new_supply);
        // add new bullet as DOM
        game.append("<div id='supply_" + new_id + "' class='supply object'></div>");
        supplyItems.items[new_id].x = this.x;
        supplyItems.items[new_id].y = this.y;
        supplyItems.items[new_id].init($("#supply_" + new_id), supplyItems);
    }
    unit.prototype.delete.apply(this, []);
}