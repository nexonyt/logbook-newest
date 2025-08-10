import React, { useState } from 'react';
import { NavBarStyle, StyledLink, NavGroup, LogoutLink, NavGroupForLogout } from './styles';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import '../App.css';
import { FaHome, FaPlane, FaPlusCircle, FaChartBar, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

export default function NavBar() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.warn('You have been logged out');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Ikona hamburgera widoczna tylko na mobile */}
      <div className="mobile-menu-button" onClick={toggleMenu}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      <NavBarStyle className={isOpen ? 'open' : ''}>
        <NavGroup>
          <StyledLink to="/dashboard" onClick={() => setIsOpen(false)}>
            <FaHome style={{ marginRight: '6px' }} /> Panel główny
          </StyledLink>
          <StyledLink to="/flights" onClick={() => setIsOpen(false)}>
            <FaPlane style={{ marginRight: '6px' }} /> Loty
          </StyledLink>
          <StyledLink to="/add-flight" onClick={() => setIsOpen(false)}>
            <FaPlusCircle style={{ marginRight: '6px' }} /> Dodaj lot
          </StyledLink>
          <StyledLink to="/stats" onClick={() => setIsOpen(false)}>
            <FaChartBar style={{ marginRight: '6px' }} /> Statystyki
          </StyledLink>
        </NavGroup>
        <NavGroupForLogout>
          <LogoutLink to='/' onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: '6px' }} /> Wyloguj
          </LogoutLink>
        </NavGroupForLogout>
      </NavBarStyle>
    </>
  );
}
