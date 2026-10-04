import styled from "styled-components";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { DashboardContent } from "../styles";
import FadeIn from "react-fade-in";
import { TicketsPlane, CirclePlus, ChartNoAxesCombined, CircleUserRound, Compass, Globe, Plane } from "lucide-react";

const MainDiv = styled.div`
  background-color: #f8fafc;
  display: flex;
  width: 100%;
  min-height: 100vh; 
  overflow-x: hidden;
`;

export const SummaryGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
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
  flex-direction: row;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
  border: 1px solid #e2e8f0;
  width: 100%;
  max-width: 1100px;
  overflow: hidden;
  margin: 0 auto;
  box-sizing: border-box;

  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }

  @media screen and (max-width: 800px) {
    border-radius: 16px;
    width: 100%;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #fff;
  padding: 3.5rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(59, 130, 246, 0.15);
    color: #60a5fa;
    border: 1px solid rgba(59, 130, 246, 0.25);
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    width: fit-content;
  }

  h1 {
    font-size: 2.2rem;
    font-weight: 800;
    margin-top: 0;
    margin-bottom: 0.75rem;
    letter-spacing: -0.02em;
    line-height: 1.2;
    color: #ffffff;
  }

  p {
    font-size: 1.05rem;
    color: #94a3b8;
    line-height: 1.6;
    margin: 0;
  }

  @media screen and (max-width: 1024px) {
    text-align: center;
    align-items: center;
    padding: 2.5rem 2rem;

    .badge {
      margin-left: auto;
      margin-right: auto;
    }
  }

  @media screen and (max-width: 600px) {
    padding: 2rem 1.25rem;

    h1 {
      font-size: 1.55rem;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 0.92rem;
    }
  }
`;

const RightPanel = styled.div`
  flex: 1.4;
  padding: 3rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  background-color: #ffffff;

  @media screen and (max-width: 1024px) {
    padding: 2rem;
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 1.25rem 1rem;
    gap: 0.75rem;
  }

  @media screen and (max-width: 360px) {
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }
`;

const NavButton = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  border-radius: 14px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  text-decoration: none;
  color: #1e293b;
  font-weight: 600;
  font-size: 0.98rem;
  text-align: center;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px -3px rgba(59, 130, 246, 0.15);
    background-color: #f0fdf4;
    border-color: #86efac;
    color: #059669;

    svg {
      color: #059669;
      transform: scale(1.08);
    }
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    margin-bottom: 0.75rem;
    width: 34px;
    height: 34px;
    color: #3b82f6;
    transition: all 0.2s ease;
  }

  @media screen and (max-width: 600px) {
    padding: 1.1rem 0.6rem;
    font-size: 0.88rem;
    border-radius: 12px;

    svg {
      width: 28px;
      height: 28px;
      margin-bottom: 0.4rem;
    }
  }
`;

const Main = () => {
  return (
    <MainDiv>
      <Navbar />
      <DashboardContent>
        <FadeIn style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
          <Container>
            <LeftPanel>
              <div className="badge">
                <Plane size={14} /> Twój dziennik lotniczy
              </div>
              <h1>Witaj w logbooku</h1>
              <p>
                Dodaj swój ostatni lot lub zajrzyj w statystyki i mapy wszystkich twoich lotów!
              </p>
            </LeftPanel>

            <RightPanel>
              <NavButton to="/my-profile">
                <CircleUserRound />
                Mój Profil
              </NavButton>

              <NavButton to="/flights">
                <TicketsPlane />
                Loty
              </NavButton>

              <NavButton to="/add-flight">
                <CirclePlus />
                Dodaj lot
              </NavButton>

              <NavButton to="/stats">
                <ChartNoAxesCombined />
                Statystyki
              </NavButton>

              <NavButton to="/map">
                <Compass />
                Mapa lotów
              </NavButton>

              <NavButton to="/visited-countries">
                <Globe />
                Odwiedzone kraje
              </NavButton>
            </RightPanel>
          </Container>
        </FadeIn>
      </DashboardContent>
    </MainDiv>
  );
};

export default Main;
