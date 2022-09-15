import React from 'react';

import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';

import { Container } from './styles';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    borderRadius: '8px',
    p: 4,
}

function CustomModal({ activate, setActivate, children, altura = 600, largura = 800, left = 0 }) {
    return (
        <Modal
            open={activate}
            onClose={() => setActivate(false)}
        >
            <Box style={style}>
                <Container>
                    {children}
                </Container>
            </Box>
        </Modal>
    );
}

export default CustomModal;