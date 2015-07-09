/**
 * Greeting (文字列の連結)
 */
$(document).ready(function() {

	$("#greeting_button").click(function () {
		$("#greeting_display").text("こんにちは、" + $("#name_input").val() + " さん");
	})

});
