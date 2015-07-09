/**
 * DrawPen マウスのドラッグに応じて線を描く
 * コンストラクタとして定義する
 *
 * @constructor 
 * @param canvas キャンバスを引数とする
 */
function DrawPen(canvas) {
  // オブジェクトのcanvasプロパティにセットする
  this.canvas = canvas;

  // canvasにイベントリスナーをつける
  // canvas要素内でのマウスボタンが押された時の処理
  this.canvas.addEventListener('mousedown', this.mousedown.bind(this), false);
  // イベントリスナのadd/removeが容易になるように，mousemove, mouseup に
  // thisをバインドした関数を設定しておく．
  // 右辺を実行時にはprototypeの値が使われ，thisをバインドした関数自体は
  // thisに設定される
  this.mousemove = this.mousemove.bind(this);
  this.mouseup = this.mouseup.bind(this);
}

/// インスタンス変数相当の定義
//'ペン'の大きさ
DrawPen.prototype.penSize = 5;
// 'ペン'の色
DrawPen.prototype.strokeStyle = "rgba(0, 0, 0, 0.3)";
// 最後の座標 (x, yの属性を持つオブジェクトとして保持)
DrawPen.prototype.lastPos = {x: 0, y: 0};

// メソッドをprototypeの属性として定義していく
// canvasをクリアするメソッド（関数）
DrawPen.prototype.clear = function() {
  var ctx = this.canvas.getContext("2d");
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

//マウスイベントの座標をcanvas内の相対座標に変換する
DrawPen.prototype.transCoord = function(e) {
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


//penの描画
DrawPen.prototype.drawPenFromTo = function(x0, y0, x1, y1) {
  var ctx = this.canvas.getContext('2d');
  ctx.lineCap = "butt";
  ctx.lineJoin = "bevel";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = this.strokeStyle;
  ctx.stroke();

};

//mousedownのイベントリスナー
DrawPen.prototype.mousedown = function(e) {
  // canvas上の座標を計算し，lastPosに設定する
  this.lastPos = this.transCoord(e);
  // documentにイベントリスナを登録する（描画モードに入ったことになる）
  document.addEventListener('mousemove', this.mousemove, false);
  document.addEventListener('mouseup', this.mouseup, false);
  // (注) chromeでは，テキストの選択が始まらないようにデフォルトの動作を止める
  e.preventDefault();
};

// mousemoveのイベントリスナー
DrawPen.prototype.mousemove = function(e) {
  // canvas内の座標を取得する
  var pos = this.transCoord(e);
  this.drawPenFromTo(this.lastPos.x, this.lastPos.y, pos.x, pos.y);
  // 次の線の描画に備える
  this.lastPos = pos;
};

// mouseupのイベントリスナー
DrawPen.prototype.mouseup = function(e) {
  // documentからイベントリスナーを削除する（描画モードから抜けたことになる）
  document.removeEventListener('mousemove', this.mousemove, false);
  document.removeEventListener('mouseup', this.mouseup, false);
};
