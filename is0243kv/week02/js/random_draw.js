// RandomDraw.jsを先にロードする
$(document).ready(function() {
  // canvas要素を求める
  var canvas = document.getElementById('canvas');
  // canvas要素を渡してRandomDrawのオブジェクトを作る
  var randomDraw = new RandomDraw(canvas);
  // clearボタンに上記のオブジェクトのclearメソッドを割り当てる
  $('#clear_button').on('click', function() {
    randomDraw.clear();
  });
  // drawボタンに上記のオブジェクトのdrawメソッドを割り当てる
  $('#draw_button').on('click', function() {
    randomDraw.draw();
  });
});