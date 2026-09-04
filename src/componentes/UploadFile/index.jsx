import React, { useState } from 'react';
import { Upload, FileUp, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import Button from '../Button';
import useUploadFilesService from '../../Hooks/useUploadService';

function UploadFile() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(0);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [fileInfos, setFileInfos] = useState([]);
  const [isError, setIsError] = useState(false);
  const { UploadFilesService } = useUploadFilesService();

  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };

  const upload = () => {
    let currentFile = selectedFiles[0];

    setProgress(0);
    setCurrentFile(currentFile);

    UploadFilesService(currentFile, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        setMessage(response.data.message || 'Arquivo importado com sucesso!');
        setIsError(false);
      })
      .then((files) => {
        if (files && files.data) {
          setFileInfos(files.data);
        }
      })
      .catch(() => {
        setProgress(0);
        setCurrentFile(undefined);
        setIsError(true);
        setMessage('Erro ao realizar o upload do arquivo.');
      });
    setSelectedFiles(undefined);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4 transition-colors">
      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Importar Arquivo de NCM / IBPT
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Selecione uma planilha ou tabela de NCM para atualizar a base de dados
          </p>
        </div>
      </div>

      {currentFile ? (
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Enviando arquivo...</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="btn-upload">
          <input
            id="btn-upload"
            name="btn-upload"
            style={{ display: 'none' }}
            type="file"
            onChange={selectFile}
          />
          <Button
            type="button"
            variant="outline"
            Icon={FileUp}
            nome="Escolher Arquivo"
            onClick={() => document.getElementById('btn-upload').click()}
          />
        </label>

        {selectedFiles && selectedFiles.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
            <span className="truncate max-w-xs">{selectedFiles[0].name}</span>
          </div>
        )}

        <Button
          type="button"
          variant="indigo"
          disabled={!selectedFiles || selectedFiles.length === 0}
          onClick={upload}
          Icon={Upload}
          nome="Fazer Upload"
        />

        {message && (
          <div
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${
              isError
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'
                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50'
            }`}
          >
            {isError ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadFile;