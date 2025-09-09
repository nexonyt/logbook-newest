import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import NavBar from "../components/Navbar";
import ContentLoader from "react-content-loader";
import FadeIn from "react-fade-in";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import UniqueAirports from "./UniqueAirports";
import {
  AlertTriangle,
  Hourglass,
  Plane,
  Clock5,
  Ticket,
  MapPinHouse,
  MapPin,
  AlarmClockOff,
} from "lucide-react";

const MyCustomLoader = () => (
  <ContentLoader
    width="100%"
    height={80}
    viewBox="0 0 380 80"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
  </ContentLoader>
);

const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
`;

const FlightsContent = styled.div`
  display: block;
  width: 100%;
  min-height: 100vh;
  padding: 3rem 1.5rem;
  box-sizing: border-box;
`;

const StatsContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Title = styled.h1`
  color: #89216b;
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 2.4rem;
  text-align: center;
`;

export const MyProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;

  @media screen and (max-width: 800px) {
    gap: 0.2rem;
  }
`;

// Grid dla podsumowania (3 karty obok siebie)
export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;

  @media screen and (max-width: 800px) {
    gap: 1rem;
  }
`;

// Grid dla szczegółowych statystyk (np. 3 kolumny)
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

export const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

export const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0.5rem 0 1rem;
`;

export const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
`;

export const StatSubtext = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const BoldedText = styled.span`
  font-weight: bold;
  color: black;
`;

export default function MyProfile() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://api-flights.nexonstudio.pl/getflightdurationsum",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userID: 1 }),
          }
        );
        if (!res.ok) throw new Error("Błąd w pobieraniu danych");
        const data = await res.json();

        await new Promise((resolve) => setTimeout(resolve, 1500));

        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  function formatDate(delay) {
    // zakładamy, że delay jest stringiem "H:MM"
    const [hours, minutes] = delay.split(":");
    return `${hours}h ${minutes}m`;
  }

  if (loading)
    return (
      <MainWrapper>
        <NavBar />
        <ContentWrapper>
          <FadeIn>
            <MyProfileContainer>
              <h2>Mój profil</h2>
              
            </MyProfileContainer>
          </FadeIn>
        </ContentWrapper>
      </MainWrapper>
    );

  if (error)
    return (
      <MainWrapper>
        <NavBar />
        <ContentWrapper>
          <FlightsContent>
            <StatsContainer>
              <Title>Statystyki</Title>
              <p style={{ color: "red" }}>Błąd: {error}</p>
            </StatsContainer>
          </FlightsContent>
        </ContentWrapper>
      </MainWrapper>
    );

  return (
    <MainWrapper>
      <NavBar />
      <ContentWrapper>
        <MyProfileContainer>
          <h2>Mój profil</h2>
          
        </MyProfileContainer>
      </ContentWrapper>
    </MainWrapper>
  );
}
