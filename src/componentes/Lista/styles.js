import styled from 'styled-components';

export const Container = styled.div`
  padding: 0 15px;
  height: 100%;
  flex: 0 0 0 0 250px;
  width: 100%;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 250px;

  & + div {
      border-left: 1px solid rgb(0, 0, 0, 0.05);
  }

  header{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 42px;

      h2{
          font-weight: 500;
          font-size: 16px;
          padding: 0 10px;
      }

      button{
          width: 42px;
          height: 42px;
          border-radius: 18px;
          background-color: #3b5bfd;
          border: 0;
          cursor: pointer; 
          margin-bottom: 5px;
      }

      ul{
          margin-top: 30px;
      }
  }
`;
