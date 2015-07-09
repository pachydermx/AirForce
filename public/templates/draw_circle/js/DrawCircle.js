/**
 * DrawCircle マウスクリックで円を描く
 * コンストラクタとして定義する
 *
 * @constructor 
 * @param canvas キャンバスを引数とする
 */
function DrawCircle(canvas) {
  // オブジェクトのcanvas属性にセットする
  this.canvas = canvas;
  
  // canvasにイベントリスナーをつける (メソッド内でthisを使えるようにセットしておく)
  canvas.addEventListener('click', this.drawAtMouseEvent.bind(this), false);
}

// メソッドをprototypeの属性として定義していく

// canvasをクリアするメソッド（関数）
DrawCircle.prototype.clear = function() {



};

// posx, posy の位置に円を描くメソッド（関数）
DrawCircle.prototype.drawCircleAt = function(posx, posy) {



};

// マウスイベントの座標をcanvas内の相対座標に変換する
DrawCircle.prototype.transCoord = function(e) {
  // まず，canvas内の座標位置を求める
  // canvasの左上のウィンドウ中の座標を求める
  var rect = this.canvas.getBoundingClientRect();
  var offsetX = Math.round(rect.left) + this.canvas.clientLeft;
  var offsetY = Math.round(rect.top) + this.canvas.clientTop;
  // 引数eに渡ってくる座標（ウィンドウ中の座標）からcanvasの左上の座標分を引く
  var posx = e.clientX - offsetX;
  var posy = e.clientY - offsetY;
  // オブジェクトとして返す
  return {x: posx, y: posy};
};

// マウスイベントの位置に円を描くメソッド（関数）
DrawCircle.prototype.drawAtMouseEvent = function(e) {
  var pos = this.transCoord(e);
  // pos で指定される座標に円を描く
  this.drawCircleAt(pos.x, pos.y);
};
