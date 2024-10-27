import React from 'react';
import { NavBarStyle, StyledLink,NavGroup,LogoutLink,NavGroupForLogout } from './styles'
import {ButtonLink,} from '../styles'
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import '../App.css';

export default function NavBar () {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.warn('You have been logged out');
  };


return (
    <NavBarStyle>
        <NavGroup>
        <StyledLink class="navbarek" to="/dashboard">Panel główny</StyledLink>
        <StyledLink to="/flights">Loty</StyledLink>
        <StyledLink to="/add-flight">Dodaj lot</StyledLink>
        <StyledLink to="/stats">Statystyki</StyledLink>
        </NavGroup>
        <NavGroupForLogout>
        <LogoutLink to='/' onClick={handleLogout}>Wyloguj</LogoutLink>
        </NavGroupForLogout>
    </NavBarStyle>
)
};
