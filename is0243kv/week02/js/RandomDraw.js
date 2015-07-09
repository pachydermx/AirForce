// RandomDrawというコンストラクタを定義
function RandomDraw(canvas) {
  // canvas要素をRandomDrawの変数に保存しておく
  this.canvas = canvas;


}

// メソッドをprototypeの属性として定義していく

// canvasをクリアするメソッド（関数）
RandomDraw.prototype.clear = function() {
	var ctx = this.canvas.getContext("2d");
	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

// ランダムに位置，大きさ，色・透明度を求めた円を描くメソッド（関数）
RandomDraw.prototype.draw = function() {
	var radius = Math.random() * 150;
	var x = Math.random() * this.canvas.width;
	var y = Math.random() * this.canvas.height;
	var r = Math.floor(Math.random() * 255);
	var g = Math.floor(Math.random() * 255);
	var b = Math.floor(Math.random() * 255);
	console.log(radius, x, y, r, g, b);

	var ctx = this.canvas.getContext("2d");
	var style = "rgba(" + r +", " + g + ", " + b + ", 0.5)";
	console.log(style);
	ctx.fillStyle = style;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
	ctx.fill();
};
