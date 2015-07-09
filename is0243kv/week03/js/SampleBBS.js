// jQuery objectであることを示すために変数名に$をつけておく
function SampleBBS(url, $board) {
  this.url = url;
  // 掲示板をテーブルで初期化する
  $board.empty();
  var table = $('<table></table>');
  var thead = $('<thead></thead>');
  // CSSクラスを指定しておく．幅をスタイルで指定する
  var theadline = $('<tr><th class="date">日付</th><th class="name">名前</th><th>メッセージ</th><th>削除</th></tr>');
  var tbody = $('<tbody id="list"></tbody>');
  table.append(thead).append(tbody);
  thead.append(theadline);
  $board.append(table);
  // tbodyにメッセージを書き込む．変数名に$をつけてjQueryのオブジェクトであることを明示する
  this.$tbody = tbody;
}

// 「掲示板の更新」の関数
SampleBBS.prototype.updateBBS = function() {
  var msg;
  var that = this;
  $.ajax({
    url: "/bbs",
    method: "GET"
  }).done(function(data){
    // clear
    $("#list").html("");
    // add new
    for (var i in data){
      $("#list").append('<tr><td class="time">' + new Date(Number(data[i].date)).toLocaleString() + '</td><td class="name">' + data[i].name + '</td><td class="message">' + data[i].body + '</td><td class="delete_button"><i class="fa fa-trash-o"></i></td><td class="id">' + data[i]._id + '</td></tr>');
    }
	$(".message").click(function(e){
		var content = $(e.target).text();
		$(e.target).html("<span class='hide'>" + content + "</span><input type='text' value='" + content + "'>");
		$(e.target).children("input").focus();
		$(e.target).children("input").on("keypress", function(e){
			if(e.keyCode == 13){
				// get info
				var id = $(e.target).parents("tr").find(".id").text();
				var name = $(e.target).parents("tr").find(".name").text();
				var body = $(e.target).val();
				console.log(id, body);
				// send new
				$.ajax({
					url: "/bbs/" + id,
					method: "PUT",
					data: {
						"_id": id,
						"name": name,
						"body": body,
					    "date": new Date().getTime()
					}
				})
				// refresh
				that.updateBBS();
			} else if(e.keyCode == 27){
				var cell = $(e.target).parents("td");
				cell.html(cell.children("span").text());
			} 
		}).focusout(function(ee){
			$(e.target).html($(e.target).children("span").text());
		})
	});
	$(".delete_button").click(function(e){
		var id = $(e.target).parents("tr").find(".id").text();
		if (confirm("削除しますか")){
			if (id.length > 0){
				$.ajax({
					url: that.url + "/" + id,
					method: "DELETE"
				}).done(function(){
					that.updateBBS();
				});
			}
		}
	});

  }).fail(function(jqXHR){
    console.log(jqXHR.status);
    console.log(jqXHR.statusText);
  });
};

// 「メッセージ送信」の関数
SampleBBS.prototype.send = function() {
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
SampleBBS.prototype.deleteAll = function() {
  var that = this;
  $.ajax({
    url: this.url,
    type: 'DELETE'
  }).done(function(data) {
    // if successful, update the table
    that.updateBBS();
  });
};
