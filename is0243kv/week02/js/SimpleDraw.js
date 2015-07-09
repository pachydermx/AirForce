// コンストラクタ
var SimpleDraw = function(canvas) {
  this.canvas = canvas;
  // マウスハンドラー用にforegroundのcanvasを作成する
  this.foreground = document.createElement('canvas');
  this.foreground.width = this.canvas.width;
  this.foreground.height = this.canvas.height;
  // canvasと同様にpositionのスタイルをabsoluteに設定する．そうでないと，zIndexがうまく機能しない．
  this.foreground.style.position = 'absolute';
  this.foreground.style.borderStyle = this.canvas.style.borderStyle;
  this.foreground.style.borderWidth = this.canvas.style.borderWidth;
  this.foreground.style.padding = this.canvas.style.padding;
  this.foreground.style.margin = this.canvas.style.margin;
  // foregroundを一番上にもっていく
  this.foreground.style.zIndex = '999';
  // foregroundに描かれる長方形のリストを保持する
  this.foregroundRects = [];
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
  // デフォルトはブラシのモードにする
  this.setMode('brush');
};

/// インスタンス変数相当の定義
// 最後の座標 (x, yの属性を持つオブジェクトを使って保持)
SimpleDraw.prototype.lastPos = {x: 0, y: 0};
// 塗りつぶしの色
SimpleDraw.prototype.fillStyle = "rgba(127, 127, 127, 0.5)";
// 線の色
SimpleDraw.prototype.strokeStyle = "rgba(0, 0, 0, 0.3)";
// brushの大きさ
SimpleDraw.prototype.brushSize = 25;
// penの大きさ
SimpleDraw.prototype.penSize = 5;

// set brush
SimpleDraw.prototype.setBrush = function(r, g, b, a, s) {
  this.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
  this.brushSize = s/2;

  $("#preview").css("background-color", this.fillStyle);
  $("#preview").css("width", s);
  $("#preview").css("height", s);
  $("#preview").css("border-radius", s);
}








