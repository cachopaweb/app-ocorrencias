import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useLocation } from 'react-router-dom';
import Button from '../../componentes/Button';
import { MdAttachMoney, MdPrint } from 'react-icons/md';
import Modal from '../../componentes/Modal';
import Recibo from '../../componentes/Recibos/recibo';
import { extraiDia, reaisPorExtenso } from '../../functions/utils';


function ContaReceber() {
  const [aReceber, setContaReceber] = useState([]);  
  const [carregando, setCarregando] = useState(false);  
  const [modalRecibo, setModalRecibo] = useState(false);
  const [recibo, setRecibo] = useState();
  const { state } = useLocation();
  const [total, SetTotal] = useState(0.0);
  function dataAtualFormatada() {
    var data = new Date(),
      dia = data.getDate().toString(),
      diaF = (dia.length === 1) ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length === 1) ? '0' + mes : mes,
      anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
  }

  async function fetchData(){
      setCarregando(true)
      const data1 = '01/01/1900';
      const data2 = dataAtualFormatada();
      let response = await api.get(`/Clientes/${state.contrato}?data1=${data1}&data2=${data2}`);
      await setContaReceber(response.data);
      setCarregando(false)       
  }

  function SomaTotal(){
    let soma = 0.0;   
    aReceber.map(conta => soma += parseFloat(conta.valor));  
    SetTotal(soma);
  }

  function ImprimiRecibo(conta){
    console.log(conta);
    setRecibo({cliente : conta.nome,
      endereco : conta.endereco+' - '+conta.cidade,
      valor: conta.valor,
      referencia: 'Mensalidade Ref. A '+conta.referencia,                
      valortxt: reaisPorExtenso(conta.valor),
      venc: extraiDia(conta.vencimento),
      codPix: conta.codRecebimento
      });
    setModalRecibo(true);
  }

  useEffect(()=>{
    fetchData();    
  }, [])  

  return (
      <>
        <Modal activate={modalRecibo} setActivate={setModalRecibo} altura={'auto'} largura={'auto'}>
                {modalRecibo && <Recibo recibo={recibo} />}
            </Modal>
        <div className="flex justify-center items-center w-full overflow-x-auto">
            <div className="p-2 bg-white mt-[50px] rounded-lg shadow-[0px_2px_2px_2px_rgba(0,0,0,0.15),0px_10px_20px_-10px_rgba(0,0,0,0.1)] text-black">                                
                {
                    aReceber.length > 0 && !carregando ?                        
                        <table className="w-full border-collapse border border-[#ddd]">
                          <thead>
                            <tr>
                              <th className="text-left p-2">Duplicata</th>
                              <th className="text-left p-2">Vencimento</th>
                              <th className="text-left p-2">Valor</th>
                              <th className="text-left p-2">Ação</th>
                            </tr>
                          </thead>
                          {aReceber.map((conta, index)=> (                            
                            <tbody key={conta.duplicata || index}>
                              <tr className="even:bg-[#f2f2f2]">
                                <th scope="row" className="text-left p-2">{conta.duplicata}</th>
                                <td className="text-left p-2">{new Date(conta.vencimento).toLocaleDateString()}</td>
                                <td className="text-left p-2">R$ {parseFloat(conta.valor).toFixed(2)}</td>
                                <td className="text-left p-2"><Button nome="Imprimir Recibo" click={()=> ImprimiRecibo(conta)} Icon={MdPrint} color={'Black'} corTexto={'white'} borderRadius={'18px'} /></td>                              
                              </tr>   
                              {index === aReceber.length-1 &&                                  
                                  <tr className="even:bg-[#f2f2f2]" style={{ display: 'flex', flexFlow: 'flex-end' }}>
                                    <td className="text-left p-2"><strong>Total: R$ {parseFloat(total).toFixed(2)}</strong></td>   
                                    <td className="text-left p-2"><Button nome="Ver Total" click={()=> SomaTotal()} Icon={MdAttachMoney} color={'Black'} corTexto={'white'} borderRadius={'18px'} /></td>
                                  </tr>
                              }
                            </tbody>                  
                            )
                          )
                          }                                                                          
                        </table>
                    : 
                    carregando ? <h1>Carregando conta Receber</h1> : <h1>Nada há receber</h1>                    
                }                
            </div>            
        </div>
      </>
  );
}

export default ContaReceber;