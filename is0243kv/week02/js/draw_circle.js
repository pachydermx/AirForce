$(document).ready(function() {
  // canvas要素から，DrawCircleのオブジェクトを生成する
  var canvas = document.getElementById('canvas');
  var drawCircle = new DrawCircle(canvas);
  // clearボタンを設定
  $('#clear_button').on('click', function() {
    drawCircle.clear();
  });
});
