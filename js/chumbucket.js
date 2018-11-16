

sets = 
  {'devel':
    {
      'resturi':'http://telcelbk.local/restful/'
    }
  },
  {'production':
    {
      'resturi':'https://admin.experienciastelcel.com/restful/'
    }
  };



var configurator = function(envirom){
      this.envirom = envirom;
      this.getResturl = function(){
        return this.sets[this.envirom]['resturi'];
      }


}


var envirom = 'devel';

console.log(sets[envirom]['resturi']);

function formatnumbers(numero){
    formado = '0' + numero;
    return formado.slice(-2);
  }


function upTime(countTo) {
  now = new Date();
  countTo = new Date(countTo);
  difference = (now-countTo);
  tiempox=convertMS(difference);
  
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
