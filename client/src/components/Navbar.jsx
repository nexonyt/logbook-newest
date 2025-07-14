import React from 'react';
import { NavBarStyle, StyledLink, NavGroup, LogoutLink, NavGroupForLogout } from './styles';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import '../App.css';
import { FaHome, FaPlane, FaPlusCircle, FaChartBar, FaSignOutAlt } from 'react-icons/fa'; // import ikon

export default function NavBar() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.warn('You have been logged out');
  };

  return (
    <NavBarStyle>
      <NavGroup>
        <StyledLink to="/dashboard">
          <FaHome style={{ marginRight: '6px' }} /> Panel główny
        </StyledLink>
        <StyledLink to="/flights">
          <FaPlane style={{ marginRight: '6px' }} /> Loty
        </StyledLink>
        <StyledLink to="/add-flight">
          <FaPlusCircle style={{ marginRight: '6px' }} /> Dodaj lot
        </StyledLink>
        <StyledLink to="/stats">
          <FaChartBar style={{ marginRight: '6px' }} /> Statystyki
        </StyledLink>
      </NavGroup>
      <NavGroupForLogout>
        <LogoutLink to='/' onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: '6px' }} /> Wyloguj
        </LogoutLink>
      </NavGroupForLogout>
    </NavBarStyle>
  );
};
