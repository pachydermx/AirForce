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
    this.$console.empty();
  } else if (type === 'message') {
    var text = jsonMsg.from + ' > ' + jsonMsg.text;
    this.outputToConsole(text);
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
/**
 * TextChat 
 * @constructor
 * @param url - WebSocketを呼び出すURL
 * @param console - ログを出力するconsoleエリア
 * @param updateUICallback - WebSocketの状態が変わった時に呼び出すコールバック関数
 */
function TextChat(url, console, updateUICallback) {
  this.url = url;
  this.socket = null;
  this.from = '';
  // jQueryのオブジェクトにしておく
  this.$console = $(console);
  // コールバック関数が渡されない時は，ダミーの関数を設定しておく
  this.updateUICallback = updateUICallback || function() {};
}

// JSON形式のメッセージを送信する
// この時，fromを追加してから送る
TextChat.prototype.sendJsonMsg = function(jsonMsg) {
  if (this.socket != null && this.socket.readyState === 1) {
    jsonMsg.from = this.from;
    this.socket.send(JSON.stringify(jsonMsg));
  } else {
    alert("WebSocket is not opened");
  }
};

// コンソールのエリアにテキストを追加する．オプションで色を指定できるようにしている．
TextChat.prototype.outputToConsole = function(text, color) {
  var p = $('<p></p>').text(text);
  if (color) {
    // CSSを使って色を指定する
    p.css('color', color);
  }
  this.$console.prepend(p);
};

// connectする際にfromに入れるnameを指定する
TextChat.prototype.connect = function(name) {
  this.from = name;
  this.socket = new WebSocket(this.url);
  // TextChatのオブジェクトをコールバック関数で参照できるようにする 
  var that = this;
  // WebSocketをオープンした時の処理
  this.socket.onopen = function() {
    that.outputToConsole('WebSocket opened.', 'salmon');
    // UI状態を更新する
    that.updateUICallback();
  };
  
  // WebSocketにメッセージが届いた時の処理
  this.socket.onmessage = function(message) {
    // JSON形式でメッセージが送られてくる
    var msg = JSON.parse(message.data);
    that.handleJsonMsg(msg);
  };
  
  // WebSocketがクローズした時の処理
  this.socket.onclose = function() {
    that.outputToConsole('WebSocket closed.', 'salmon');
    that.socket = null;
    that.updateUICallback();
  };
};

TextChat.prototype.disconnect = function() {
  if (this.socket != null) {
    this.socket.close();
    this.socket = null;
  } else {
    alert('WebSocket is not opened.');
  }
};
