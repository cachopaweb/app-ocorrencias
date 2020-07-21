import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${props => props.atendente != 0 ? "white" : "#B2D9A0" };
  color: #323540;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.15), 
            0px 10px 20px -10px rgba(0, 0, 0, 0.1);
  margin: 10px;
  border-radius: 5px;
  max-width: 900px;  
  padding: 10px;
  width: 92vw;
  h3{
    margin-bottom: 10px;
  }
  p{
    margin-bottom: 10px;
    text-justify: distribute;
  }
  :hover{
    transform: translateY(-2px);
  }
  .actions{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #F0F0F2;
    padding: 5px;
    border-radius: 18px;
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
    margin-top: 5px;
  }
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
