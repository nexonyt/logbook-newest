import { useState } from 'react';
import axios from 'axios';
import {
  DivForInputs,
  ButtonLink,
  Container,
  InputArea,
  NewRegisterArea,
  HaveNotAccount
} from '../styles';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function RegisterPage() {
  const [username, setUsername] = useState('');
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
    <h2 style={{color: 'white'}}>Zarejestruj się!</h2>
    <DivForInputs>
    <InputArea
      type='login'
      placeholder='Login'
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      disabled={isAuthenticated}
    />
    </DivForInputs>
    <DivForInputs>
     <InputArea
      type='password'
      placeholder='Password'
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      disabled={isAuthenticated}
    /></DivForInputs>
    <DivForInputs>
     <InputArea
      type='password'
      placeholder='Confirm Password'
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      disabled={isAuthenticated}
    /></DivForInputs>
     <ButtonLink onClick={handleRegister}>Register</ButtonLink>
     <HaveNotAccount onClick={redirectToLogin}>
            <p>Zaloguj się do konta</p>
           </HaveNotAccount>
    </NewRegisterArea>
     
)}
</Container>
  );
}