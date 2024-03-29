import { TableRow } from '@material-ui/core';
import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;    
    width: 100%;    
    padding-bottom: 30px;
    overflow-y:auto;
    .card{
        padding: 8px;
        background-color: white;
        margin-top: 50px;
        border-radius: 8px;
        box-shadow: 0px 2px 2px 2px rgba(0,0,0,0.15)
                    0px 10px 20px -10px rgba(0,0,0,0.1);
        color: black;    
        max-width: 1200px;            
    }   

     table {
        border-collapse: collapse;
        border-spacing: 0;
        width: 100%;
        border: 1px solid #ddd;
    }

    th, td {
        text-align: left;
        padding: 5px;
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

    .react-datepicker-wrapper{
        width: 100%;
    }

    textarea{
        height: 150px;
        width: 100%;
    }
`;

export const LinhaDestaque = styled.th`
    background-color: ${props => props.cor};
    color: ${props => props.corTexto};
    border-radius: 8px;
    text-align: center;     
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    height: 50px;
`
const colorNoDia = keyframes`    
  0% {
    background-color: #47B071;
  }
  50% {
    background-color: #FFFFFF;
  }
  100% {
    background-color: #47B071;
  }
`;

const colorAtrasada = keyframes`    
  0% {
    background-color: #F77777;
  }
  50% {
    background-color: #FFFFFF;
  }
  100% {
    background-color: #F77777;
  }
`;

export const ColorAnimationPusing = styled(TableRow)`
    animation-name: ${props => props.hoje ? colorNoDia : colorAtrasada};
    animation-duration: 2s;
    animation-iteration-count: infinite;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Rotate = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
  padding: 2rem 1rem;
  font-size: 1.2rem;
`;