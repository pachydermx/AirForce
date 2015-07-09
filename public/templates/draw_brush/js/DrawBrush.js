/**
 * DrawBrush マウスのドラッグに応じて円を描く
 * コンストラクタとして定義する
 *
 * @constructor 
 * @param canvas キャンバスを引数とする
 */
function DrawBrush(canvas) {
  // オブジェクトのcanvas属性にセットする
  this.canvas = canvas;

  // canvasにイベントリスナーをつける
  // canvas要素内でのマウスダウンが押されたら，描画を開始する
  this.canvas.addEventListener('mousedown', this.mousedown.bind(this), false);
  // イベントリスナのadd/removeが容易になるように，mousemove, mouseup に
  // thisをバインドした関数を設定しておく．
  // 右辺を実行時にはprototypeの値が使われ，thisをバインドした関数自体は
  // thisそのものに設定される．
  this.mousemove = this.mousemove.bind(this);
  this.mouseup = this.mouseup.bind(this);
};

/// インスタンス変数相当の定義
//'ブラシ'の大きさ
DrawBrush.prototype.radius = 10;
//'ブラシ'の色
DrawBrush.prototype.fillStyle = "rgba(0, 0, 0, 0.1)";

// メソッドをprototypeの属性として定義していく
// canvasをクリアするメソッド（関数）
DrawBrush.prototype.clear = function() {



};

//マウスイベントの座標をcanvas内の相対座標に変換する
DrawBrush.prototype.transCoord = function(e) {



};

//posx, posy の位置に'ブラシ'(円)を描くメソッド（関数）
DrawBrush.prototype.drawBrushAt = function(posx, posy) {



};

// mousedownのイベントリスナー
DrawBrush.prototype.mousedown = function(e) {
  // documentにイベントリスナを登録する（描画モードに入ったことになる）
  document.addEventListener('mousemove', this.mousemove, false);
  document.addEventListener('mouseup', this.mouseup, false);
  // (注) chromeでは，テキストの選択が始まらないようにデフォルトの動作を止める
  e.preventDefault();
};

// mousemoveのイベントリスナー
DrawBrush.prototype.mousemove = function(e) {
  // canvas内の座標位置を求め，そこに円を描く
  var pos = this.transCoord(e);
  this.drawBrushAt(pos.x, pos.y);
};

// mouseupのイベントリスナー
DrawBrush.prototype.mouseup = function(e) {
  // documentからイベントリスナーを削除する（描画モードから抜けたことになる）
  document.removeEventListener('mousemove', this.mousemove, false);
  document.removeEventListener('mouseup', this.mouseup, false);
};
