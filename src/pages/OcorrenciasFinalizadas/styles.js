import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;    
    width: 100%;
    overflow-x:auto;
    @media (max-width: 900px){
        max-width: 900px;
        flex-direction: column;     
    }

    .card{
        padding: 8px;
        background-color: white;
        margin-top: 50px;
        border-radius: 8px;
        box-shadow: 0px 2px 2px 2px rgba(0,0,0,0.15)
                    0px 10px 20px -10px rgba(0,0,0,0.1);
        color: black;
        max-width: 940px;
                
    }   

    table {
        border-collapse: collapse;
        border-spacing: 0;
        width: 98%;
        border: 1px solid #ddd;
    }

    th, td {
        text-align: left;
        padding: 8px;
    }

    tr:nth-child(even){background-color: #f2f2f2}    
`;


export const ContainerEtiquetas = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
    @media (max-width: 900px){
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }
    
`

export const ContainerBuscaGrafico = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 5px;

    @media (max-width: 900px){
        flex-direction: column;    
    }
`;

export const ContainerGrafico = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: #FFF;  
    height: 500px;
    width: 500px;
    border-radius: 8px;
    box-shadow: 2px 2px 2px 2px rgba(255,255,255, 0.2);
    padding: 10px;
`;