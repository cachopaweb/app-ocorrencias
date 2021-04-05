import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;    
    width: 98%;
    overflow-x:auto;
    .card{
        padding: 8px;
        background-color: white;
        margin-top: 50px;
        border-radius: 8px;
        box-shadow: 0px 2px 2px 2px rgba(0,0,0,0.15)
                    0px 10px 20px -10px rgba(0,0,0,0.1);
        color: black;
        max-width: 940px;
                
    } 
    textarea{
        height: 150px;
        width: 100%;
    }
`;

export const Preview = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
`

export const Thumb = styled.div`
  display: inline-flex;
  border-radius: 2px;
  border: 1px solid #eaeaea;
  margin-bottom: 8px;
  margin-right: 8px;
  width: 80px;
  height: 80px;
  padding: 4px;
`
export const ThumbInner = styled.div`
  display: flex;
  min-width: 0px;
  overflow: hidden;
  img{
    display: block;
    width: auto;
    height: 100%;
  }
`
