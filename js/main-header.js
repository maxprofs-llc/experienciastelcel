var upk;
var categoria;
var categoriaTitulo;
var timerdinamicasfiltromainheader;
var desplegados_Over;
var id_dinamica, servicioUser;
var userConVentaja = false; 
var ventaja_titulo;
var ventaja;
var ventaja_fecha;
var sizeWindowparent;
var finalizoDinamica = false;
var cadenatiempo = Date.now();

// upk = 159; //////////////////////////////////////////  quitar!!
// document.cookie="upk="+upk; 
// getUser() //////////////////////////////////////////  quitar!!
// console.log("upk inicio "+upk);




function forGet(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');

    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}



function getDina(){
	



	parent.postMessage('scrollthem,0', '*');
	var userJson = $.getJSON( "https://admin.experienciastelcel.com/restful/getuser/?upk="+upk , function( data ) {
		
		try{
		var inx_ventaja = data.usuario.servicios.indexOf(ventaja);
		
		}
		catch(err){
			var inx_ventaja = -1;
		}	


		//data.usuario.ventaja == 1
		if (inx_ventaja>-1) {
			userConVentaja = true;
		} else {
			userConVentaja = false;
		};

		
		
			ventaja_titulo = data.ventaja_texto;
			ventaja = data.ventaja;
			ventaja_fecha = data.fecha_ventaja;
			$(".ventaja_titulo").text(ventaja_titulo);
			$(".ventaja_fecha").text(ventaja_fecha);
			$(".iconoventaja").attr("src", "images/iconosventaja/" + ventaja + ".png");


			var cadenat = Date.now();

			cargaContenido( "dinamica.html?t="+cadenat );
	});

};


function getUser() {


	parent.postMessage('scrollthem,0', '*');
	var userJson = $.getJSON( "https://admin.experienciastelcel.com/restful/getuser/?upk="+upk , function( data ) {
		if ( data.usuario.ventaja == 1 ) {
			userConVentaja = true;
		} else {
			userConVentaja = false;
		};
		
			ventaja_titulo = data.ventaja_texto;
			ventaja = data.ventaja;
			ventaja_fecha = data.fecha_ventaja;
			$(".ventaja_titulo").text(ventaja_titulo);
			$(".ventaja_fecha").text(ventaja_fecha);
			$(".iconoventaja").attr("src", "images/iconosventaja/" + ventaja + ".png");


		var cadenat = Date.now();
		$("#main-wrapper").load("secciones/inicio.html?t="+cadenat, function() {
			// $('html, body').scrollTop(0);
		});
	});
}



