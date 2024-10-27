import { Link } from "react-router-dom";
import styled from "styled-components";

// Styl kontenera nawigacji
export const NavBarStyle = styled.div`
  display: flex;
  position: sticky;
  color: white;
  top: 0;

  flex-direction: column;
  gap: 5rem;
  width: 12rem;
  min-height: 100vh;
  background-color: #131218;
  justify-content: space-between;
`;

export const NavGroup = styled.div`
  gap: 1rem;
  width: 12rem;
  top: 0;
  padding: 3rem 2rem;
  color: white;
  display: flex;
  flex-direction: column;
`;

export const NavGroupForLogout = styled.div`
  gap: 1rem;
  width: 12rem;
  top: 0;
  padding: 3rem 2rem;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Stylowanie linków wewnątrz nawigacji
export const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #ff7a00; /* Pomarańczowy kolor przy hover */
  }

  &:active {
    color: #ff4d00; /* Ciemniejszy odcień po kliknięciu */
  }
`;

export const LogoutLink = styled(Link)`
  text-decoration: none;
  color: black;
  width: 120px;
  outline: 0;
  background-color: white;
  border-radius: 3px;
  text-align: center;
  margin-top: 15px;
  padding: 7px 0;
  &:hover {
    background-color: #c4c4c4;
    transition: all 0.3s ease-in-out;
  }
`;
