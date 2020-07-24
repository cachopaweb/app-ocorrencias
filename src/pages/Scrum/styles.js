import styled from 'styled-components';

export const Container = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto;
    max-width: 800px;
    margin: 0 auto;    
`;

export const Pesquisa = styled.div`
    #form{
        max-width: 800px;
        padding-top: 10px;
        margin: 0 auto;       

        label{
            margin: 0px 15px 0px 0px;
        }
        input[type=text] {
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

        .form-group input[type=checkbox]{                        
            height: 20px;
        }
        .form-group{
            padding: 0px 10px;        
        }  

        .form-group select {
            width: 100%;
            font-size: 1.1em;
            margin-top: 5px;
            margin-bottom: 5px;
            height: 40px;
        }  
    }
`;
