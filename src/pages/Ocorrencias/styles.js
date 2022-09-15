import styled from 'styled-components';

export const Container = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 96vw;
`;

export const Floating = styled.div`
  bottom: 25px;
  position: fixed;
  right: 25px;

  @media (max-width: 905px){
    bottom: 20px;
    position: fixed;
    right: 20px
  }
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
