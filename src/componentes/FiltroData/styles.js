import styled from 'styled-components';

export const Container = styled.div`
  margin: 10px;  
  display: flex;
  align-items: center;
  justify-content: center;      
  form{
        border-radius: 8px;
        box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.15), 
                    0px 10px 20px -10px rgba(0, 0, 0, 0.1); 
        width: 300px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
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
