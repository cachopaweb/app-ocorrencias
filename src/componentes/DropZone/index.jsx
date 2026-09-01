import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

function Dropzone({ setArquivos }) {
    const onDrop = useCallback((acceptedFiles) => {
        setArquivos(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));     
      }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div className="border-2 border-dashed border-[#ff3333] w-full max-w-[660px] text-[16px] text-center grid grid-cols-[100px_100px_100px] gap-[5px] bg-white text-[#444] [&_img]:w-[100px] [&_p]:mt-[15px] [&_p]:border-none" {...getRootProps()}>
        <input {...getInputProps()} />
        {
            isDragActive ?
            <p>Solte arquivos aqui ...</p> :
            <p>Solte arquivos aqui, ou click para selecioná-los</p>
        }      
        </div>
    )
}

export default Dropzone;