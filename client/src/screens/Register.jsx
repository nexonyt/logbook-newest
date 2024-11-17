import { useState } from 'react';
import Checkbox from '../styles/Checkbox';
import axios from 'axios';
import {
  DivForInputs,
  ButtonLink,
  Container,
  InputAreaForRegister,
  NewRegisterArea,
  HaveNotAccount,
  CheckboxField,
  AddFlightsDivRow
} from '../styles';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styled from 'styled-components';

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login, logout, isAuthenticated } = useAuth();

    const redirectToLogin = () => {
      navigate('/')
    }

  const handleRegister = () => {
    if (username || password === null) {
      toast.error(`Puste`);
    }
    else {
      axios
      .post('/register', { username, password })
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
    }
  };

  return (
    <Container>
      
       
    {isAuthenticated ? (
      navigate('/dashboard')
    ) : (
      
    <NewRegisterArea>
    <h2 style={{color: 'white'}}>Formularz rejestracji!</h2>
    <AddFlightsDivRow>
    <DivForInputs>
    <InputAreaForRegister
      type='name'
      placeholder='Imię'
      value={username}
      onChange={(e) => setName(e.target.value)}
      disabled={isAuthenticated}
    />
    </DivForInputs>
    <DivForInputs>
    <InputAreaForRegister
      type='login'
      placeholder='Login'
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      disabled={isAuthenticated}
    />
    </DivForInputs>
    </AddFlightsDivRow>
    <AddFlightsDivRow>
    <DivForInputs>
     <InputAreaForRegister
      type='password'
      placeholder='Password'
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      disabled={isAuthenticated}
    /></DivForInputs>
    <DivForInputs>
     <InputAreaForRegister
      type='password'
      placeholder='Confirm Password'
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      disabled={isAuthenticated}
    /></DivForInputs>
</AddFlightsDivRow>
<FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Kim jesteś?</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value="Kim jesteś?"
    label="Kim jesteś?"
  >
    <MenuItemStyled value={10}>Pilotem</MenuItemStyled>
    <MenuItemStyled value={20}>Stewardem</MenuItemStyled>
    <MenuItemStyled value={30}>Stewardessą</MenuItemStyled>
    <MenuItemStyled value={30}>Fanem lotnictwa</MenuItemStyled>
    <MenuItemStyled value={30}>Podrónikiem</MenuItemStyled>
    <MenuItemStyled value={30}>Inne</MenuItemStyled>
  </Select>
</FormControl>
<CheckboxField>
     
     <Checkbox value="Akceptuje regulamin usługi"/>
      </CheckboxField>
     <ButtonLink onClick={handleRegister}>Zarejestruj się</ButtonLink>
     <HaveNotAccount onClick={redirectToLogin}>
            <p>Zaloguj się do istniejącego konta</p>
           </HaveNotAccount>
    </NewRegisterArea>
     
)}
</Container>
  );
}

const MenuItemStyled = styled(MenuItem)`
  && {
    background-color: #ffffff;
    &:hover {
      background-color: #d3d3d3;
    }
  }
`;  