import styled from 'styled-components';

export const Container = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto;
    max-width: 1200px;
    margin: 0 auto;   

    @media (max-width: 705px) {
        grid-template-columns: auto auto auto;         
    }

    @media (max-width: 525px) {
        grid-template-columns: auto auto;         
    }
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

export const Floating = styled.div`
  bottom: 25px;
  position: fixed;
  right: 25px;

  @media (max-width: 905px){
    bottom: 20px;
    position: fixed;
    right: 20px
  }
`;

export const Tabela = styled.table`
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    border: 1px solid #ddd;
    th, td {
        text-align: left;
        padding: 8px;
    }

    tr:nth-child(even){
        background-color: #f2f2f2
    }
`;

export const LinhaDestaque = styled.th`
    background-color: ${props => props.cor};
    color: ${props => props.corTexto};
    border-radius: 8px;
    text-align: center;     
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    height: 60px;
`

export const Card = styled.div`
    padding: 8px;
    background-color: white;
    margin-top: 50px;
    border-radius: 8px;
    box-shadow: 0px 2px 2px 2px rgba(0,0,0,0.15)
                0px 10px 20px -10px rgba(0,0,0,0.1);
    color: black;    
    max-width: 1200px;     
`;