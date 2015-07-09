$(document).ready(function() {
  var canvas = document.getElementById('canvas');
  var simpleDraw = new SimpleDraw(canvas);
  // 'clear'ボタンの設定
  $('#clear_button').on("click", function(e) {
    simpleDraw.clear();
  });
  // ツールの選択
  $('input[name="drawing_mode"]').on('change', function() {
      // radioボタンのvalue属性に'brush', 'pen'などの値が入っている
      simpleDraw.setMode(this.value);
      // debug用
      //console.log(this.value);
  });
  // 現在のモードに設定されているものにチェックをいれる
  $('input[name="drawing_mode"][value="' + simpleDraw.mode + '"]').prop('checked', true);

  function refreshBrush() {
      var r = parseInt($("input[name='red']").val());
      var g = parseInt($("input[name='green']").val());
      var b = parseInt($("input[name='blue']").val());
      var a = parseFloat($("input[name='alpha']").val());
      var s = parseInt($("input[name='size']").val());
      simpleDraw.setBrush(r, g, b, a, s);
  }

  $("input[name='red']").change(function() {
    refreshBrush();
  });
  $("input[name='green']").change(function() {
    refreshBrush();
  });
  $("input[name='blue']").change(function() {
    refreshBrush();
  });
  $("input[name='alpha']").change(function() {
    refreshBrush();
  });
  $("input[name='size']").change(function() {
    refreshBrush();
  });

  refreshBrush();
});
