/**
 * TextChat 
 * @constructor
 * @param url - WebSocketを呼び出すURL
 * @param console - ログを出力するconsoleエリア
 * @param updateUICallback - WebSocketの状態が変わった時に呼び出すコールバック関数
 */
function Communicator(url, console, updateUICallback) {
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
Communicator.prototype.sendJsonMsg = function(jsonMsg) {
	if (this.socket != null && this.socket.readyState === 1) {
		jsonMsg.from = this.from;
		this.socket.send(JSON.stringify(jsonMsg));
	} else {
		alert("WebSocket is not opened");
	}
};

// 受信したJSON形式のメッセージを処理する
Communicator.prototype.handleJsonMsg = function(jsonMsg) {
	if (jsonMsg.type === 'enemy') {
		add_enemy(jsonMsg.enemy, jsonMsg.position, 'weapon');
		this.sendJsonMsg({type: 'clearAll'});
	} else if (jsonMsg.type === 'clearAll') {
		this.$console.empty();
	}
};

// コンソールのエリアにテキストを追加する．オプションで色を指定できるようにしている．
Communicator.prototype.outputToConsole = function(text, color) {
	var p = $('<p></p>').text(text);
	if (color) {
		// CSSを使って色を指定する
		p.css('color', color);
	}
	this.$console.prepend(p);
};

// connectする際にfromに入れるnameを指定する
Communicator.prototype.connect = function(name) {
	this.from = name;
	this.socket = new WebSocket(this.url);
	// TextChatのオブジェクトをコールバック関数で参照できるようにする 
	var that = this;
	// WebSocketをオープンした時の処理
	this.socket.onopen = function() {
		// clear
		that.sendJsonMsg({type: 'clearAll'});
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

Communicator.prototype.disconnect = function() {
	if (this.socket != null) {
		// clear
		this.sendJsonMsg({type: 'clearAll'});
		this.socket.close();
		this.socket = null;
	} else {
		alert('WebSocket is not opened.');
	}
};