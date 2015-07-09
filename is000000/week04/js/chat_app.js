var chat;
$(document).ready(function() {
  // canvas要素から，DrawBrushオブジェクトを生成する
  var canvas = document.getElementById('canvas');
  var drawBrush = new DrawBrush(canvas);
  // clearボタンを設定
  $('#clear_button').on('click', function() {
    drawBrush.clear();
  });


  // TextChatのオブジェクト
  // WebSocketを呼び出すURL
  var url = 'ws://' + document.location.host;
  // consoleに対応するHTML要素
  var console = document.getElementById('console');
  // canvas
  var canvas = document.getElementById('canvas');
  
  // UIの状態を更新する関数
  function updateUI() {
    if (chat.socket == null) {
      // WebSocketが開いていなければ，コネクトボタンを有効にする
      $('#connect_button').prop('disabled', false);
      $('#name').prop('disabled', false);
      $('#disconnect_button').prop('disabled', true);
      // WebSocketが開いていないとクリアのボタンも働かない
      $('#clear_button').prop('disabled', true);
      // キャンバスのボーダーを点線にする
      $('#canvas').css('border-style', 'dotted');
      $('#send_button').prop('disabled', true);
    } else {
      // WebSocketが開いている場合
      $('#connect_button').prop('disabled', true);
      $('#name').prop('disabled', true);
      $('#disconnect_button').prop('disabled', false);
      $('#clear_button').prop('disabled', false);
      // キャンバスのボーダーを実線にする
      $('#canvas').css('border-style', 'solid');
      $('#send_button').prop('disabled', false);
    }
  };

  chat = new DrawingChat(url, canvas, console, updateUI);

  $('#connect_button').on('click', function() {
    chat.connect($('#name').val());
  });

  $('#disconnect_button').on('click', function() {
    chat.disconnect();
  });
  
  // キャンバスのクリアは，コマンドを送ることに対応させる
  $('#clear_button').on('click', function() {
    chat.sendJsonMsg({type: 'clearAll'});
  });
  
  // 他のブラウザとできるだけ衝突しないように名前の初期値を設定する
  $('#name').attr('value', (function() {
    var d = new Date();
    return 'user' + (d.getTime() % 10000);
  })());


  // メッセージの入力エリアのデータを送信する
  function sendMessage() {
    chat.sendJsonMsg({
      type: 'message',
      text: $('#message').val()
    });
  }

  $('#send_button').on('click', function() {
    sendMessage();
  });

  $('#message').on('keypress', function(event) {
    // エンターキーを入力した時にメッセージを送る
    if (event.keyCode == 13) {
      sendMessage();
    }
  });
  
  // 他のブラウザとできるだけ衝突しないように名前の初期値を設定する
  $('#name').attr('value', (function() {
    var d = new Date();
    return 'user' + (d.getTime() % 10000);
  })());

  // UIの表示を更新する
  updateUI();
});
