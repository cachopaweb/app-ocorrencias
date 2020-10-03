import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { File } from './styles';

function Dropzone({ setArquivos }) {
    const onDrop = useCallback((acceptedFiles) => {
        setArquivos(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));     
      }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <File{...getRootProps()}>
        <input {...getInputProps()} />
        {
            isDragActive ?
            <p>Solte arquivos aqui ...</p> :
            <p>Solte arquivos aqui, ou click para selecioná-los</p>
        }      
        </File>
    )
}

export default Dropzone;