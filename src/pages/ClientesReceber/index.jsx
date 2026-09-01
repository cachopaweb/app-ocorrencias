import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import pt_br from 'date-fns/locale/pt-BR';

import api from '../../services/api';
import Modal from '../../componentes/Modal';
import { useLocation, useHistory } from 'react-router-dom';
import Button from '../../componentes/Button';
import { MdEvent, MdSave } from 'react-icons/md';

import swal from 'sweetalert';

registerLocale('pt-BR', pt_br);

export default function ClientesReceber() {
    const [clientesDevedores, setClientesDevedores] = useState([]);
    const [carregando, SetCarregando] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState({});
    const [novaSenha, setNovaSenha] = useState('');
    const [dataLimite, setDataLimite] = useState(new Date());
    const [modalGerarAtivo, setModalGerarAtivo] = useState(false);
    const { state } = useLocation();
    const history = useHistory();
    
    const fetchClientesDevedores = async () => {
        SetCarregando(true);
        const sql = `SELECT
                        CONT_CODIGO,
                        CLI_NOME,
                        CID_NOME,
                        CLI_FONE,
                        CLI_CELULAR,
                        LIC_CODIGO,
                        LIC_SENHA,
                        SUM(REC_VALOR) AS VALOR,
                        SUM(REC_JUROS) AS REC_JUROS,
                        SUM(REC_DESCONTOS) AS DESCONTOS
                    FROM RECEBIMENTOS
                    JOIN FATURAMENTOS ON REC_FAT = FAT_CODIGO
                    JOIN CLIENTES ON FAT_CLI = CLI_CODIGO
                    JOIN CONTRATOS ON CONT_CLI = CLI_CODIGO
                    JOIN HONORARIOS ON HON_FAT = FAT_CODIGO
                    JOIN CIDADES ON CLI_CID = CID_CODIGO
                    JOIN LICENCAS ON LIC_CLI = CLI_CODIGO
                    WHERE 
                        CONT_ESTADO = 1
                        AND REC_ESTADO = 1
                        AND (REC_SITUACAO >= 0 AND REC_SITUACAO < 2)
                        AND REC_VENCIMENTO <= DATEADD(-10 DAY TO CURRENT_DATE)
                    GROUP BY 
                        CONT_CODIGO,
                        CLI_NOME,
                        CID_NOME,
                        CLI_FONE,
                        CLI_CELULAR,
                        LIC_CODIGO,
                        LIC_SENHA
                    ORDER BY 
                        CLI_NOME;`;
        try {
            const response = await api.post('v1/dataset', {sql: sql});
            const data = response.data;
            setClientesDevedores(data);
            SetCarregando(false)
        } catch (error) {
            console.error('Error fetching clientes devedores:', error);
            SetCarregando(false)
        }
    };

    const handleClickGerar = (cliente) => {
        setModalGerarAtivo(true);
        setClienteSelecionado(cliente);
        setNovaSenha(cliente.LIC_SENHA)
    }

    function changeDataLimite(data) {
        setDataLimite(data)
    }

    async function SubmitNovaLicenca(e) {
        e.preventDefault();
        if (clienteSelecionado.LIC_CODIGO === 0) { swal('Codigo da licença é obrigatório!', 'Click em gerar!', 'warning'); return; }
        if (novaSenha === '') { swal('O campo Senha é obrigatório!', 'Informe a Senha!', 'warning'); return; }
        let response = await api.post('/contrassenha', {
            senha: novaSenha,
            limite: dataLimite,
            codigo: clienteSelecionado.LIC_CODIGO
        });
        if (response.status === 200) {
            swal('Contrassenha atualizada com sucesso!', 'Bom trabalho!', 'success')
            history.push('/');
        } else {
            swal(`Erro ao atualizar contrassenha. ${response.data.error}`, 'Algo deu errado!', 'error')
        }
    }

    useEffect(() => {        
        fetchClientesDevedores();
    }, []);

    return (
        <>
            <div className="flex flex-col justify-center items-center w-full overflow-x-auto max-[900px]:max-w-[900px]">
            <Modal activate={modalGerarAtivo} setActivate={setModalGerarAtivo} altura={350} largura={350} >
                <div id="form">
                    <form onSubmit={SubmitNovaLicenca}>
                        <div className="form-group">
                            <label htmlFor="senha">Senha</label>
                            <input type="text" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="data">Data Limite</label>
                            <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataLimite} onChange={changeDataLimite} />
                        </div>
                        <Button nome="Gerar" borderRadius="8px" color="green" corTexto="white" Icon={MdSave} />
                    </form>
                </div>
            </Modal>
            <div className="p-2 bg-white mt-[50px] rounded-lg shadow-[0px_2px_2px_2px_rgba(0,0,0,0.15),0px_10px_20px_-10px_rgba(0,0,0,0.1)] text-black max-w-[940px]">
                <h1>Clientes a Receber</h1>
                <table className="border-collapse border-spacing-0 w-[98%] border border-[#ddd]">
                    <thead>
                        <tr>
                            <th className="text-left p-2">Contrato</th>
                            <th className="text-left p-2">Nome</th>
                            <th className="text-left p-2">Cidade</th>
                            <th className="text-left p-2">Valor Devedor</th>
                            <th className="text-left p-2">Telefone</th>
                            <th className="text-left p-2">Celular</th>
                            <th className="text-left p-2">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carregando ? <tr className="even:bg-[#f2f2f2]"><td colSpan="8" className="text-left p-2">Carregando...</td></tr>
                            : (
                                clientesDevedores.map((cli) =>(
                                    <tr key={cli.CONT_CODIGO} className="even:bg-[#f2f2f2]">
                                        <td className="text-left p-2">{cli.CONT_CODIGO}</td>
                                        <td className="text-left p-2">{cli.CLI_NOME}</td>
                                        <td className="text-left p-2">{cli.CID_NOME}</td>
                                        <td className="text-left p-2">R$ {parseFloat(cli.VALOR).toFixed(2)}</td>
                                        <td className="text-left p-2">{cli.CLI_FONE}</td>
                                        <td className="text-left p-2">{cli.CLI_CELULAR}</td>
                                        <td className="text-left p-2"><Button click={() => handleClickGerar(cli)} nome="Bloquear" color="red" corTexto="#FFF" Icon={MdEvent} borderRadius="10px" /></td>
                                    </tr>
                                ))
                            )}                        
                    </tbody>
                    {`Total Registros: ${clientesDevedores.length}`}
                </table>
            </div>
            </div>
        </>

    );
}