import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Tło przyciemniające na mobile (backdrop)
export const NavBackdrop = styled.div`
  display: none;

  @media (max-width: 800px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1190;
    opacity: ${(props) => (props.$isOpen ? 1 : 0)};
    pointer-events: ${(props) => (props.$isOpen ? "auto" : "none")};
    transition: opacity 0.25s ease-in-out;
  }
`;

// Przycisk hamburger menu na mobile
export const MobileMenuButton = styled.button`
  display: none;

  @media (max-width: 800px) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 14px;
    left: 14px;
    z-index: 1300;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: ${(props) => (props.$isOpen ? "#1e293b" : "rgba(255, 255, 255, 0.95)")};
    color: ${(props) => (props.$isOpen ? "#ffffff" : "#0f172a")};
    border: 1px solid ${(props) => (props.$isOpen ? "#334155" : "rgba(226, 232, 240, 0.9)")};
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8px);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: scale(0.96);
    }
  }
`;

// Styl kontenera nawigacji
export const NavBarStyle = styled.div`
  display: flex;
  position: sticky;
  color: white;
  top: 0;
  height: 100vh;
  flex-direction: column;
  width: 14rem;
  min-height: 100vh;
  background-color: #0f172a;
  border-right: 1px solid #1e293b;
  justify-content: space-between;
  overflow-y: auto;
  z-index: 100;
  flex-shrink: 0;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
  }

  /* MOBILE - wysuwany drawer */
  @media (max-width: 800px) {
    position: fixed;
    left: 0;
    top: 0;
    width: 280px;
    max-width: 82vw;
    height: 100vh;
    z-index: 1200;
    background-color: #0f172a;
    box-shadow: ${(props) => (props.$isOpen ? "10px 0 30px rgba(0, 0, 0, 0.4)" : "none")};
    transform: translateX(${(props) => (props.$isOpen ? "0" : "-100%")});
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    padding-top: 60px;
  }
`;

export const BrandHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
  border-bottom: 1px solid #1e293b;

  svg {
    color: #3b82f6;
  }

  @media (max-width: 800px) {
    padding: 0 1.5rem 1rem 1.5rem;
  }
`;

export const NavGroup = styled.div`
  gap: 0.4rem;
  width: 100%;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export const NavGroupForLogout = styled.div`
  width: 100%;
  padding: 1.25rem 1rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid #1e293b;
  box-sizing: border-box;
  margin-top: auto;
`;

// Stylowanie linków wewnątrz nawigacji
export const StyledLink = styled(Link)`
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  transition: all 0.2s ease;

  svg {
    font-size: 1.15rem;
    color: #94a3b8;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  &:hover {
    color: #ffffff;
    background-color: #1e293b;

    svg {
      color: #3b82f6;
      transform: translateX(2px);
    }
  }

  &:active {
    background-color: #334155;
  }
`;

export const LogoutLink = styled(Link)`
  text-decoration: none;
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 10px;
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:hover {
    background-color: #ef4444;
    color: #ffffff;
    border-color: #ef4444;
  }
`;
