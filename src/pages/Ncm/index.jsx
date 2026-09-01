import React, { useState, useEffect } from 'react';
import UploadFile from '../../componentes/UploadFile'
import api from '../../services/api';

function Ncm() {
    const [ncms, setNcms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [total, setTotal] = React.useState(0);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getNcm = async () => {
        setIsLoading(true);
        const response = await api.get(`/ncm?page=${page + 1}&limit=${rowsPerPage}`);
        const data = response.data;
        setNcms(data);
        setIsLoading(false);
    }

    useEffect(() => {
        getNcm();
    }, [page, rowsPerPage]);

    const getTotalNcms = async () => {
        const response = await api.get('/ncm/total');
        const data = response.data;
        setTotal(data.total);
    }

    useEffect(() => {
        getTotalNcms();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            
            <UploadFile />
            
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {!isLoading ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Código</th>
                                        <th className="px-6 py-3 font-medium">Ncm</th>
                                        <th className="px-6 py-3 font-medium">Exceção</th>
                                        <th className="px-6 py-3 font-medium">Tabela</th>
                                        <th className="px-6 py-3 font-medium">Descrição</th>
                                        <th className="px-6 py-3 font-medium">Aliq. Fed. Nac.</th>
                                        <th className="px-6 py-3 font-medium">Aliq. Fed. Imp.</th>
                                        <th className="px-6 py-3 font-medium">Aliq. Est.</th>
                                        <th className="px-6 py-3 font-medium">Aliq. Mun.</th>
                                        <th className="px-6 py-3 font-medium">Chave</th>
                                        <th className="px-6 py-3 font-medium">Fim Vigência</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {ncms.length > 0 ? (
                                        ncms.map((ncm, index) => (
                                            <tr key={ncm.codigo || index} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">{ncm.codigo}</td>
                                                <td className="px-6 py-4">{ncm.ncm}</td>
                                                <td className="px-6 py-4">{ncm.excecao}</td>
                                                <td className="px-6 py-4">{ncm.tabela}</td>
                                                <td className="px-6 py-4">{ncm.descricao}</td>
                                                <td className="px-6 py-4">{ncm.aliqFedNac}</td>
                                                <td className="px-6 py-4">{ncm.aliqFedImp}</td>
                                                <td className="px-6 py-4">{ncm.aliqEst}</td>
                                                <td className="px-6 py-4">{ncm.aliqMun}</td>
                                                <td className="px-6 py-4">{ncm.chaveIbpt}</td>
                                                <td className="px-6 py-4">{new Date(ncm.fimVigencia).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="11" className="px-6 py-8 text-center text-slate-500">
                                                Não há NCMs cadastrados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600">Linhas por página:</span>
                                <select 
                                    className="border border-slate-300 rounded text-sm p-1 bg-white"
                                    value={rowsPerPage} 
                                    onChange={handleChangeRowsPerPage}
                                >
                                    {[5, 10, 25, 35, 50, 100].map(val => (
                                        <option key={val} value={val}>{val}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-600">
                                    Total: {total}
                                </span>
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => handleChangePage(Math.max(0, page - 1))}
                                        disabled={page === 0}
                                        className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <button 
                                        onClick={() => handleChangePage(page + 1)}
                                        disabled={(page + 1) * rowsPerPage >= total}
                                        className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50"
                                    >
                                        Próxima
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="p-12 text-center text-slate-500 font-medium animate-pulse">
                        Carregando Tabela de NCMs...
                    </div>
                )}
            </div>
        </div>
    );
}

export default Ncm;