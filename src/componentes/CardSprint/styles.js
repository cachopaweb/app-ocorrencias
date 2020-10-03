import styled, { css } from 'styled-components';

export const Container = styled.div`
  position: relative;
  background: #FFF;
  border-radius: 5px;
  margin-bottom: 10px;
  color: black;
  padding: 15px;
  box-shadow: 0 1px 4px 0 rgb(192, 208, 230, 0.8);
  border-top: 20px solid rgb(230, 236, 245, 0.4); 
  transition: width 0.6s;
  header{
      position: absolute;
      top: -22px;
  }  

  p{
    font-weight: 500;
    text-justify: distribute;
    white-space: pre-wrap;
    width: 100%;
  }

  :hover{
    transform: translateY(-2px);
  }

  img{
      width: 24px;
      height: 24px;
      border-radius: 2px;
      margin-top: 5px;
  }

  ${props => props.isDragging && css `
    border: 2px dashed rgba(0, 0, 0, 0.2);
    padding-top: 31px;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    cursor: grabbing;

    p, img, span, h3{
      opacity: 0;
    }
  `}
`;

export const Label = styled.span`
    width: 10px;
    height: 10px;
    border-radius: 2px;
    display: inline-block;
    background-color: ${props => props.color};
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