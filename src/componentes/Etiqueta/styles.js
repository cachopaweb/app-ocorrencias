import styled from 'styled-components'

export const Container = styled.div`
    display: flex;
    background: ${props => props.cor};
    color: ${props => props.corTexto};
    border-radius: 7px;
    width: 130px;
    height: 130px;
    margin: 5px;
    padding: 5px;
    box-shadow: 2px 3px 2px 2px rgba(255,255,255, 0.5);
    justify-content: space-between;
    align-items: center;
    flex-direction: column; 
    font-size: 15px;
    p{
        justify-content: center;
        align-items: center;
        font-weight: 400;  
        font-size: 18px;  
        align-items: center;
        text-align: center;
    }
    #percent{
        margin: 10px 0 25px;
        font-size: 20px;
    }
` 