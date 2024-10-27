import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Container = styled.div`
  height: 98vh;
    box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #da4453, #89216b);

`;


export const ContainerLogin = styled.div`
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* border: 3px solid white; */
  border-radius: 25px;
  flex-direction: column;
  background-color: rgb(123, 54, 244);
  padding: 10px;
`;

export const ContainerRegister = styled.div`
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* border: 3px solid white; */
  border-radius: 25px;
  flex-direction: column;
  background-color: rgb(123, 54, 244);
  padding: 10px;
`;

export const LoggedArea = styled.div`
  width: 90%;
  display: flex;
  align-items: center;

  justify-content: space-around;
`;

export const LoggedAreaText = styled.div`
  width: 50%;
  display: flex;
  gap: 10px;
`;

export const ButtonLogoutArea = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const ButtonLogout = styled(Link)`
  text-decoration: none;
  color: black;
  width: 30%;
  background-color: white;
  font-size: 12px;
  border-radius: 15px;
  text-align: center;
  padding: 2px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LoginArea = styled.div`
  width: 85%;
  height: 320px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border: 2px solid black;
  border-radius: 25px;
  gap: 10px;
`;

export const InputArea = styled.input`
color: white;
  width: 50%;
  height: 45px;
  display: flex;
  border-radius: 5px;
  text-indent: 15px;
  outline: none;
  box-shadow: 0 2px 8px rgba(15, 15, 15, 0.6);
  background-color: #1c1c1c;
  border: 0;
  &:focus {
    text-indent: 15px;
    border: 2px solid white;
    transition: border-color 0.3s ease-in-out;
    outline: none;
  }
`;

export const ButtonLink = styled(Link)`
  text-decoration: none;
  color: black;
  width: 35%;
  outline: 0;
  background-color: white;
  border-radius: 3px;
  text-align: center;
  margin-top: 15px;
  padding: 7px 0;
  &:hover {
  background-color: #c4c4c4;
  transition: all 0.3s ease-in-out
  }
`;

export const LoggedContainer = styled.div`
  width: 80%;
  height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  text-align: center;
`;

export const NewLoginArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  width: 300px;
  height: 400px;
  background-color: rgb(21,21,21);
`

export const NewRegisterArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  width: 300px;
  height: 400px;
  background-color: rgb(21,21,21);
`

export const DivForInputs = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 60px;
`
export const HaveNotAccount = styled.div`
/* display: flex; */
color: white;
text-decoration: underline;

&:hover {
cursor: pointer;
}
`

export const CheckboxField = styled.div`
font-size: 14px;
  color: white;
`

export const CheckboxMark = styled.div`

`
export const DashboardContent = styled.div`
display: flex;
height: 100vh;
overflow-y: auto; 
min-width: 85vw;
justify-content: center;
flex-direction: column;
align-items: center;
`


export const FlightsContent = styled.div`
height: 100vh;
overflow-y: auto; 
`