// 定義例
$(document).ready(function() {
  // canvas要素から，DrawBrushオブジェクトを生成する
  var canvas = document.getElementById('canvas');
  var drawBrush = new DrawBrush(canvas);
  // clearボタンを設定
  $('#clear_button').on('click', function() {
    drawBrush.clear();
  });
});
