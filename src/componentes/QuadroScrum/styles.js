import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  padding: 30px 0;
  margin: 10px;
  height: calc(100% -80px);
  width: 100vw;
  @media (max-width: 700px) {
    flex-direction: column;   
  }
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

