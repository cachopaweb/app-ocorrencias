import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  background: #FFF;
  border-radius: 5px;
  margin-bottom: 10px;
  color: black;
  padding: 15px;
  box-shadow: 0 1px 4px 0 rgb(192, 208, 230, 0.8);
  border-top: 20px solid rgb(230, 236, 245, 0.4);
  header{
      position: absolute;
      top: -22px;
  }  

  p{
    font-weight: 500;
  }

  img{
      width: 24px;
      height: 24px;
      border-radius: 2px;
      margin-top: 5px;
  }
`;

export const Label = styled.span`
    width: 10px;
    height: 10px;
    border-radius: 2px;
    display: inline-block;
    background-color: ${props => props.color};
`;
