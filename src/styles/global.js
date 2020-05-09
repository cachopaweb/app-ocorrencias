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
        background-color: #FFF;
        color: #000;
        -webkit-font-smoothing: antialiased;
    }

    ul{
        list-style: none;
    }   
`;