import styled from 'styled-components';

export const Container = styled.div` 
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;       
    .modal-overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        height: auto;
        width: 400px;
        top: 25%;
        left: 10%;
        z-index: 5;
        opacity: 0;
        visibility: hidden;          
    }
    .modal-overlay.active {
        opacity: 1;
        visibility: visible;                 
    }
    .modal {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;           
        width: 90%;
        height: 90%;
        margin: 0 auto;
        padding: 10px;
        border-radius: 3px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        opacity: 0;
        overflow-y: auto;
        visibility: hidden;
        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
        transform: scale(1.2);
        background-color: white;
    }
    .modal .close-modal {
        position: absolute;
        cursor: pointer;

        top: 5px;
        right: 5px;
        
        opacity: 0;
        
        transition: opacity 0.6s cubic-bezier(0.55, 0, 0.1, 1), transform 0.6s cubic-bezier(0.55, 0, 0.1, 1);
        transition-delay: 0.3s;
    }
    .modal .close-modal svg {
        width: 18px;
        height: 18px;
        margin-right: 10px;
    }
    .modal .modal-content {
        opacity: 0;
        transition: opacity 0.6s cubic-bezier(0.55, 0, 0.1, 1);
        transition-delay: 0.3s;
        height: 100%;
        width: 100%;        
    }
    .modal.active {
        visibility: visible;
        opacity: 1;
        transform: scale(1);
    }
    .modal.active .modal-content {
        opacity: 1;
    }
    .modal.active .close-modal {
        transform: translateY(10px);
        opacity: 1;
    }

    #form{
        width:100%;
        height: 100%;
        padding: 80px 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    #form form {      
      padding: 20px;      
      box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.15), 
         0px 10px 20px -10px rgba(0, 0, 0, 0.1)
    }

    #form h1 {
        margin-bottom: 20px;
        text-align: center;
    }

    #form form label {
        display: none;
    }

    .form-group {
        display: flex;
        flex-direction: row;
    }

    .form-group label.right-inline {
        text-align: right;  
        padding-right: 8px;
        padding-left: 10px;
        width: auto;
    }

    .form-group .input-control {
        flex: 1 1;
        display: block;
        margin: -4px 8px 10px;
        padding: 12px;
        font-size: 1.1rem;
        width: 100% ;
    }

    #form select {
        width: 100%;
        font-size: 1.1em;
        margin-top: 5px;
        margin-bottom: 10px;
        height: 40px;
    }
    
    textarea{
        height: 150px;
    }   

    #form .botao:hover {
        opacity: 0.9;
    }

    .action{
         display: flex;
         justify-content: center;
         align-items: center;
    }
    @media (max-width: 980px){
        #form {
            display: flex;
            flex-direction: column;
            justify-content: center;                        
        }

        #form form{
            width: 100%;  
        }
    }
`;
