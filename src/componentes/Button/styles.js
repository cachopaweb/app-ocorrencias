import styled from 'styled-components';

export const Container = styled.button`
    display: inline-block;
    font-size: 15px;
    font-weight: 600;
    color: ${props => props.corTexto || "black"};
    background-color: ${props => props.color || "#323540" };
    margin: 5px 5px 0px;
    padding: 10px 10px;
    text-decoration: none;
    transition: all 150ms linear 0s;
    border-radius: ${props => props.borderRadius || 0}
/*     
    :hover {
      opacity: 0.9;
      color: "black";
      background-color: "white";
      border: 1px solid #000;
    } */
`;
