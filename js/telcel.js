$(document).ready( function() {
	var cadenat = Date.now();
	$(".editarservicios").hide();
	
	$("#main-wrapper").load("secciones/iniciotelcel.html?t="+cadenat, function() {
		$('html, body').scrollTop(0);
	});
	
})