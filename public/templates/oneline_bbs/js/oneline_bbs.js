$(document).ready(function() {
  // 掲示板のurlを求める．同じhostにアクセスするものとする
  var url = 'http://' + document.location.host + '/bbs';
  var bbs = new OneLineBBS(url, $('#board'));
  $('#update_button').on('click', function() {
    bbs.updateBBS();
  });
  $('#send_button').on('click', function() {
    bbs.send();
  });
  $('#message').on('keypress', function(e) {
    // enter keyが押された時にメッセージを送る
    if (e.keyCode == 13) {
      bbs.send();
    }
  });
  
  // デバッグ用
  $('#delete_all_button').on('click', function() {
    if (confirm('メッセージをすべて消去しますか？')) {
      bbs.deleteAll();
    }
  });

  bbs.updateBBS();
});
