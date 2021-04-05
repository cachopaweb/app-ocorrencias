import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;    
    color: black;
    font-weight: bold; 
    #form {
        margin:0;       
        width: 100%;
    }

    #form form {   
        margin: 15px;
        border-radius: 8px;       
        background: white;        
        padding: 20px;          
        box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.15), 
            0px 10px 20px -10px rgba(0, 0, 0, 0.1)
    }

    #form h3 {
        margin-bottom: 30px
    }

    #form label{     
        margin-bottom: 5px;   
    }

    .form-group {
        display: flex;
        flex-direction: column;
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
        height: 40px;
    }

    .btn_salvar{
        width: 45%;
        height: 30px;    
        border: none;
        border-radius: 18px;
        color: white;
        background-color: green;
        margin: 5px;
        box-shadow: 1px 2px 2px 1px rgba(0, 0, 0, 0.5);
        font-weight: bold;
    }

    .btn_salvar:hover{
        color: black;
        background-color: white;
        border: 1px solid #000;
    }

    .btn_cancelar{
        width: 45%;
        height: 30px;    
        border: none;
        border-radius: 18px;
        color: white;
        background-color: red;
        margin: 5px;
        box-shadow: 1px 2px 2px 1px rgba(0, 0, 0, 0.5);
        font-weight: bold;
    }

    .btn_cancelar:hover{
        color: black;
        background-color: white;
        border: 1px solid #000;
    }

    textarea{
        height: 150px;
    }
`;