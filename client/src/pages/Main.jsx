import styled from "styled-components";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { ButtonLink, DashboardContent } from "../styles";

const MainDiv = styled.div`
  background-color: #fafafa;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100vh;
`;
export const SummaryGrid = styled.div`
  display: flex; /* Zmieniamy na flexbox */
  flex-wrap: nowrap; /* Wymuszamy układanie w jednym rzędzie */
  gap: 1.5rem;

  @media screen and (max-width: 800px) {
    gap: 1rem;
  }
`;

export const StatCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 150px;
`;

const Container = styled.div`
  display: flex;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 1200px;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  flex: 1;
  background-color: #131218;
  color: #fff;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;

  h1 {
    font-size: 3em;
    font-weight: 700;
    margin-bottom: 10px;
  }

  p {
    font-size: 1.2em;
    color: #cbd5e1;
  }
`;

const RightPanel = styled.div`
  flex: 1.5;
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
`;

const NavButton = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  border-radius: 12px;
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  text-decoration: none;
  color: #4a5568;
  font-weight: 600;
  font-size: 1.1em;
  transition: transform 0.2s ease, box-shadow 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    background-color: #ebf4ff;
  }

  svg {
    margin-bottom: 15px;
    width: 48px;
    height: 48px;
    stroke-width: 2;
    stroke: currentColor;
  }
`;
const Main = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.warn("You have been logged out");
  };

  return (
    <MainDiv>
      <Navbar></Navbar>
      <DashboardContent>

         <Container>
        <LeftPanel>
          <h1>Witaj w logbooku</h1>
          <p>
            Wybierz jedną z opcji, aby przejść do odpowiedniego panelu i
            zarządzać swoimi danymi.
          </p>
        </LeftPanel>

        <RightPanel>
          <NavButton href="#">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" />
            </svg>
            Panel główny
          </NavButton>

          <NavButton href="flights">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M17 10L12 15L7 10" />
              <rect x="3" y="1" width="18" height="22" rx="2" />
            </svg>
            Loty
          </NavButton>

          <NavButton href="add-flight">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19" />
              <path d="M5 12H19" />
            </svg>
            Dodaj lot
          </NavButton>

          <NavButton href="stats">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 12h2m-2 0a9 9 0 1018 0 9 9 0 00-18 0zM12 3v2m0 16v2m7-9h2m-2-7h-2.5a4 4 0 00-4 4v2a4 4 0 004 4h2.5m-5 0H5m-2-7v-2" />
            </svg>
            Statystyki
          </NavButton>
        </RightPanel>
      </Container>

      </DashboardContent>
    </MainDiv>
  );
};

export default Main;
