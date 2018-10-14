
  myapp = angular.module('mainApp',['ngRoute','ngSanitize']);

  var npalabras = 0;
  var tiempofinal = 0;
  var totales = 0;

  function formatnumbers(numero){
    formado = '0' + numero;
    return formado.slice(-2);
  }


function upTime(countTo) {
  now = new Date();
  countTo = new Date(countTo);
  difference = (now-countTo);
  tiempox=convertMS(difference);
  jQuery('#seconds').html(formatnumbers(tiempox.s));
  jQuery('#minutes').html(formatnumbers(tiempox.m));
  jQuery('#hours').html(formatnumbers(tiempox.h));
  clearTimeout(upTime.to);
  tiempofinal = formatnumbers(tiempox.h) + ':' +  formatnumbers(tiempox.m) + ':' + formatnumbers(tiempox.s);
  upTime.to=setTimeout(function(){ upTime(countTo); },1000);
}



function downTime(countTo) {
  now = new Date();
  countTo = new Date(countTo);
  difference = (countTo-now);
  tiempox=convertMS(difference);
  jQuery('#seconds').html(tiempox.s);
  jQuery('#minutes').html(tiempox.m);
  jQuery('#hours').html(tiempox.h);
  jQuery('#days').html(tiempox.d);
  clearTimeout(upTime.to);
  upTime.to=setTimeout(function(){ upTime(countTo); },1000);
}


var upk = null;
upk = getCookie('upk');
if(upk.length<1)
upk = 14;


angular.module("mainApp").directive('slidePuzz', ['$http',function($http) {

  return {
    restrict: 'A',
    link: function(scope, elm, attrs) {  
      var img = new Image();
	  img.src = $('#img-sample').attr('src');


    }
  };

}]);




angular.module("mainApp").directive('finalizarJuego', ['$http',function($http) {

  return {
    restrict: 'A',
    link: function(scope, elm, attrs) {  
        elm.click(function(e){
            preguntas = scope.lista.length;
            respuestas = scope.respuestas.length;
            uri = 'https://admin.experienciastelcel.com/restful/finalsopa/'+upk+'/'+id_dinamica+'/';
            data = {'respuestas':npalabras,'tiempo':tiempofinal};
            params = {'url':uri,'method':'GET','params':data};
            $http(params).then(function(response) {
               scope.startgame = 2; 
               scope.tiempofinal = tiempofinal; 
               scope.totales = totales;
               scope.npalabras = npalabras;             
            });

        });        

    }
  };

}]);



angular.module("mainApp").directive('contadorJuego', ['$http',function($http) {


  return {
    restrict: 'A',
    link: function(scope, elm, attrs) {

        scope.$watch('startgame',function(x){
          if(scope.startgame==1){
              tmp_pices = new Date(Date.now());
              upTime(tmp_pices); 
          }
        },true);



    }
  };



}]);



myapp.controller('puzzCtr',function($scope,$http){
    $scope.sopa = {};
    $scope.lista = {};
    $scope.palabras = [];
    $scope.junta = [];
    $scope.contador = [];
    $scope.dinamica = null;
    $scope.respuestas = [];
    $scope.status = null;
    $scope.startgame = 0;
    $scope.tiempofinal = tiempofinal;


    $scope.iniciar = function(){
      $scope.startgame = 1;
    }


    $http.get("https://admin.experienciastelcel.com/restful/promocion/"+id_dinamica+"/")
    .then(function(response) {
      $scope.dinamica = response.data.promocion;
      $scope.sopa = response.data.promocion.preguntas.tablero;
      $scope.lista = response.data.promocion.preguntas.lista; 
      $scope.palabras = response.data.promocion.preguntas.palabras; 
    });
   


});
