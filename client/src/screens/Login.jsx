import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  DivForInputs,
  ButtonLink,
  Container,
  InputArea,
  NewLoginArea,
  HaveNotAccount,
  InputWrapper
} from '../styles';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, Lock, Plane } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    if (username === '' || username == null) {
      toast.error("Wpisz login");
    } else {
      axios
        .post('/login', { username, password })
        .then((res) => {
          const { token } = res.data;
          login(token);
          toast.success('Logowanie prawidłowe');
        })
        .catch((err) => {
          const errMsg = err.response?.data?.message || 'Błędny login lub hasło';
          toast.error(errMsg);
          toast.info('Jeżeli nie masz konta, zarejestruj się');
        });
    }
  };

  const redirectToRegister = () => {
    navigate('/register');
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <Container>
      <NewLoginArea>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem', width: '100%' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(59, 130, 246, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#60a5fa',
            marginBottom: '1rem',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <Plane size={28} style={{ transform: 'rotate(45deg)' }} />
          </div>
          <h2 style={{ margin: 0 }}>Logbook Lotniczy</h2>
          <p style={{ color: '#94a3b8', margin: '0.5rem 0 0 0', fontSize: '0.875rem', textAlign: 'center' }}>
            Zaloguj się, aby kontynuować
          </p>
        </div>

        <DivForInputs style={{ width: '100%' }}>
          <InputWrapper>
            <User size={18} />
            <InputArea
              type='text'
              placeholder='Nazwa użytkownika'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isAuthenticated}
            />
          </InputWrapper>
        </DivForInputs>

        <DivForInputs style={{ width: '100%' }}>
          <InputWrapper>
            <Lock size={18} />
            <InputArea
              type='password'
              placeholder='Hasło'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isAuthenticated}
            />
          </InputWrapper>
        </DivForInputs>

        <ButtonLink as="button" onClick={handleLogin}>
          Zaloguj się
        </ButtonLink>

        <HaveNotAccount onClick={redirectToRegister}>
          <p>Nie masz konta? Zarejestruj się</p>
        </HaveNotAccount>
      </NewLoginArea>
    </Container>
  );
}
