import React, { useState, useEffect } from 'react';
import { 
  NavBarStyle, 
  StyledLink, 
  NavGroup, 
  LogoutLink, 
  NavGroupForLogout,
  MobileMenuButton,
  NavBackdrop,
  BrandHeader
} from './styles';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import '../App.css';
import { FaHome, FaPlane, FaPlusCircle, FaChartBar, FaSignOutAlt, FaBars, FaTimes, FaMap, FaGlobe } from 'react-icons/fa';
import { IoAccessibility } from "react-icons/io5";

export default function NavBar() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    toast.warn('Zostałeś wylogowany');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Przycisk hamburger menu widoczny na mobile */}
      <MobileMenuButton 
        $isOpen={isOpen} 
        onClick={toggleMenu} 
        aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </MobileMenuButton>

      {/* Przyciemnione tło (backdrop) zamykające menu po kliknięciu poza nim */}
      <NavBackdrop $isOpen={isOpen} onClick={() => setIsOpen(false)} />

      <NavBarStyle $isOpen={isOpen} className={isOpen ? 'open' : ''}>
        <BrandHeader>
          <FaPlane /> Logbook
        </BrandHeader>

        <NavGroup>
          <StyledLink to="/dashboard" onClick={() => setIsOpen(false)}>
            <FaHome /> Panel główny
          </StyledLink>
          <StyledLink to="/flights" onClick={() => setIsOpen(false)}>
            <FaPlane /> Loty
          </StyledLink>
          <StyledLink to="/add-flight" onClick={() => setIsOpen(false)}>
            <FaPlusCircle /> Dodaj lot
          </StyledLink>
          <StyledLink to="/stats" onClick={() => setIsOpen(false)}>
            <FaChartBar /> Statystyki
          </StyledLink>
          <StyledLink to="/map" onClick={() => setIsOpen(false)}>
            <FaMap /> Mapa lotów
          </StyledLink>
          <StyledLink to="/visited-countries" onClick={() => setIsOpen(false)}>
            <FaGlobe /> Mapa świata
          </StyledLink>
          <StyledLink to="/my-profile" onClick={() => setIsOpen(false)}>
            <IoAccessibility /> Mój profil
          </StyledLink>
        </NavGroup>

        <NavGroupForLogout>
          <LogoutLink to="/" onClick={handleLogout}>
            <FaSignOutAlt /> Wyloguj
          </LogoutLink>
        </NavGroupForLogout>
      </NavBarStyle>
    </>
  );
}
