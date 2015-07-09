$(document).ready(function() {
  // canvas要素を渡して，DrawRectのオブジェクトを作成する
  var canvas = document.getElementById('canvas');
  var drawRect = new DrawRect(canvas);
  // 'clear'ボタンの設定
  $('#clear_button').on('click', function() {
    drawRect.clear();
  });
});
