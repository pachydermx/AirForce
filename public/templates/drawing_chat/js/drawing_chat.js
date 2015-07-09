$(document).ready(function() {
  // TextChatのオブジェクト
  var chat; 
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
    } else {
      // WebSocketが開いている場合
      $('#connect_button').prop('disabled', true);
      $('#name').prop('disabled', true);
      $('#disconnect_button').prop('disabled', false);
      $('#clear_button').prop('disabled', false);
      // キャンバスのボーダーを実線にする
      $('#canvas').css('border-style', 'solid');
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

  // UIの表示を更新する
  updateUI();
});
