import styled from "styled-components";

export const File = styled.div`
    border: 2px dashed #ff3333;
    width: 100%;
    max-width: 660px;
    font-size: 16px;
    color: #777777;
    text-align: center;
    display: grid;
    grid-template-columns: 100px 100px 100px;
    grid-gap: 5px;
    background-color: #fff;
    color: #444;
    &.without-files {
        display: flex;
    }
    img {
        width: 100px;
    }
    p {
        margin-top: 15px;
        border: none !important;
    }
`;