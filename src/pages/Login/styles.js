import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;   
  height: 100vh;
  width: 100vw;
  form{
    border-radius: 8px;
    box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.15), 
                0px 10px 20px -10px rgba(0, 0, 0, 0.1); 
    width: 400px;
    background: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
        width: 64px;
        margin: 10px 0 40px;
    }
    p {
        color: #ff3333;
        margin-bottom: 15px;
        border: 1px solid #ff3333;
        padding: 10px;
        width: 100%;
        text-align: center;
    }
    input {
        height: 46px;
        margin-bottom: 15px;
        padding: 0 20px;
        color: #777;
        font-size: 15px;
        width: 100%;
        border: 1px solid #ddd;
        &::placeholder {
        color: #999;
        }
    }
    select{
        height: 46px;
        margin-bottom: 15px;
        padding: 0 20px;
        color: #777;
        font-size: 15px;
        width: 100%;
        border: 1px solid #ddd;
    }    
    button {
        color: #fff;
        font-size: 16px;
        background: #323540;
        height: 56px;
        border: 0;
        border-radius: 5px;
        width: 100%;
        :hover{
            background-color: #fff;
            color: #323540;
            border: 1px solid #323540;
        }
    }
    hr {
        margin: 20px 0;
        border: none;
        border-bottom: 1px solid #cdcdcd;
        width: 100%;
    }
    a {
        font-size: 16;
        font-weight: bold;
        color: #999;
        text-decoration: none;
    }
  }
`;
