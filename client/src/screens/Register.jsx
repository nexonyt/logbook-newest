import { useState, useEffect } from 'react';
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
  AddFlightsDivRow,
  InputWrapper
} from '../styles';
import { toast } from 'react-toastify';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { User, Lock, Plane } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styled from 'styled-components';

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(10);
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const redirectToLogin = () => {
    navigate('/');
  };

  const handleRegister = () => {
    if (!name || !username || !password || !confirmPassword) {
      toast.error('Wszystkie pola są wymagane');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Hasła nie są identyczne');
      return;
    }
    axios
      .post('/register', { username, password })
      .then((res) => {
        toast.success(res.data.message || 'Zarejestrowano pomyślnie!');
        navigate('/');
      })
      .catch((err) => {
        const errMsg = err.response?.data?.message || 'Rejestracja nie powiodła się';
        toast.error(errMsg);
      });
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <Container>
      <NewRegisterArea>
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
          <h2 style={{ margin: 0 }}>Utwórz konto</h2>
          <p style={{ color: '#94a3b8', margin: '0.5rem 0 0 0', fontSize: '0.875rem', textAlign: 'center' }}>
            Dołącz do załogi i loguj swoje loty
          </p>
        </div>

        <AddFlightsDivRow>
          <DivForInputs>
            <InputWrapper>
              <User size={18} />
              <InputAreaForRegister
                type='text'
                placeholder='Imię'
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAuthenticated}
              />
            </InputWrapper>
          </DivForInputs>
          <DivForInputs>
            <InputWrapper>
              <User size={18} />
              <InputAreaForRegister
                type='text'
                placeholder='Login'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isAuthenticated}
              />
            </InputWrapper>
          </DivForInputs>
        </AddFlightsDivRow>

        <AddFlightsDivRow>
          <DivForInputs>
            <InputWrapper>
              <Lock size={18} />
              <InputAreaForRegister
                type='password'
                placeholder='Hasło'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isAuthenticated}
              />
            </InputWrapper>
          </DivForInputs>
          <DivForInputs>
            <InputWrapper>
              <Lock size={18} />
              <InputAreaForRegister
                type='password'
                placeholder='Potwierdź hasło'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isAuthenticated}
              />
            </InputWrapper>
          </DivForInputs>
        </AddFlightsDivRow>

        <FormControl fullWidth sx={{
          mb: 1,
          mt: 1,
          '& .MuiInputLabel-root': { color: '#94a3b8', fontSize: '0.95rem' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#60a5fa' },
          '& .MuiOutlinedInput-root': {
            color: '#f8fafc',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '12px',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)', transition: 'border-color 0.3s ease' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
            '&.Mui-focused fieldset': { borderColor: '#60a5fa' },
          },
          '& .MuiSelect-icon': { color: '#94a3b8' }
        }}>
          <InputLabel id="role-select-label">Kim jesteś?</InputLabel>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={role}
            label="Kim jesteś?"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItemStyled value={10}>Pilotem</MenuItemStyled>
            <MenuItemStyled value={20}>Stewardem</MenuItemStyled>
            <MenuItemStyled value={30}>Stewardessą</MenuItemStyled>
            <MenuItemStyled value={40}>Fanem lotnictwa</MenuItemStyled>
            <MenuItemStyled value={50}>Podróżnikiem</MenuItemStyled>
            <MenuItemStyled value={60}>Inne</MenuItemStyled>
          </Select>
        </FormControl>

        <CheckboxField>
          <Checkbox value="Akceptuję regulamin usługi" />
        </CheckboxField>

        <ButtonLink as="button" onClick={handleRegister}>
          Zarejestruj się
        </ButtonLink>

        <HaveNotAccount onClick={redirectToLogin}>
          <p>Masz już konto? Zaloguj się</p>
        </HaveNotAccount>
      </NewRegisterArea>
    </Container>
  );
}

const MenuItemStyled = styled(MenuItem)`
  && {
    background-color: #111827;
    color: #f8fafc;
    font-family: inherit;
    &:hover {
      background-color: #1f2937;
    }
    &.Mui-selected {
      background-color: #3b82f6;
      color: #ffffff;
      &:hover {
        background-color: #2563eb;
      }
    }
  }
`;