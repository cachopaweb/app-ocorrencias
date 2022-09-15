import styled from "styled-components";

export const Container = styled.div`
    article{
        display: flex;
        align-content: space-between;
        flex-direction: column;
        background-color: #323540;
        box-shadow: 0px 2px 2px 2px rgba(0,0,0,0.2), 0px 10px 20px -10px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #B2D9A0;             
        margin: 10px 5px 10px 5px;
        padding: 10px;          
        p{
          font-size: 1rem;
        }
        h1{
            color: white;
        }
        :hover{
          transform: translateY(-2px);
        }
      }
`;