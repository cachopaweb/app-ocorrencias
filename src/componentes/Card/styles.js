import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${props => props.atendente != 0 ? "#323540" : "#497336" };
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.3);
  margin: 10px;
  border-radius: 5px;
  padding: 10px;
  max-width: 900px;  
  width: 100vw;
  h3{
    margin-bottom: 10px;
  }
  p{
    margin-bottom: 10px;
  }
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
    width: 100%;
  }
  span{
    background-color: #FFF;
    border-radius: 30px;
    width: 150px;
    box-shadow: 3px 3px 3px 3px rgb(5,5,5, 0.2);
    text-align: center;
    color: black;
    font-weight: bold;
  }
`;
