/**
 * 乱数の発生 
 */
$(document).ready(function() {

	$("#gen").click(function () {
		var result = parseInt($("#max_input").val()) * Math.random() + 1;
		$("#result").text(Math.floor(result));
	})

});
