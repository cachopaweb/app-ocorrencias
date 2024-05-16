
import extenso from 'extenso';

function reaisPorExtenso(numero) {
    var numeroString = numero.toString().replace('.',',');
    
    return extenso(numeroString, { mode: 'currency', currency: { type: 'BRL' } });
  
  }
  
  function extraiDia(data){
    if(data[1]==='/')
      {
        return data[0];
      }
      return data[0]+data[1];
      
  }

  function formatarNumeroVigula(numero) {
    return numero.toFixed(2).replace('.', ',');
}

function dataPorExtenso(data) {
  var meses = [
      "janeiro", "fevereiro", "março", "abril",
      "maio", "junho", "julho", "agosto",
      "setembro", "outubro", "novembro", "dezembro"
  ];

  var data = new Date();
  var dia = data.getDate();
  var mes = meses[data.getMonth()];
  var ano = data.getFullYear();

  return dia + " de " + mes + " de " + ano;
}

function dataAtualPorExtenso()
{
  var dataAtual = new Date();
  return dataPorExtenso(dataAtual);

}
  export { reaisPorExtenso, extraiDia, formatarNumeroVigula, dataAtualPorExtenso, dataPorExtenso };