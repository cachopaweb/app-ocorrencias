import styled from 'styled-components';

export const Container = styled.div`
  background-color: #323540;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.3);
  margin: 10px;
  border-radius: 5px;
  padding: 10px;
  max-width: 900px;  
  width: 100vw;
  :hover{
    transform: translateY(-7px);
  }
  .actions{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content{
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;
