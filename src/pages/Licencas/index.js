import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import pt_br from 'date-fns/locale/pt-BR';

import api from '../../services/api';
import Header from '../../componentes/Header';
import { Container } from './styles';
import { useLocation, useHistory } from 'react-router-dom';
import Button from '../../componentes/Button';
import { MdEvent, MdSave } from 'react-icons/md';
import Modal from '../../componentes/Modal';
import swal from 'sweetalert';

registerLocale('pt-BR', pt_br);

function Licencas() {
    const [licencas, setLicencas] = useState([]);
    const [novaSenha, setNovaSenha] = useState('');
    const [dataLimite, setDataLimite] = useState(new Date());
    const [modalGerarAtivo, setModalGerarAtivo] = useState(false);
    const [licencaSelecionada, setLicencaSelecionada] = useState({});
    const { state } = useLocation();    
    const history = useHistory();   
    const [licencasVencer, setLicencasVencer] = useState(state?.licencasVencer || []);
    
    async function fetchLicencas() {
        let response = await api.get('/contrassenha');
        setLicencas(response.data);
    }

    async function SubmitNovaLicenca(e) {
        e.preventDefault();
        if (licencaSelecionada.codigo === 0) { swal('Codigo do contrato é obrigatório!', 'Click em gerar!', 'warning'); return; }
        if (novaSenha === '') { swal('O campo Senha é obrigatório!', 'Informe a Senha!', 'warning'); return; }
        let response = await api.post('/contrassenha', {
            senha: novaSenha,
            limite: (new Date(dataLimite)).toLocaleDateString(),
            codigo: licencaSelecionada.codigo
        });
        if (response.status === 200){
            swal('Contrassenha atualizada com sucesso!', 'Bom trabalho!', 'success') 
            history.push('/ocorrencias');               
        }else{
            swal(`Erro ao atualizar contrassenha. ${response.data.error}`, 'Algo deu errado!', 'error')
        }
    }

    const handleClickGerar = (licenca) => {
        setModalGerarAtivo(true);
        setLicencaSelecionada(licenca);
        setNovaSenha(licenca.senha)
    }

    function changeDataLimite(data){
        setDataLimite(data)
    }

    useEffect(() => {
        if (licencasVencer.length === 0)
            fetchLicencas();
    }, [])

    return (
        <>
            <Header title={licencasVencer.length === 0 ? 'Licenças': 'Licenças a Vencer'} />
            <Container>
                <Modal activate={modalGerarAtivo} setActivate={setModalGerarAtivo} altura={350} largura={350} >
                    <form id="form" onSubmit={SubmitNovaLicenca}>
                        <div className="form-group">
                            <label htmlFor="senha">Senha</label>
                            <input type="text" value={novaSenha} onChange={(e)=> setNovaSenha(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="data">Data Limite</label>
                            <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataLimite} onChange={changeDataLimite} />
                        </div>
                        <Button nome="Gerar" borderRadius="8px" color="green" corTexto="white" Icon={MdSave} />
                    </form>
                </Modal>
                <div className="card">
                    <h1>{licencasVencer.length === 0 ? 'Licenças Software' : 'Licenças Software a Vencer'}</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Cliente</th>
                                <th>Senha</th>
                                <th>Contrassenha</th>
                                <th>Data Uso</th>
                                <th>Data Limite</th>
                                <th>Num PCs</th>
                                {licencasVencer.length > 0 && <th>Ação</th>}
                            </tr>
                        </thead>
                        {                            
                            licencas.length > 0 && licencasVencer.length === 0 ? (
                                licencas.length > 0 ? 
                                licencas.map((licenca) => (
                                    <tbody>
                                        <tr>
                                            <th>{licenca.codigo}</th>
                                            <td>{licenca.nome_cliente}</td>
                                            <td>{licenca.senha}</td>
                                            <td>{licenca.contra_senha}</td>
                                            <td>{new Date(licenca.data_uso).toLocaleDateString()}</td>
                                            <td>{licenca.data_limite}</td>
                                            <td>{licenca.pcs}</td>                                            
                                        </tr>
                                    </tbody>
                                ))
                                : <h1>Carregando licenças...</h1>
                            )
                            : (
                                licencasVencer.length > 0 ? 
                                licencasVencer.map((licenca) => (
                                    <tbody>
                                        <tr>
                                            <th>{licenca.codigo}</th>
                                            <td>{licenca.nome_cliente}</td>
                                            <td>{licenca.senha}</td>
                                            <td>{licenca.contra_senha}</td>
                                            <td>{new Date(licenca.data_uso).toLocaleDateString()}</td>
                                            <td>{licenca.data_limite}</td>
                                            <td>{licenca.pcs}</td>
                                            {licencasVencer?.length > 0 && <td><Button click={()=> handleClickGerar(licenca)} nome="Gerar" color="#05F" corTexto="#FFF" Icon={MdEvent} borderRadius="10px" /></td>}
                                        </tr>
                                    </tbody>
                                ))
                                : <h1>Carregando licenças...</h1>
                            )
                        }

                    </table>
                </div>                
            </Container>
        </>
    );
}

export default Licencas;