/// メソッド相当の関数を定義
//canvasエリアをクリアする
SimpleDraw.prototype.clear = function() {
  var ctx = this.canvas.getContext("2d");
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

// 描画する図形の種類を設定する
SimpleDraw.prototype.setMode = function(mode) {
  this.mode = mode;
};

// eventからcanvas内の座標を得る
SimpleDraw.prototype.transCoord = function(e) {
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

// マウスイベントリスナーの定義
SimpleDraw.prototype.mousedown = function(e) {
  // thisを設定しつつ，SimpleDrawに定義されているメソッドを呼び出す
  SimpleDraw[this.mode].mousedown.call(this, e);
  // documentにイベントリスナを登録する（これで描画モードに入る）
  document.addEventListener('mousemove', this.mousemove, false);
  document.addEventListener('mouseup', this.mouseup, false);
  // (注) chromeでは，テキストの選択が始まらないようにデフォルトの動作を止める
  e.preventDefault();
};

SimpleDraw.prototype.mousemove = function(e) {
  // thisを設定しつつ，SimpleDrawに定義されているメソッドを呼び出す
  SimpleDraw[this.mode].mousemove.call(this, e);
};

SimpleDraw.prototype.mouseup = function(e) {
  // thisを設定しつつ，SimpleDrawに定義されているメソッドを呼び出す
  SimpleDraw[this.mode].mouseup.call(this, e);
  // documentからイベントリスナーを削除する（これで描画モードから抜ける）
  document.removeEventListener('mousemove', this.mousemove, false);
  document.removeEventListener('mouseup', this.mouseup, false);
};

//brushの描画
//(x, y)の位置に塗りつぶされた円を描く
SimpleDraw.prototype.drawBrush = function(x, y) {
  var ctx = this.canvas.getContext("2d");

  ctx.fillStyle = this.fillStyle;
  ctx.beginPath();
  ctx.arc(x, y, this.brushSize, 0, 2 * Math.PI, true);
  ctx.fill();
};

//penの描画
//(x0, y0) から (x1, y1)へ線を描く
SimpleDraw.prototype.drawPen = function(x0, y0, x1, y1) {
  var ctx = this.canvas.getContext('2d');
  ctx.lineCap = "butt";
  ctx.lineJoin = "bevel";
  ctx.lineWidth = this.brushSize;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = this.fillStyle;
  ctx.stroke();
};

//rectの描画
//(left, top, width, height)で指定される四角形を描く
SimpleDraw.prototype.drawRect = function(left, top, width, height) {
  var ctx = this.canvas.getContext('2d');
  ctx.fillStyle = this.fillStyle;
  ctx.fillRect(left, top, width, height);
};

//前面のcanvasを更新する
SimpleDraw.prototype.updateForeground = function() {
  var ctx = this.foreground.getContext('2d');
  ctx.clearRect(0, 0, this.foreground.width, this.foreground.height);
};

// brushの定義
// （空の）オブジェクトとして初期化
SimpleDraw.brush = {};

// mousedownのイベントリスナー
SimpleDraw.brush.mousedown = function(e) {
  // documentにイベントリスナを登録する（描画モードに入ったことになる）
  document.addEventListener('mousemove', this.mousemove, false);
  document.addEventListener('mouseup', this.mouseup, false);
  // (注) chromeでは，テキストの選択が始まらないようにデフォルトの動作を止める
  e.preventDefault();
};

// mousemoveのイベントハンドラ
SimpleDraw.brush.mousemove = function(e) {
  // canvas内の座標位置を求め，そこに円を描く
  var pos = this.transCoord(e);
  this.drawBrush(pos.x, pos.y);
};

// mouseupのイベントハンドラ
SimpleDraw.brush.mouseup = function(e) {
  // documentからイベントリスナーを削除する（描画モードから抜けたことになる）
  document.removeEventListener('mousemove', this.mousemove, false);
  document.removeEventListener('mouseup', this.mouseup, false);
};

/// Penのマウスハンドラー
// （空の）オブジェクトとして初期化
SimpleDraw.pen = {};

// mousedownのイベントリスナーを定義
SimpleDraw.pen.mousedown= function(e) {
  // canvas上の座標を計算し，lastPosに設定する
  this.lastPos = this.transCoord(e);
  // documentにイベントリスナを登録する（描画モードに入ったことになる）
  document.addEventListener('mousemove', this.mousemove, false);
  document.addEventListener('mouseup', this.mouseup, false);
  // (注) chromeでは，テキストの選択が始まらないようにデフォルトの動作を止める
  e.preventDefault();
};

// mousemoveのイベントリスナーを定義
SimpleDraw.pen.mousemove = function(e) {
  // canvas内の座標を取得する
  var pos = this.transCoord(e);
  this.drawPen(this.lastPos.x, this.lastPos.y, pos.x, pos.y);
  // 次の線の描画に備える
  this.lastPos = pos;
};

// mouseupのイベントリスナーを定義
SimpleDraw.pen.mouseup = function(e) {
  // documentからイベントリスナーを削除する（描画モードから抜けたことになる）
  document.removeEventListener('mousemove', this.mousemove, false);
  document.removeEventListener('mouseup', this.mouseup, false);
};

/// 四角形のｲﾍﾞﾝﾄリスナーを追加
// （空の）オブジェクトとして初期化
SimpleDraw.rect = {};

SimpleDraw.rect.mousedown = function(e) {
  // canvas上の座標を計算し記憶しておく
  var pos = this.transCoord(e);
  this.lastPos = pos;
  
  //this.fillStyle = "rgba(" + colorR + "," + colorG + "," + colorB + "," + alpha + ")";
  
  // documentにイベントリスナを登録する（描画モードに入ったことになる）
  document.addEventListener('mousemove', this.mousemove, false);
  document.addEventListener('mouseup', this.mouseup, false);
  // chromeでは，デフォルト動作がテキスト選択モードになってしまう？ので，それを防ぐ
  e.preventDefault();
};

SimpleDraw.rect.mousemove = function(e) {
  // foregroundを一旦クリアする
  this.updateForeground();
  // 四角形を描く
  var ctx = this.foreground.getContext('2d');
  ctx.fillStyle = this.fillStyle;
  var pos = this.transCoord(e);
  var width = pos.x - this.lastPos.x; 
  var height = pos.y - this.lastPos.y; 
  ctx.fillRect(this.lastPos.x, this.lastPos.y, width, height);
};

SimpleDraw.rect.mouseup = function(e) {
  var ctx = this.canvas.getContext('2d');
  // 四角形の大きさが決まったところで，canvasに四角形を描く
  var pos = this.transCoord(e);
  ctx.fillStyle = this.fillStyle;
  var width = pos.x - this.lastPos.x; 
  var height = pos.y - this.lastPos.y;
  ctx.fillRect(this.lastPos.x, this.lastPos.y, width, height);
  // foregroundをクリアする
  this.updateForeground();
  // documentからイベントリスナーを削除する（描画モードから抜けたことになる）
  document.removeEventListener('mousemove', this.mousemove, false);
  document.removeEventListener('mouseup', this.mouseup, false);
};
