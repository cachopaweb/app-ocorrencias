import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;    
    width: 100vw;
    overflow-x:auto;
    flex-direction: column; 
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
        width: 100%;
        border: 1px solid #ddd;
    }

    th, td {
        text-align: left;
        padding: 8px;
    }

    tr:nth-child(even){background-color: #f2f2f2}    
`;
