$(document).ready( function() {
	$(".editarservicios").hide();
	
	$("#main-wrapper").load("secciones/inicio.html", function() {
		$('html, body').scrollTop(0);
	});
	
})