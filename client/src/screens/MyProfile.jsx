import {
  AlertTriangle,
  Hourglass,
  Ticket,
  MapPinHouse,
  AlarmClockOff,
  Globe,
} from "lucide-react";
import SettingsSection from "../components/SettingsSection";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import NavBar from "../components/Navbar";
import ContentLoader from "react-content-loader";
import FadeIn from "react-fade-in";
import CircularProgress from "@mui/material/CircularProgress";
import { Plane, Clock, Calendar, MapPin } from "lucide-react";
import Box from "@mui/material/Box";
import UniqueAirports from "./UniqueAirports";
import airportsData from "../data/airports.json";

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

// export const MyProfileContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 1.5rem;
//   padding: 2rem;

//   @media screen and (max-width: 800px) {
//     gap: 0.2rem;
//   }
// `;

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
// export const StatsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//   gap: 1.5rem;

//   @media screen and (max-width: 800px) {
//     gap: 1rem;
//   }
// `;

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

const MyProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;

  @media screen and (max-width: 800px) {
    padding: 1rem;
    gap: 1.5rem;
  }
`;

const PageTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media screen and (max-width: 800px) {
    font-size: 2rem;
  }
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 2rem;

  @media screen and (max-width: 800px) {
    flex-direction: column;
    padding: 1.5rem;
    text-align: center;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5e5e5e 0%, #393939 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
`;

const LocationBadge = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  color: #6b7280;
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UserName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media screen and (max-width: 800px) {
    font-size: 2rem;
  }
`;

const UserDetails = styled.div`
  font-size: 1.125rem;
  color: #4b4b4b;
  font-weight: 500;
`;

const HomeBase = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 1rem;

  @media screen and (max-width: 800px) {
    justify-content: center;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 1rem 0 0 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// const StatCard = styled.div`
//   background: white;
//   border-radius: 16px;
//   padding: 2rem;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
//   display: flex;
//   /* flex-direction: column; */
//   gap: 1rem;
//   transition: transform 0.2s ease, box-shadow 0.2s ease;

//   &:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
//   }
// `;

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

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(props) => props.color || "#e0f2fe"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.iconColor || "#0891b2"};
`;

// const StatValue = styled.div`
//   font-size: 2.5rem;
//   font-weight: 700;
//   color: #1a1a1a;
//   line-height: 1;
// `;

const StatLabel = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-top: -0.5rem;
`;

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function getBaseAirport(icao) {
    if (!icao) return null;

    const airport = airportsData[icao];
    if (!airport) return `${icao} - Nieznane lotnisko`;

    const iata = airport.iata || "brak IATA";
    const name = airport.name || "Nieznana nazwa";

    return `${airport.icao}/${iata} (${name})`;
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Brak tokena w localStorage");
        let payloadBase64 = token.split(".")[1];
        if (!payloadBase64) throw new Error("Niepoprawny token JWT");
        payloadBase64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
        const payloadJSON = atob(payloadBase64);
        const payload = JSON.parse(payloadJSON);
        const userID = payload.user_id;
        if (!userID) throw new Error("Brak userID w tokenie");

        //  const res = await fetch("https://api-flights.nexonstudio.pl/get-user-profile", {
        const res = await fetch("http://localhost:4040/get-user-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID }),
        });

        if (!res.ok) throw new Error("Błąd w pobieraniu danych");
        const data = await res.json();

        await new Promise((resolve) => setTimeout(resolve, 500));

        setProfile(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  function formatToYYYYMMDD(iso, { useUtc = true } = {}) {
    if (!iso && iso !== 0) return null;
    const date = iso instanceof Date ? iso : new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    const year = useUtc ? date.getUTCFullYear() : date.getFullYear();
    const month = (useUtc ? date.getUTCMonth() : date.getMonth()) + 1;
    const day = useUtc ? date.getUTCDate() : date.getDate();
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");

    return `${year}-${mm}-${dd}`;
  }

  const initials = `${profile?.surname[0]}${profile?.name[0]}`;

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
              <Title>Mój profil</Title>
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
        <FadeIn>
          <MyProfileContainer>
            <h2>Mój profil</h2>

            <ProfileCard>
              <AvatarWrapper>
                <Avatar>{initials}</Avatar>
                <LocationBadge>
                  <MapPin size={20} />
                </LocationBadge>
              </AvatarWrapper>

              <ProfileInfo>
                <UserName>
                  {profile.surname} {profile.name}
                </UserName>
                <UserDetails>{profile.role}</UserDetails>
                <HomeBase>
                  <MapPin size={18} />
                  Baza domowa: {getBaseAirport(profile.home_airport_icao)}
                </HomeBase>
              </ProfileInfo>
            </ProfileCard>
            <SectionTitle>Przegląd logbooka</SectionTitle>

            <StatsGrid>
              <StatCard>
                <StatHeader>
                  <Ticket size={18} />
                  Ilość odbytych lotów
                </StatHeader>
                <Divider />
                <FadeIn>
                  <StatValue>{profile?.flights_number} lotów</StatValue>
                  <StatSubtext>Tyle lotów odbyłeś do tej pory</StatSubtext>
                </FadeIn>
              </StatCard>

                 <StatCard>
                <StatHeader>
                  <Ticket size={18} />
                  Czas spędzony w powietrzu
                </StatHeader>
                <Divider />
                <FadeIn>
                  <StatValue>{profile?.total_hours}</StatValue>
                  <StatSubtext>Ilość godzin które łącznie spędziłeś w powietrzu</StatSubtext>
                </FadeIn>
              </StatCard>

          <StatCard>
                <StatHeader>
                  <Ticket size={18} />
                  Ostatni lot
                </StatHeader>
                <Divider />
                <FadeIn>
                  <StatValue>{formatToYYYYMMDD(profile?.last_flight)}</StatValue>
                  <StatSubtext>To właśnie tego dnia ostatni raz leciałeś samolotem</StatSubtext>
                </FadeIn>
              </StatCard>
            </StatsGrid>
            <SectionTitle>Ustawienia i bezpieczeństwo</SectionTitle>
            <SettingsSection />
          </MyProfileContainer>
        </FadeIn>
      </ContentWrapper>
    </MainWrapper>
  );
}
