import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import NavBar from "../components/Navbar";
import ContentLoader from "react-content-loader";
import FadeIn from "react-fade-in";
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

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const FlightsContent = styled.div`
  animation: ${fadeIn} 0.3s ease-in-out;
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

const Section = styled.section`
  background: #fff;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgb(0 0 0 / 0.05);
  border-left: 6px solid #da4453;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  color: #89216b;
  font-weight: 600;
  font-size: 1.5rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.3rem;
`;

const List = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin: 0;
`;

const ListItem = styled.li`
  padding: 0.35rem 0;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: #333;
`;

const Value = styled.span`
  color: #555;
  font-family: monospace;
`;

// NOWE

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
`;

// Grid dla podsumowania (3 karty obok siebie)
export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

// Grid dla szczegółowych statystyk (np. 3 kolumny)
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
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

export default function Stats() {
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
          <FlightsContent>
            <StatsContainer>
              <Title>Statystyki</Title>
              <MyCustomLoader />
              <MyCustomLoader />
              <MyCustomLoader />
            </StatsContainer>
          </FlightsContent>
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
        <DashboardContainer>
          <h2>Podsumowanie</h2>
          <SummaryGrid>
            <StatCard>
              <StatHeader>
                <Clock5 size={18} />
                Całkowity czas lotów
              </StatHeader>
              <Divider />
              <StatValue>
                {stats.sum_time_of_flights[0].total_duration}
              </StatValue>
              <StatSubtext>
                Tyle czasu swojego życia spędziłęś w samolocie
              </StatSubtext>
            </StatCard>
            <StatCard>
              <StatHeader>
                <Ticket size={18} />
                Najczęściej wybierana linia
              </StatHeader>
              <Divider />
              <StatValue>{stats.most_chosen_airline[0].fli_airline}</StatValue>
              <StatSubtext>
                Leciałeś tą linią ponad{" "}
                <BoldedText>{stats.most_chosen_airline[0].count}</BoldedText>{" "}
                razy{" "}
              </StatSubtext>
            </StatCard>
            <StatCard>
              <StatHeader>
                <MapPinHouse size={18} />
                Najdłuższy lot
              </StatHeader>
              <Divider />
              <StatValue>
                {formatDate(stats.longest_flight[0].max_duration)}
              </StatValue>
              <StatSubtext>TO DO - destynacja</StatSubtext>
            </StatCard>
          </SummaryGrid>

          <h2>Szczegółowe statystyki</h2>
          <StatsGrid>
            <StatCard>
              <StatHeader>
                <AlertTriangle size={18} />
                Najczęstsze lotnisko wylotu
              </StatHeader>
              <Divider />
              <FadeIn>
                <StatValue>EPPO / POZ</StatValue>
                <StatSubtext>13 lotów</StatSubtext>
              </FadeIn>
            </StatCard>
            <StatCard>
              <StatHeader>
                <MapPin size={18} />
                Najczęstszy cel podróży
              </StatHeader>
              <Divider />
              <StatValue>
                {stats.most_frequent_destination[0].fli_arr_air_icao}/
                {stats.most_frequent_destination[0].fli_arr_air_iata}
              </StatValue>
              <StatSubtext>
                Poleciałeś do tego miejsca, aż{" "}
                <BoldedText>
                  {stats.most_frequent_destination[0].count}
                </BoldedText>{" "}
                razy
              </StatSubtext>
            </StatCard>
            <StatCard>
              <StatHeader>
                <AlarmClockOff size={18} />
                Największe opóźnienie lotu
              </StatHeader>
              <Divider />
              <StatValue>
                {formatDate(stats.max_delay[0].fli_delay)} -{" "}
                {stats.max_delay[0].max_delay}
              </StatValue>
              <StatSubtext>
                {stats.max_delay[0].fli_dest_air_icao +
                  "/" +
                  stats.max_delay[0].fli_dest_air_iata}{" "}
                -{" "}
                {stats.max_delay[0].fli_arr_air_icao +
                  "/" +
                  stats.max_delay[0].fli_arr_air_iata}{" "}
              </StatSubtext>
            </StatCard>
            <StatCard>
              <StatHeader>
                <Hourglass size={18} />
                Najmniej opóźnień
              </StatHeader>
              <Divider />
              <FadeIn>
              <StatValue>{stats.least_delay_airline[0].fli_airline}</StatValue>
              <StatSubtext>
                {stats.least_delay_airline[0].avg_delay}h
              </StatSubtext>
              </FadeIn>
            </StatCard>
            <StatCard>
              <StatHeader>
                <Plane size={18} />
                Najwięcej latałeś samolotem
              </StatHeader>
              <Divider />
              <StatValue>{stats.most_flight_aircraft[0].aircraft}</StatValue>
              <StatSubtext>
                {stats.most_flight_aircraft[0].number_of_flights} razy
              </StatSubtext>
            </StatCard>
          </StatsGrid>
        </DashboardContainer>
      </ContentWrapper>
    </MainWrapper>
  );
}
