import styled from "styled-components";
import Navbar from "../components/Navbar";
import { DashboardContent } from "../styles";
import FadeIn from "react-fade-in";
import { TicketsPlane,CirclePlus,ChartNoAxesCombined,CircleUserRound } from "lucide-react";
const MainDiv = styled.div`
  background-color: #fafafa;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 100vh; 
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
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  overflow: hidden;
  margin: 0rem 3rem;

   @media screen and (max-width: 1500px) {
    width: 85%;
  }

  @media screen and (max-width: 1300px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  background-color: #131218;
  color: #fff;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    font-size: 2.5em;
    font-weight: 700;
    margin-bottom: 10px;
  }

  p {
    font-size: 1.1em;
    color: #cbd5e1;
  }

    @media screen and (max-width: 1300px) {
 justify-content: center;
 align-items: center;
 text-align: center;
    }

  @media screen and (max-width: 600px) {
    padding: 20px;

    h1 {
      font-size: 1.8em;
    }

    p {
      font-size: 1em;
    }
  }
`;

const RightPanel = styled.div`
  flex: 1.5;
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media screen and (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 20px;
  }
`;

const NavButton = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px;
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

  @media screen and (max-width: 600px) {
    padding: 15px;
    font-size: 1em;

    svg {
      width: 36px;
      height: 36px;
      margin-bottom: 10px;
    }
  }
`;

const Main = () => {

  return (
    <MainDiv>
      <Navbar />
      <DashboardContent>
        <FadeIn>
          <Container>
            <LeftPanel>
              <h1>Witaj w logbooku</h1>
              <p>
                Dodaj swój ostatni lot lub zajrzyj w statystyki wszystkich twoich lotów!
              </p>
            </LeftPanel>

            <RightPanel>
              <NavButton href="my-profile">
                <CircleUserRound />
                Mój Profil
              </NavButton>

              <NavButton href="flights">
                <TicketsPlane />
                Loty
              </NavButton>

              <NavButton href="add-flight">
                <CirclePlus />
                Dodaj lot
              </NavButton>

              <NavButton href="stats">
                <ChartNoAxesCombined />
                Statystyki
              </NavButton>
            </RightPanel>
          </Container>
        </FadeIn>
      </DashboardContent>
    </MainDiv>
  );
};

export default Main;
