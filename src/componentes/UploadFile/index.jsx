import React, { useState } from 'react';

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
    }

    const upload = () => {
        let currentFile = selectedFiles[0];

        setProgress(0);
        setCurrentFile(currentFile);

        UploadFilesService(currentFile, (event) => {
            console.log(event);
            setProgress(Math.round((100 * event.loaded) / event.total));
        })
            .then((response) => {
                setMessage(response.data.message);
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
                setIsError(true)
            });
        setSelectedFiles(undefined);
    }


    return (
        <div className="mx-auto flex items-center justify-center w-1/2 h-full bg-[#f5f5f5] text-[#333] rounded p-[10px] mb-[10px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.75)] mt-[20px]">
            {currentFile && (
                <div className="mb-6 flex items-center text-blue-500 w-full">
                    <div className="w-full mr-2 bg-gray-200 rounded-full h-4">
                        <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="min-w-[35px]">
                        <span className="text-gray-500 text-sm">{`${progress}%`}</span>
                    </div>
                </div>
            )}

            <label htmlFor="btn-upload">
                <input
                    id="btn-upload"
                    name="btn-upload"
                    style={{ display: 'none' }}
                    type="file"
                    onChange={selectFile} />
                <button
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300 mr-2"
                    type="button"
                    onClick={() => document.getElementById('btn-upload').click()}
                >
                    Escolha um arquivo
                </button>
            </label>
            <div className="inline-block mt-2 font-semibold">
                {selectedFiles && selectedFiles.length > 0 ? selectedFiles[0].name : null}
            </div>
            <button
                className={`ml-4 px-4 py-2 rounded-md text-white transition duration-300 ${!selectedFiles || selectedFiles.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={!selectedFiles || selectedFiles.length === 0}
                onClick={upload}>
                Upload
            </button>
            <div className={`mt-2 text-sm font-medium ${isError ? "text-red-500" : "text-green-500"}`}>
                {message}
            </div>
        </div>
    );
}

export default UploadFile;