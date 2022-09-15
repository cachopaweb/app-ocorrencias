import React, { useState } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Box, Typography, Button, ListItem, withStyles, Card } from '@material-ui/core';

import { Container } from './styles';
import useUploadFilesService from '../../Hooks/useUploadService';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 15,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: "#EEEEEE",
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress);

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
                setFileInfos(files.data);
            })
            .catch(() => {
                setProgress(0);
                setCurrentFile(undefined);
                setIsError(true)
            });
        setSelectedFiles(undefined);
    }


    return (
        <Container style={{ marginTop: '20px' }}>
            {currentFile && (
                <Box className="mb25" display="flex" alignItems="center" color='primary'>
                    <Box width="100%" mr={1}>
                        <BorderLinearProgress variant="determinate" value={progress} />
                    </Box>
                    <Box minWidth={35}>
                        <Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
                    </Box>
                </Box>)
            }

            <label htmlFor="btn-upload">
                <input
                    id="btn-upload"
                    name="btn-upload"
                    style={{ display: 'none' }}
                    type="file"
                    onChange={selectFile} />
                <Button
                    className="btn-choose"
                    variant="outlined"
                    component="span" >
                    Escolha um arquivo
                </Button>
            </label>
            <div className="file-name">
                {selectedFiles && selectedFiles.length > 0 ? selectedFiles[0].name : null}
            </div>
            <Button
                className="btn-upload"
                color="primary"
                variant="contained"
                component="span"
                disabled={!selectedFiles}
                onClick={upload}>
                Upload
            </Button>
            <Typography variant="subtitle2" className={`upload-message ${isError ? "error" : ""}`}>
                {message}
            </Typography>
        </Container>
    );
}

export default UploadFile;