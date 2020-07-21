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
