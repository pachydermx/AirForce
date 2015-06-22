function enemy () {
    this.speed = [8, 3];
    this.bounce = true;
    this.point = 100;
    this.health = 5;
    // hit check when be hit by player's bullets
    this.hit_check = function () {
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
}
// new a unit as the enemies' prototype
enemy.prototype = new unit();