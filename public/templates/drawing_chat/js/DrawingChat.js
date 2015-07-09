function DrawingChat(url, canvas, console, updateUICallback) {
  // TextChatのコンストラクタを呼び，TextChat関連の初期化を行う
  TextChat.call(this, url, console, updateUICallback);
  // お絵かきの機能を追加
  this.draw = new DrawBrush(canvas);
  // 下の関数の中で，thisにアクセスできるように別の変数(that)にいれておく
  var that = this;
  // drawBrushAtのメソッドを書き換える
  this.draw.drawBrushAt = function(posx, posy) {
    if (that.socket != null && that.socket.readyState === 1) {
      // WebSocketが有効かチェックする
      that.sendJsonMsg({
        type: 'drawBrush', 
        x: posx, 
        y: posy
      });
    }
  };
}

// TextChatを継承する
DrawingChat.prototype = Object.create(TextChat.prototype);

// メッセージのハンドラーを置き換える
DrawingChat.prototype.handleJsonMsg = function(jsonMsg) {
  var type = jsonMsg.type;
  if (type === 'drawBrush') {
    // プロトタイプのdrawBrushAtを呼び出す．呼び出す時のthisを設定しつつ呼び出す
    Object.getPrototypeOf(this.draw).drawBrushAt.call(this.draw, jsonMsg.x, jsonMsg.y);
  } else if (type === 'clearAll') {
    this.draw.clear();
  }
};


// このオブジェクトのconnectメソッドを上書きする
DrawingChat.prototype.connect = function(name) {
  // 接続時に描画コマンドが送られてくるので，上書きを避けるためにキャンバスをクリアする
  this.draw.clear();
  // TextChat.prototypeのconnectを呼び出す．
  //Object.getPrototypeOf(Object.getPrototypeOf(this)).connect.call(this, name);
  TextChat.prototype.connect.call(this, name);
};
