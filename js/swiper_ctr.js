
var fino = 0;
var tiempofinal = 0;
var contesta = [];

function upTime(countTo) {
  var now = new Date();
  var countTo = new Date(countTo);
  var difference = (now-countTo);
  var tiempox=convertMS(difference);
  
  if(fino==0){
    jQuery('#seconds').html(formatnumbers(tiempox.s));
    jQuery('#minutes').html(formatnumbers(tiempox.m));
    jQuery('#hours').html(formatnumbers(tiempox.h));
  }

  clearTimeout(upTime.to);
  tiempofinal = formatnumbers(tiempox.h) + ':' +  formatnumbers(tiempox.m) + ':' + formatnumbers(tiempox.s);
  upTime.to=setTimeout(function(){ upTime(countTo); },1000);
}



(function(angular) {
    'use strict';

    var app = angular.module('puzzleApp',['ngRoute','ngSanitize']); 


    angular.module("puzzleApp").directive('swiperOn', ['$http',function($http) {
      return {
        restrict: 'A',
        link: function(scope, elm, attrs) {  

            var cuantos = scope.$parent.p.imgs;
            var vivel = scope.$parent.$parent.preguntalevel;

            var elemento = elm[0];
            var hammertime = new Hammer(elemento);
            var xy = $(elemento).position();
            var limite = xy.left + 20;

            hammertime.on('pan', function(ev) {
               $(elemento).css({'left':ev.deltaX+'px'});  
                

                if(ev.deltaX>limite){
                    $(elemento).css({'transform':'rotate(15deg)'});
                    $('#rightside').show();
                    $('#leftside').hide();

                    
                }
                else{
                    $(elemento).css({'transform':'rotate(-15deg)'});
                    $('#rightside').hide();   
                    $('#leftside').show();

                }
                
            });

            
            hammertime.on('panend', function(ev) {
              var resultado = {'imgpk':scope.i.imgpk,'responde':'','tiempofinal':tiempofinal};
              var responde = null;

                var inx = scope.$parent.p.imgs.indexOf(scope.i);
                    scope.$parent.p.imgs.splice(inx,1);

                if(vivel,scope.$parent.p.imgs.length==0){
                  scope.$parent.$parent.preguntalevel++;
                }
                if(scope.$parent.$parent.dinamica.preguntas.length==scope.$parent.$parent.preguntalevel){
                  scope.$parent.$parent.startgame++;
                  scope.$parent.$parent.tiempofinal = tiempofinal;
                  fino = 1;
                  
                  var uri = 'https://admin.experienciastelcel.com/restful/finalswiper/'+upk+'/'+id_dinamica+'/';
                  var data = contesta;
                  var params = {'url':uri,'method':'GET','params':data};
                  $http(params).then(function(response) {
                    $('#corrs').html(response.data.correctas);
                    $('#tots').html(response.data.totals);
                  });


                }


               

                 if(ev.deltaX>limite){
                       $(elemento).animate({'top': "-=200"}, 80,function(){
                        $(elemento).remove();
                       }); 
                       responde = 'right';
                 }
                 else{
                       $(elemento).animate({'top': "+=200"}, 80,function(){
                        $(elemento).remove();
                       }); 
                       responde = 'left';
                 }
                 resultado['responde'] = responde;
                 contesta.push(resultado);
                $('#rightside,#leftside').hide();  
                 scope.$apply();

            });
            

        }
      };

    }]);

 
    angular.module("puzzleApp").directive('startGame', ['$http',function($http) {
      return {
        restrict: 'A',
        link: function(scope, elm, attrs) {  
            var elemento = elm[0];
            elm.click(function(e){
              scope.startgame = 1;
              scope.$apply();

             $http.get('https://admin.experienciastelcel.com/restful/participando/'+upk+'/'+id_dinamica+'/').
              then(function(response) {
                  
                  if(response.data.status=='finalizo'){
                      scope.finalizado = true;
                      scope.hiddens = false;
                  }
                  else{
                      scope.finalizado = false;
                      scope.hiddens = true;
                      scope.tiempo = response.data.inicioUTC;
                      scope.tmp_pices = new Date(Date.now());     
                  }
              });
            });
        }
      };

    }]);




angular.module("puzzleApp").directive('contadorJuego', ['$http',function($http) {

  return {
    restrict: 'A',
    link: function(scope, elm, attrs) {

        scope.$watch('startgame',function(x){
          console.log('aa');
          if(scope.startgame==1){
              console.log('aa');
              var inicia = new Date(Date.now());
              upTime(inicia);
          }
        },true);

    }
  };

}]);

    app.controller('swiperCtr',function($scope,$http){
        $scope.sopa = {};
        $scope.lista = {};
        $scope.palabras = [];
        $scope.junta = [];
        $scope.contador = [];
        $scope.dinamica = null;
        $scope.respuestas = [];
        $scope.status = null;
        $scope.startgame = 0;
        $scope.tiempofinal = 0;
        $scope.preguntalevel = 0;
        $scope.ventaja = ventaja_titulo;
        $scope.ventaja_slug = ventaja;


        $scope.path_site = 'https://admin.experienciastelcel.com/';
        $scope.iniciar = function(){
          $scope.startgame = 1;
        }

        $http.get($scope.path_site+'restful/promocion/'+id_dinamica+"/")
        .then(function(response) {
          $scope.dinamica = response.data.promocion;
        });
    

        $scope.swiperotate = function(inx){
            var cadena = {'transform':'rotate(15deg)'};
            return cadena;
        }


    });

})(window.angular);

