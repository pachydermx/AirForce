// jQuery objectであることを示すために変数名に$をつけておく
function OneLineBBS(url, $board) {
  this.url = url;
  // 掲示板をテーブルで初期化する
  $board.empty();
  var table = $('<table></table>');
  var thead = $('<thead></thead>');
  // CSSクラスを指定しておく．幅をスタイルで指定する
  var theadline = $('<tr><th class="date">日付</th><th class="name">名前</th><th class="message">メッセージ</th></tr>');
  var tbody = $('<tbody id="list"></tbody>');
  table.append(thead).append(tbody);
  thead.append(theadline);
  $board.append(table);
  // tbodyにメッセージを書き込む．変数名に$をつけてjQueryのオブジェクトであることを明示する
  this.$tbody = tbody;
}

// 「掲示板の更新」の関数
OneLineBBS.prototype.updateBBS = function() {
  var msg;
  $.ajax({
    url: "/bbs",
    method: "GET"
  }).done(function(data){
    // clear
    $("#list").html("");
    // add new
    for (var i in data){
      $("#list").append('<tr><td>' + new Date(Number(data[i].date)).toLocaleString() + '</td><td>' + data[i].name + '</td><td>' + data[i].body + '</td></tr>')
    }
  }).fail(function(jqXHR){
    console.log(jqXHR.status);
    console.log(jqXHR.statusText);
  });
};

// 「メッセージ送信」の関数
OneLineBBS.prototype.send = function() {
  // get info
  var that = this;
  var name = $("#name").val();
  var msg = $("#message").val();
  // send
  $.ajax({
    url: "/bbs",
    method: "POST",
    data: {
      "name": name,
      "body": msg,
      "date": new Date().getTime()
    }
  }).done(function(data){
    // refresh
    that.updateBBS();
  }).fail(function(jqXHR){
    console.log(jqXHR.status);
    console.log(jqXHR.statusText);
  });

};

// デバッグ用（メッセージをすべてクリアする)
OneLineBBS.prototype.deleteAll = function() {
  var that = this;
  $.ajax({
    url: this.url,
    type: 'DELETE'
  }).done(function(data) {
    // if successful, update the table
    that.updateBBS();
  });
};
