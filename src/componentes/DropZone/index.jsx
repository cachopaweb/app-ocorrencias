import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { cn } from '../../lib/utils';

function Dropzone({ setArquivos, className = '' }) {
  const onDrop = useCallback((acceptedFiles) => {
    setArquivos(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
  }, [setArquivos]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-2",
        isDragActive
          ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
          : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
        <UploadCloud className="w-5 h-5" />
      </div>
      <div className="text-xs">
        {isDragActive ? (
          <p className="font-semibold text-indigo-600 dark:text-indigo-400">Solte os arquivos aqui...</p>
        ) : (
          <p>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Clique para selecionar</span> ou arraste arquivos
          </p>
        )}
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Imagens, anexos ou prints</p>
      </div>
    </div>
  );
}

export default Dropzone;