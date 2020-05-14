import styled from 'styled-components';

export const Container = styled.footer`
    width:100%;
    background: #323540;
    padding: 20px;
    margin:0;
    display:flex;
    align-items: center;
    justify-content: center;
    color: black;
    form{
        width: 90%;
        max-width: 900px;

        background: white;
        
        box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.15), 
            0px 10px 20px -10px rgba(0, 0, 0, 0.1)
    }

    .input-control{
        width: 100%;    
        display: flex;
        flex-direction: row;
        padding: 12px;
        font-size: 1.2rem;
    }

    .input-control label{
        margin-right: 15px;
        width: 180px;
        margin-top: 20px;
    }
    
    .input-control input{
        height: 40px;
        width: 100%;
        margin-top: 20px;
    }

    .input-control textarea{
        width: 100%;
        height: 50px;
    }

    form .action{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
    }

    form select {
        height: 30px;
        width: 100%;
        margin-top: 20px;
    }
`;