$(document).ready(function() {

	var query = window.location.search;


	$("#menufiltros").hide();
	$("#menufiltrosmobile").hide();
	$("#menumobile").hide();
	// $("#main-header nav").hide();
	$('html, body').scrollTop(0);


	var id_timerSalidaDesplegados;
	var tiemposalida = 2000;

	function timerSalidaDesplegados() {
		// $(".desplegados").addClass("novisible");
	}

	var promocionesJson = $.getJSON( "https://admin.experienciastelcel.com/restful/categorias/", function( datacat ) {
		var categoriasHTML = '';
		for(var i=0; i<datacat.categorias.length; i++) {
			categoriasHTML += '<div class="no-seleccionable" data-categoria="'+datacat.categorias[i].catslug+'" >'+datacat.categorias[i].catname+'</div>'

		}
		$("#menufiltros").append(categoriasHTML);
		$("#menufiltrosmobile").append(categoriasHTML);

		$(".desplegados div").click ( function() {
			clearTimeout(timerdinamicasfiltromainheader);
			if ( $("#main-header #menumobile").is(":visible") || $("#main-header #menufiltrosmobile").is(":visible") ) {
				resetMenuMobile();
			}
			$(".desplegados").hide();
			$("#menudesktop #experiencias").find(".fa").removeClass("fa-times"); 
			$("#menudesktop #experiencias").find(".fa").addClass("fa-caret-down");
			$(".desplegados div").removeClass("cyanHover");
			$(".desplegados div").removeClass("grisSelected");

			categoria = $(this).data("categoria");
			categoriaTitulo = $(this).text();
			
			cargaContenido("categoria.html");

			
		})

		$(".desplegados").mouseover (function() {
			clearTimeout(timerdinamicasfiltromainheader);
			desplegados_Over = true;
		});

		$(".desplegados").mouseleave (function() {
			$(".desplegados").hide();
			desplegados_Over = false;
			$("#menudesktop #experiencias").find(".fa").removeClass("fa-times"); 
			$("#menudesktop #experiencias").find(".fa").addClass("fa-caret-down");

			$("#main-header .icon-menu").removeClass("fa-times");
			$("#main-header .icon-menu").addClass("fa-bars");
		});
	})

	/************* menu filtrado dinamicas carrusel *********/

		$("#main-header #experiencias").mouseleave( function() {
			timerdinamicasfiltromainheader = setTimeout( function() {
				if ( !desplegados_Over ) { 
					$(".desplegados").hide();
					$("#main-header #experiencias").find(".fa").removeClass("fa-times"); 
					$("#main-header #experiencias").find(".fa").addClass("fa-caret-down");
					$(".desplegados div").removeClass("cyanHover");
					$(".desplegados div").removeClass("grisSelected");
				} else {
					desplegados_Over = false;
				};
			 }, 500);
		});

		$("#menudesktop #experiencias").click ( function() {
			// alert( $("#menufiltros").is(":visible") )
			clearTimeout(timerdinamicasfiltromainheader);

			if ( $("#menufiltros").is(":visible") ) {
				$("#menufiltros").hide();
				$(this).find(".fa").removeClass("fa-times"); 
				$(this).find(".fa").addClass("fa-caret-down");
			} else {
				$(".desplegados").hide();
				$("#menufiltros").show();
				$(this).find(".fa").removeClass("fa-caret-down"); 
				$(this).find(".fa").addClass("fa-times");
			}
		})


		

		/************* fin menu filtrado dinamicas carrusel *********/

		/**************** main menu mobile ***************/

		$("#menumobile #experiencias").click( function() {
			clearTimeout(timerdinamicasfiltromainheader);
			$("#menumobile").hide();
			$("#menufiltrosmobile").show();
		});

		/*************************************************/

	/**** even menu principal desktop *****/

	$("#main-header #experiencias__").click(function() {
		
		$('.desplegados').not("#menufiltros").addClass('novisible');
		$(".desplegados div").removeClass("cyanHover");
		$(".desplegados div").removeClass("grisSelected");
		
		$("#menufiltros").toggleClass("novisible");
	})


	$("#main-header .icon-menu").click ( function() {
		// clearTimeout(timerdinamicasfiltro);

		if ( $("#main-header #menumobile").is(":visible") || $("#main-header #menufiltrosmobile").is(":visible") ) {
			$("#main-header #menumobile").hide();
			$("#main-header #menufiltrosmobile").hide();
			$(this).removeClass("fa-times");
			$(this).addClass("fa-bars");
		} else {
			// $(".desplegadosD").hide();
			$("#main-header #menumobile").show();
			$(this).removeClass("fa-bars");
			$(this).addClass("fa-times");
		}
	})



	/**************** carga de secciones *******************/

	$("#main-header .brand").click(function() {

		var cadenat = Date.now();		

		if ( $("#main-header #menumobile").is(":visible") || $("#main-header #menufiltrosmobile").is(":visible") ) {
			resetMenuMobile();
		}
		cargaContenido( "inicio.html?t="+cadenat );
	})

	// $("#main-header #noticias").click(function() {
	// 	cargaContenido( "noticias.html" )
	// })

	$("#main-header #ganadores").click(function() {
		var cadenat = Date.now();	
		if ( $("#main-header #menumobile").is(":visible") || $("#main-header #menufiltrosmobile").is(":visible") ) {
			resetMenuMobile();
		}
		cargaContenido( "ganadores.html?t="+cadenat );
	})

	$("#main-header #comofunciona").click(function() {
		var cadenat = Date.now();	
		if ( $("#main-header #menumobile").is(":visible") || $("#main-header #menufiltrosmobile").is(":visible") ) {
			resetMenuMobile();
		}
		cargaContenido( "comofunciona.html?t="+cadenat );
	})

	$("#main-header #perfil").click(function() {
		var cadenat = Date.now();	
		if ( $("#main-header #menumobile").is(":visible") || $("#main-header #menufiltrosmobile").is(":visible") ) {
			resetMenuMobile();
		}	
		cargaContenido( "perfil.html?t="+cadenat );
		// event.stopPropagation();
	})

	
	/*************** servicios *****************/

	$(".editarservicios .serviciosdeclarados .servicio").click( function() {
		$(this).find(".checkbox").toggleClass("fa-check-square");
	})

	/*******************************************/



	/******************************************************/


	// conducta menu catetgorias a subcategorias

	

	/***************** js breakpoint *******************/


	
	$(window).resetBreakpoints();
	$(window).setBreakpoints();

	$(window).bind('exitBreakpoint960',function() {
		// $("#main-header nav").hide();
		$("#experiencias .fa").removeClass("fa-caret-down");
		$("#experiencias .fa").addClass("fa-caret-right");

		$(".desplegados").unbind('mouseleave');
		$(".desplegados").unbind('mouseenter');
		$(".desplegados div").unbind('mouseover');
		$(".desplegados div").unbind('mouseleave');
		$( ".ganadores .carruselcards .mascara .wrappercards").css('left', 0);
		$( ".dinamicas .carruselcards .mascara .wrappercards").css('left', 0);

	});
	
	$(window).bind('enterBreakpoint960',function() {
		resetMenuMobile();
		$("#experiencias .fa").removeClass("fa-caret-right");
		$("#experiencias .fa").addClass("fa-caret-down");

		$(".desplegados div").bind('mouseover', function() {
			if ( !$( this ).hasClass( "grisSelected" ) ) {
				$(".desplegados div").removeClass("cyanHover");
				$(this).addClass("cyanHover");
			}
			
		})

		$(".desplegados div").bind('mouseleave',function() {
			$(".desplegados div").removeClass("cyanHover");
		})


		

		$(".desplegados").bind('mouseleave',function() {
			clearTimeout( id_timerSalidaDesplegados );
			id_timerSalidaDesplegados = setTimeout( timerSalidaDesplegados, 1500);
		})


		$( ".ganadores .carruselcards .mascara .wrappercards").css('left', 0 );
		$( ".dinamicas .carruselcards .mascara .wrappercards").css('left', 0 );


	});


	/******************** likes ***********************/

	$( "body" ).undelegate(  ".likes", "click").delegate( ".likes", "click", function( event) {
		card_like = $(this);
		id_dinamica = $(this).data("id");
		event.stopPropagation();
		var likesJson = $.getJSON( "https://admin.experienciastelcel.com/restful/addlikes/?upk="+upk+"&ppk="+id_dinamica, function( data ) {
			console.log( "likes = "+data.likes )
			$( "[data-id='"+id_dinamica+"']" ).find( ".totallikes" ).text( data.likes);
			$( ".ladinamica .socialdata .likes .totallikes" ).text( data.likes); // para la pagina de la dinamica
			card_like.find(".fa").removeClass("fa-heart-o");
			card_like.find(".fa").addClass("fa-heart");
			card_like.find(".fa").addClass("grisrojooscuro");
			card_like.removeClass("likes");
			card_like.addClass("liked");
		});
	});

	$( "body" ).undelegate(  ".likes", "mouseover").delegate( ".likes", "mouseover", function( event) {
		$(this).find(".fa").removeClass("fa-heart-o");
		$(this).find(".fa").addClass("fa-heart");
		
	});
	
	$( "body" ).undelegate(  ".likes", "mouseleave").delegate( ".likes", "mouseleave", function( event) {
		$(this).find(".fa").removeClass("fa-heart");
		$(this).find(".fa").addClass("fa-heart-o");
		
	});

	/**************************************************/

	$( "body" ).undelegate(  ".publicidad", "click").delegate( ".publicidad", "click", function() {
		var url = $(this).data("url");
		window.open( url, "blank");
	});


	$( "body" ).undelegate(  ".recompensacard:not(.proximamente), .dinamicacard:not(.proximamente)", "click").delegate( ".recompensacard:not(.proximamente), .dinamicacard:not(.proximamente)", "click", function() {

		id_dinamica = $(this).data("id");

		window.location.href = "/index.html?u="+upk+"&da="+id_dinamica;
		
		//cargaContenido( "dinamica.html" );
	});



	$( "body" ).undelegate(".proximamente", "click").delegate( ".proximamente", "click", function() {

		id_dinamica = $(this).data("id");

		parent.postMessage('scrollthem,0', '*');
		texto = $(this).find('.typotitulocardprincipal').text();
		dpk = $(this).attr('data-id');


		var getStatusJson = $.getJSON("https://admin.experienciastelcel.com/restful/promocion/"+id_dinamica+"/?upk="+upk, function(data) {
		

			
			$('#imagenevento_flot').attr('src',data.promocion.imagen);
			$('#titulo_flot').text(data.promocion.titulo);

			$('#flotaproximamente,#fondoventanasflotante').show();


		});

	});


	$( "body" ).undelegate(".proximamente .imagedinamica", "touchend").delegate( ".proximamente .imagedinamica", "touchend", function() {

		id_dinamica = $(this).data("id");

		parent.postMessage('scrollthem,0', '*');
		texto = $(this).find('.typotitulocardprincipal').text();
		dpk = $(this).attr('data-id');
		$('#flotaproximamente,#fondoventanasflotante').show();

		var getStatusJson = $.getJSON("https://admin.experienciastelcel.com/restful/promocion/"+id_dinamica+"/?upk="+upk, function(data) {
		

			
			$('#imagenevento_flot').attr('src',data.promocion.imagen);
			$('#titulo_flot').text(data.promocion.titulo);

			


		});

	});










	$( "body" ).undelegate("#fondoventanasflotante,#closeflo", "click").delegate( "#fondoventanasflotante,#closeflo", "click", function() {

		$('#flotaproximamente,#fondoventanasflotante').hide();

	});




	$( "body" ).undelegate("#fondoventanasflotante,#closeflo", "touchend").delegate( "#fondoventanasflotante,#closeflo", "touchend", function() {

		$('#flotaproximamente,#fondoventanasflotante').hide();

	});





	$( "body" ).undelegate(  ".ganadorescard:not(.noclick_espera)", "click").delegate( ".ganadorescard:not(.noclick_espera)", "click", function() {
		id_dinamica = $(this).data("id");
		cargaContenido( "dinamicaganadores.html" );
	});

	$( "body" ).undelegate(  ".perfilcard:not(.proximamente)", "click").delegate( ".perfilcard", "click", function() {
		id_dinamica = $(this).data("id");

		statusdin = $(this).attr('class');
		inx = statusdin.indexOf('proximamente');
		if(inx>-1)
			return true;

		if (  $(this).data("vigencia") == 0 ) {
			cargaContenido( "dinamicaganadores.html" );
		} else if (  $(this).data("vigencia") == 1 ) {
				window.location.href = "/index.html?u="+upk+"&da="+id_dinamica;
			//cargaContenido( "dinamica.html" );
			//cargaContenido( "dinamica.html" );
		}		
	});

	

})

function cargaContenido( seccion ) {


	$("#main-wrapper").fadeTo(400,0.0, function() {
			$('html, body').scrollTop(0);
			var randomNum = Math.random()*1000;
			var cadenat = Date.now();
			$("#main-wrapper").html('CARGANDO ...');
			$("#main-wrapper").load("secciones/"+seccion+"?t="+cadenat, function() {
				$("#main-wrapper").fadeTo(400,1.0);
			});
	})
}

function resetMenuMobile() {
	$("#main-header #menumobile").hide();
	$("#main-header #menufiltrosmobile").hide();
	$("#main-header .icon-menu").removeClass("fa-times");
	$("#main-header .icon-menu").addClass("fa-bars");
}







