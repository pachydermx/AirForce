$(document).ready(function() {
	$('#get_button').on('click', function() {
		var filename = $("#filenameField").val();
		$.ajax({
			url: "/data/" + filename
		}).done(function(data){
			$("#result").text(data);
		}).fail(function(jqXHR){
			console.log(jqXHR.status);
			console.log(jqXHR.statusText);
		});
	});
});
