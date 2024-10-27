import { useState } from 'react';
import axios from 'axios';
import {
  DivForInputs,
  ButtonLink,
  Container,
  InputArea,
  NewLoginArea,
  HaveNotAccount
} from '../styles';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    clearFields();
    toast.warn('Nastąpiło wylogowanie');
  };

  const clearFields = () => {
    setUsername('');
    setPassword('');
  };

  const handleLogin = () => {
    if (username === '' || username == null) {
      toast.error("Nic nie podałeś")
    }
    else {
      axios
      .post('/login', { username, password })
      .then((res) => {
        const { token } = res.data;
        login(token);
        toast.success('Logowanie prawidłowe');
      })
      .catch((err) => {
        toast.error(err.response);
        toast.error('Jeżeli nie masz konta, zarejestruj się');
      });
    };
    
  }

  const redirectToRegister = () => {
    navigate('/register')
  }

  const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      toast.success('Your Token is valid');
    } else {
      toast.error('No private route access');
      toast.error('Register and login to access the private route');
      toast.error('You have been redirected to the registration screen.');
    }
  };

  return (
    <Container>
      
       
          {isAuthenticated ? (
            navigate('/dashboard')
          ) : (
            
          <NewLoginArea>
          <h2 style={{color: 'white'}}>Zaloguj się!</h2>
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
           <ButtonLink onClick={handleLogin}>Login</ButtonLink>
           <HaveNotAccount onClick={redirectToRegister}>
            <p>Zarejestruj się</p>
           </HaveNotAccount>
          </NewLoginArea>
           
      )}
    </Container>
  );
}

