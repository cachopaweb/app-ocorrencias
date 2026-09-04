import React from 'react';
import { useHistory } from 'react-router-dom';
import { Building2, Phone, Mail, FileText, DollarSign } from 'lucide-react';
import Badge from '../Badge';
import Button from '../Button';

export default function DetalhesCliente({ cliente }) {
  const history = useHistory();

  function handleContaReceber(contrato, nome) {
    history.push({ pathname: '/contaReceber', state: { contrato: contrato, nome: nome } });
  }

  if (!cliente) return null;

  const nomeExibicao = cliente.nome || cliente.cli_nome || 'Cliente sem nome';
  const telefones = [cliente.celular, cliente.fone].filter(Boolean).join(' • ');

  return (
    <article
      key={cliente.cnpj_cpf || cliente.contrato}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between gap-4 text-slate-800 dark:text-slate-100 max-w-md w-full"
    >
      {/* Topo / Header do Card */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 truncate" title={nomeExibicao}>
              {nomeExibicao}
            </h2>
            {cliente.razao && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate" title={cliente.razao}>
                {cliente.razao}
              </p>
            )}
          </div>
        </div>

        {cliente.contrato && (
          <Badge variant="outline" size="sm" className="font-mono shrink-0">
            #{cliente.contrato}
          </Badge>
        )}
      </div>

      {/* Informações de contato e cadastro */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex flex-col gap-2.5 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{telefones || 'Sem telefone informado'}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate" title={cliente.email || ''}>
            {cliente.email || 'Email não informado'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-mono">{cliente.cnpj_cpf || 'CNPJ/CPF não informado'}</span>
        </div>

        {cliente.insc_estadual && (
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px] pl-5.5">
            <span className="font-medium text-slate-400">IE:</span>
            <span className="font-mono">{cliente.insc_estadual}</span>
          </div>
        )}
      </div>

      {/* Rodapé com botão Ver Pendências */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <Button
          variant="indigo"
          Icon={DollarSign}
          nome="Ver Pendências"
          onClick={() => handleContaReceber(cliente.contrato, cliente.cli_nome || cliente.nome)}
          className="w-full justify-center"
        />
      </div>
    </article>
  );
}