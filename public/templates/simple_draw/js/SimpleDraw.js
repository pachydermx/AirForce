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
SimpleDraw.prototype.fillStyle = "rgba(0, 0, 0, 0.1)";
// 線の色
SimpleDraw.prototype.strokeStyle = "rgba(0, 0, 0, 0.3)";
// brushの大きさ
SimpleDraw.prototype.brushSize = 10;
// penの大きさ
SimpleDraw.prototype.penSize = 5;

/// メソッド相当の関数を定義
//canvasエリアをクリアする
SimpleDraw.prototype.clear = function() {



};

// 描画する図形の種類を設定する
SimpleDraw.prototype.setMode = function(mode) {
  this.mode = mode;
};

// eventからcanvas内の座標を得る
SimpleDraw.prototype.transCoord = function(e) {



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



};

//penの描画
//(x0, y0) から (x1, y1)へ線を描く
SimpleDraw.prototype.drawPen = function(x0, y0, x1, y1) {



};

//rectの描画
//(left, top, width, height)で指定される四角形を描く
SimpleDraw.prototype.drawRect = function(left, top, width, height) {



};

//前面のcanvasを更新する
SimpleDraw.prototype.updateForeground = function() {



};

// brushの定義
// （空の）オブジェクトとして初期化
SimpleDraw.brush = {};

// mousedownのイベントリスナー
SimpleDraw.brush.mousedown = function(e) {
};

// mousemoveのイベントハンドラ
SimpleDraw.brush.mousemove = function(e) {



};

// mouseupのイベントハンドラ
SimpleDraw.brush.mouseup = function(e) {
};

/// Penのマウスハンドラー
// （空の）オブジェクトとして初期化
SimpleDraw.pen = {};

// mousedownのイベントリスナーを定義
SimpleDraw.pen.mousedown= function(e) {



};

// mousemoveのイベントリスナーを定義
SimpleDraw.pen.mousemove = function(e) {



};

// mouseupのイベントリスナーを定義
SimpleDraw.pen.mouseup = function(e) {
};

/// 四角形のｲﾍﾞﾝﾄリスナーを追加
// （空の）オブジェクトとして初期化
SimpleDraw.rect = {};

SimpleDraw.rect.mousedown = function(e) {



};

SimpleDraw.rect.mousemove = function(e) {



};

SimpleDraw.rect.mouseup = function(e) {



};
