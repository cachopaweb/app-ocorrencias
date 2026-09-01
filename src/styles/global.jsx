import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    @import url('https://fonts.googleapis.com/css?family=Roboto:400,500&display=swap');
    * {
        margin: 0;
        padding: 0;
        outline: none;
        box-sizing: border-box;
    }

    html, body, #root{
        height: 100% auto;
    }


    body{
        font: 14px 'Roboto', sans-serif;
        background-color: ${(props) => props.theme.background};
        color: ${props => props.theme.text};
        -webkit-font-smoothing: antialiased;
    }

    h1 {
        color: ${props => props.theme.titles};        
    }

    ul{
        list-style: none;
    }  

    a{
       cursor: grabbing;
    } 

    :root{
        --primary-color: #323540;
        --secondary-color: #B2D9A0;        
    }
`;