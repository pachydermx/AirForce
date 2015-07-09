/**
 * DrawRect マウスのドラッグに応じて四角形を描く
 * コンストラクタとして定義する
 *
 * @constructor 
 * @param canvas キャンバスを引数とする
 */
function DrawRect(canvas) {
  this.canvas = canvas;
  // foregroundのcanvasを作成する
  this.foreground = document.createElement('canvas');
  this.foreground.width = this.canvas.width;
  this.foreground.height = this.canvas.height;
  // canvasと同様にpositionのスタイルをabsoluteに設定する．そうでないと，zIndexがうまく機能しない．
  this.foreground.style.position = 'absolute';
  this.foreground.style.borderStyle = this.canvas.style.borderStyle;
  this.foreground.style.borderWidth = this.canvas.style.borderWidth;
  this.foreground.style.padding = this.canvas.style.padding;
  this.foreground.style.margin = this.canvas.style.margin;
  // foregroundを上にもっていく
  this.foreground.style.zIndex = '1';
  //
  this.canvas.parentNode.appendChild(this.foreground);  
  // マウスイベントリスナーの設定
  // foregroundの方が上にくるので，イベントリスナーはforegroundに設定する
  this.foreground.addEventListener('mousedown', this.mousedown.bind(this), false);
  // イベントリスナのadd/removeが容易になるように，mousemove, mouseup に
  // thisをバインドした関数を設定しておく．
  // 右辺を実行時にはprototypeの値が使われ，thisをバインドした関数自体は
  // thisそのものに設定される．
  this.mousemove = this.mousemove.bind(this);
  this.mouseup = this.mouseup.bind(this);
};

/// インスタンス変数相当の定義
// 最後の座標 (x, yの属性を持つオブジェクトを使って保持)
DrawRect.prototype.lastPos = {x: 0, y: 0};
// 塗りつぶしの色
DrawRect.prototype.fillStyle = "rgba(0, 0, 0, 0.1)";

/// メソッド相当の関数を定義
//メソッドをprototypeの属性として定義していく
//canvasをクリアするメソッド（関数）
DrawRect.prototype.clear = function() {
  var ctx = this.canvas.getContext("2d");
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

//マウスイベントの座標をcanvas内の相対座標に変換する
DrawRect.prototype.transCoord = function(e) {
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

DrawRect.prototype.drawRect = function(left, top, width, height) {
  var ctx = this.canvas.getContext('2d');
  ctx.fillStyle = this.fillStyle;
  ctx.fillRect(left, top, width, height);
};

// foregroundのcanvasエリアをクリアする
DrawRect.prototype.clearForeground = function() {
  var ctx = this.foreground.getContext('2d');
  ctx.clearRect(0, 0, this.foreground.width, this.foreground.height);
};

DrawRect.prototype.mousedown = function(e) {
  // canvas上の座標を計算し記憶しておく
  var pos = this.transCoord(e);
  this.lastPos = pos;
  
  // マウスボタンを押すたびに色を乱数で決める
  var colorR = Math.floor(256 * Math.random());
  var colorG = Math.floor(256 * Math.random());
  var colorB = Math.floor(256 * Math.random());
  // 透明度を乱数で決める (最小値 0.1，最大値 1.0)
  var alpha = Math.random() * 0.9 + 0.1;
  // 塗りつぶす色を設定．Red, Green, Blue, Alpha(透明度)を指定する
  this.fillStyle = "rgba(" + colorR + "," + colorG + "," + colorB + "," + alpha + ")";
  
  // documentにイベントリスナを登録する（描画モードに入ったことになる）
  document.addEventListener('mousemove', this.mousemove, false);
  document.addEventListener('mouseup', this.mouseup, false);
  // chromeでは，デフォルト動作がテキスト選択モードになってしまう？ので，それを防ぐ
  e.preventDefault();
};

DrawRect.prototype.mousemove = function(e) {
  // foregroundを一旦クリアする
  this.clearForeground();
  // 四角形を描く
  var ctx = this.foreground.getContext('2d');
  ctx.fillStyle = this.fillStyle;
  var pos = this.transCoord(e);
  var width = pos.x - this.lastPos.x; 
  var height = pos.y - this.lastPos.y; 
  ctx.fillRect(this.lastPos.x, this.lastPos.y, width, height);
};

DrawRect.prototype.mouseup = function(e) {
  var ctx = this.canvas.getContext('2d');
  // 四角形の大きさが決まったところで，canvasに四角形を描く
  var pos = this.transCoord(e);
  ctx.fillStyle = this.fillStyle;
  var width = pos.x - this.lastPos.x; 
  var height = pos.y - this.lastPos.y;
  ctx.fillRect(this.lastPos.x, this.lastPos.y, width, height);
  // foregroundをクリアする
  this.clearForeground();
  // documentからイベントリスナーを削除する（描画モードから抜けたことになる）
  document.removeEventListener('mousemove', this.mousemove, false);
  document.removeEventListener('mouseup', this.mouseup, false);
};
