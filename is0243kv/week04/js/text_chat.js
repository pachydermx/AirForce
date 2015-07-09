$(document).ready(function() {
  // TextChatのオブジェクト
  var textChat; 
  // WebSocketを呼び出すURL
  var url = 'ws://' + document.location.host;
  // consoleに対応するHTML要素
  var console = document.getElementById('console');
  // ボタンの状態を更新する関数
  function updateButtons() {
    if (textChat.socket == null) {
      // WebSocketが開いていなければ，コネクトボタンを有効にする
      $('#connect_button').prop('disabled', false);
      $('#name').prop('disabled', false);
      $('#disconnect_button').prop('disabled', true);
      $('#send_button').prop('disabled', true);
    } else {
      // WebSocketが開いている場合
      $('#connect_button').prop('disabled', true);
      $('#name').prop('disabled', true);
      $('#disconnect_button').prop('disabled', false);
      $('#send_button').prop('disabled', false);
    }
  };

  textChat = new TextChat(url, console, updateButtons);

  // メッセージの入力エリアのデータを送信する
  function sendMessage() {
    textChat.sendJsonMsg({
      type: 'message',
      text: $('#message').val()
    });
  }

  $('#connect_button').on('click', function() {
    textChat.connect($('#name').val());
  });

  $('#disconnect_button').on('click', function() {
    textChat.disconnect();
  });

  $('#send_button').on('click', function() {
    sendMessage();
  });

  $('#message').on('keypress', function(event) {
    // エンターキーを入力した時にメッセージを送る
    if (event.keyCode == 13) {
      sendMessage();
    }
  });
  
  $('#clear_all_button').on('click', function() {
    textChat.sendJsonMsg({type: 'clearAll'});
  });
  
  // 他のブラウザとできるだけ衝突しないように名前の初期値を設定する
  $('#name').attr('value', (function() {
    var d = new Date();
    return 'user' + (d.getTime() % 10000);
  })());

  // ボタンの表示を更新する
  updateButtons();
});
