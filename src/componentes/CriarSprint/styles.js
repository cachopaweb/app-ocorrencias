import styled from 'styled-components';

export const Container = styled.div`
    
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
  width: 100px;
  height: 100px;
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
