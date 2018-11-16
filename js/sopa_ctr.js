
(function(angular) {
    'use strict';




var url_rest = 'https://admin.experienciastelcel.com/restful';
var url_pice = '';

  var myapp = angular.module('mainApp',['ngRoute','ngSanitize']);

    angular.module("mainApp").directive('checkVentaja', ['$http',function($http) {
      return {
        restrict: 'A',
        link: function(scope, elm, attrs) { 
        
             $http.get("https://admin.experienciastelcel.com/restful/getuser/?upk="+upk)
              .then(function(response) {
               
                 
                if(response.data.usuario.ventaja=='1'){
                  console.log('letdow');
                  $(elm).attr('checked','checked');
                }

              });          

          elm.click(function(e){

            var ventajoso = elm.is(':checked');
            

            if(ventajoso==true){
              url_pice = 'settuser';
              userConVentaja = true;
              
            }
            else{
              
              url_pice = 'rmserviceuser';
              userConVentaja = false;
            }
            

            jQuery('#iniciador').hide();
            var uri = url_rest + '/'+url_pice+'/?u='+upk+'&servicios='+ventaja;
            $http.get(uri)
            .then(function(response) {
                    
                    jQuery('#iniciador').show();
                    

            });


          });


        }
      };

    }]);





  var npalabras = 0;
  var tiempofinal = 0;
  var totales = 0;
  var fino = 0;
  var clicks,constante,cadena,inicio,final,formado,listax;
  var encontradas = 0;


  function formatnumbers(numero){
    formado = '0' + numero;
    return formado.slice(-2);
  }


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



function downTime(countTo) {
  var now = new Date();
  var countTo = new Date(countTo);
  var difference = (countTo-now);
  var tiempox=convertMS(difference);
  jQuery('#seconds').html(tiempox.s);
  jQuery('#minutes').html(tiempox.m);
  jQuery('#hours').html(tiempox.h);
  jQuery('#days').html(tiempox.d);
  clearTimeout(upTime.to);
  upTime.to=setTimeout(function(){ upTime(countTo); },1000);
}




angular.module("mainApp").directive('playIng', ['$http',function($http) {

  return {
    restrict: 'A',
    link: function(scope, elm, attrs) {  

        clicks = 0;
        var sopa,respuestas,totales,x,y,lista,pos,encontradas;
        elm.click(function(e){
             sopa = scope.$parent.$parent.sopa;
             listax = scope.$parent.$parent.lista;
             respuestas = scope.$parent.$parent.respuestas;
             totales = scope.$parent.$parent.palabras.length;
             encontradas = scope.$parent.$parent.encontradas;
             

             y = scope.$parent.$index;
             x = scope.$index;
             lista = scope.$parent.$parent.junta;
             pos = scope.$parent.$parent.lista;
            clicks++;
            lista.push(x,y);
            

            if(clicks==1){

                var prox = lista.join('');
                var inx = pos.indexOf(prox);
                var v,vindex,xindex,yindex;
                var finded = 0;
                for(v=0;v<listax.length;v++){

                  var claveinicial = listax[v].substring(0,2);
                  var conjunto = prox;

                  if(claveinicial==conjunto){
                    finded++;
                  }

                }



                if(finded>0){
                  $(elm).addClass('preselect');

                }
                else{
                  clicks = 0;
                  scope.$parent.$parent.junta = [];
                  //scope.$apply();


                  $(elm).addClass('errselect');
                  setTimeout(function() {
                          $('.errselect').removeClass('errselect');
                          $('.preselect').removeClass('preselect');
                      }, 500);                 

                }
                
            }


            if(clicks==2){

                clicks=0;
                var pox = lista.join('');
                var inx = pos.indexOf(pox);
                if(inx>-1){
                    scope.$parent.$parent.encontradas++;
                    encontradas++;
                    if(encontradas==4){
                      jQuery('#finjuegobtn').show();
                    }
                    console.log(encontradas);
                    //scope.$apply();
                    jQuery('.preselect').removeClass('preselect');
                    var x1 = lista[0];
                    var y1 = lista[1];
                    var x2 = lista[2];
                    var y2 = lista[3];
                    respuestas.push(pox);
                    npalabras++;

                    if(x1==x2){
                        constante = x1;
                        if(y1>y2){
                            inicio=y2;
                            final=y1;
                        }
                        else{
                            inicio = y1;
                            final=y2;
                        }

                        for(x=inicio;x<=final;x++){
                            cadena = '.row_'+x+'>.col_'+constante;
                            jQuery(cadena).addClass('upercaser');

                        }
                    }
                    else{
                        constante = y1;
                        if(x1>x2){
                            inicio = x2;
                            final = x1;
                        }
                        else{
                            inicio = x1;
                            final = x2;
                        }

                        for(x=inicio;x<=final;x++){
                            cadena = '.row_'+constante+'>.col_'+x;
                            jQuery(cadena).addClass('upercaser');

                        }
                    }
                }
                else{
                  //jQuery('.preselect').removeClass('preselect');
                  //alert('ups, esa no es la palabra.');
                  $(elm).addClass('errselect');

                  setTimeout(function() {
                          $('.errselect').removeClass('errselect');
                          $('.preselect').removeClass('preselect');
                      }, 500);

                }
                scope.$parent.$parent.junta = [];
                //scope.$apply();

            }

            
        });        

    }
  };

}]);




angular.module("mainApp").directive('finalizarJuego', ['$http',function($http) {

  return {
    restrict: 'A',
    link: function(scope, elm, attrs) {  
        elm.click(function(e){

            var preguntas = scope.lista.length;
            var respuestas = scope.respuestas.length;

            if(preguntas>respuestas)
              return true;


            fino = 1;
            var uri = 'https://admin.experienciastelcel.com/restful/finalsopa/'+upk+'/'+id_dinamica+'/';
            var data = {'respuestas':npalabras,'tiempo':tiempofinal};
            var params = {'url':uri,'method':'GET','params':data};
            $http(params).then(function(response) {

               scope.startgame = 2; 
               scope.tiempofinal = tiempofinal; 
               scope.totales = preguntas;
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
              var inicia = new Date(Date.now());
              upTime(inicia);
          }
        },true);



    }
  };



}]);



myapp.controller('sopaCtr',function($scope,$http){
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
    $scope.ventaja = ventaja_titulo;
    $scope.ventaja_slug = ventaja;
    $scope.encontradas = 0;
    $scope.cuantaspalabras = 0;
    $scope.userConVentaja = userConVentaja;


    $scope.iniciar = function(){
      $scope.startgame = 1;
      if(userConVentaja==true){
        
        console.log('si tengo ventaja',$scope.lista[0]);

        var parma = $scope.lista[0];
        
        $('.row_'+parma[1]+' .col_'+parma[0]).click();
        $('.row_'+parma[3]+' .col_'+parma[2]).click();
      }
      

        $http.get('https://admin.experienciastelcel.com/restful/participando/'+upk+'/'+id_dinamica+'/').
        then(function(response) {
            
            if(response.data.status=='finalizo'){
                $scope.finalizado = true;
                $scope.hiddens = false;

            }
            else{
                $scope.finalizado = false;
                $scope.hiddens = true;
                $scope.tiempo = response.data.inicioUTC;
                $scope.tmp_pices = new Date(Date.now());
                
            }
        });



    }


    $http.get("https://admin.experienciastelcel.com/restful/promocion/"+id_dinamica+"/")
    .then(function(response) {
      $scope.dinamica = response.data.promocion;
      $scope.sopa = response.data.promocion.preguntas.tablero;
      $scope.lista = response.data.promocion.preguntas.lista; 
      $scope.palabras = response.data.promocion.preguntas.palabras; 
      $scope.cuantaspalabras = response.data.promocion.preguntas.palabras.length;
    });
   


});



})(window.angular);




