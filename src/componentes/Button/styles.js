import styled from 'styled-components';

export const Container = styled.div`
    button {
        display: inline-block;
        font-size: 1.1rem;
        font-weight: 600;
        color: ${props => props.corTexto || "black"};
        background-color: ${props => props.color || "#323540" };
        margin: 5px 5px 0px;
        padding: 10px 10px;
        text-decoration: none;
        border-radius: 5px;
        transition: all 150ms linear 0s;
        border-radius: ${props => props.borderRadius || 0}
    }

    button:hover {
      opacity: 0.9;
    }
`;
