import styled from 'styled-components';

export const Container = styled.div`
    margin-top: 20px;    
`;

export const Form = styled.div`
    #form {
        margin: 10px;       
        width: 100%;        
    }

    #form form {    
        margin: 15px;
        border-radius: 8px;       
        background: white;        
        box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.15), 
            0px 10px 20px -10px rgba(0, 0, 0, 0.1)
    }

    #form label{     
        margin-bottom: 5px;   
    }

    .form-group {
        display: flex;
        margin-bottom: 10px;
    }

    .form-group label.right-inline {
        text-align: right;  
        padding-right: 8px;
        padding-left: 10px;
        width: auto;
    }

    .form-group .input-control {
        padding: 5px;
        font-size: 1rem;       
    }

    #form .button {
        margin: 20px 8px 10px;
    }

    #form .action{
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    #form input, select {
        width: 100%;
        font-size: 1.1em;
        margin-top: 5px;
        margin-bottom: 5px;
        height: 20px;
    }
`;

export const Centralizar = styled.div`
  height: 100vh;
  width: 100vw;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;
