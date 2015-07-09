$(document).ready(function() {
  // canvas要素から，DrawPenオブジェクトを生成する
  var canvas = document.getElementById('canvas');
  var drawPen = new DrawPen(canvas);
  // clearボタンを設定
  $('#clear_button').on('click', function() {
    drawPen.clear();
  });
});
