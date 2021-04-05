import styled from 'styled-components';

export const Container = styled.div`
    ${props => `${props.altura === '80vh' ? 'display: flex;' : ''}`}
    ${props => `${props.altura === '80vh' ? 'justify-content: center;' : ''}`}       
    .modal-overlay {        
        display: flex;  
        justify-content: center;  
        align-items: center;                  
        position: absolute;
        color: black;
        z-index: 5;
        opacity: 0;
        visibility: hidden; 
        
    }
    .modal-overlay.active {
        opacity: 1;
        visibility: visible;
    }
    .modal {
        padding: 10px;
        border-radius: 3px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        opacity: 0;
        overflow-y: auto;
        visibility: hidden;
        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
        transform: scale(1.2);
        background-color: white;                
        height: ${props => `${props.altura}`};
        width: ${props => `${props.largura}`};         
        margin-left: ${props => `${props.left}`};    
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

    .modal .modal-content img{
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

    color: black;
    font-weight: bold; 
    @media (max-width: 700px){

    }    
        
    #form {
        padding: 20px 0;
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

    .react-datepicker-wrapper{
        width: 100%;
    }

    textarea{
        height: 150px;
    }
`;
