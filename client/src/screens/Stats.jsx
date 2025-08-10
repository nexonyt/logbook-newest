import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import NavBar from "../components/Navbar";

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
  &:last-child { border-bottom: none; }
`;

const Label = styled.span`
  font-weight: 600;
  color: #333;
`;

const Value = styled.span`
  color: #555;
  font-family: monospace;
`;

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://api-flights.nexonstudio.pl/getflightdurationsum", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: 1 }),
        });
        if (!res.ok) throw new Error("Błąd w pobieraniu danych");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <MainWrapper>
        <NavBar />
        <ContentWrapper>
          <FlightsContent>
            <StatsContainer>
              <Title>Statystyki</Title>
              <p>Ładowanie danych...</p>
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
        <FlightsContent>
          <StatsContainer>
            <Title>Statystyki lotów</Title>

            {/* Najdłuższy lot */}
            <Section>
              <SectionTitle>Najdłuższy lot</SectionTitle>
              <p>
                <Label>Czas trwania: </Label>
                <Value>{stats.longest_flight[0]?.max_duration || "brak danych"}</Value>
              </p>
            </Section>

            {/* Największe opóźnienie */}
            <Section>
              <SectionTitle>Największe opóźnienie</SectionTitle>
              {stats.max_delay[0] ? (
                <>
                  <p><Label>Numer lotu:</Label> <Value>{stats.max_delay[0].fli_number}</Value></p>
                  <p><Label>Linia lotnicza:</Label> <Value>{stats.max_delay[0].max_delay}</Value></p>
                  <p><Label>Opóźnienie:</Label> <Value>{stats.max_delay[0].fli_delay}</Value></p>
                  <p><Label>Lotnisko wylotu (ICAO/IATA):</Label> <Value>{stats.max_delay[0].fli_dest_air_icao} / {stats.max_delay[0].fli_dest_air_iata}</Value></p>
                  <p><Label>Lotnisko przylotu (ICAO/IATA):</Label> <Value>{stats.max_delay[0].fli_arr_air_icao} / {stats.max_delay[0].fli_arr_air_iata}</Value></p>
                </>
              ) : (
                <p>Brak danych</p>
              )}
            </Section>

            {/* Najczęściej wybierana linia */}
            <Section>
              <SectionTitle>Najczęściej wybierana linia lotnicza</SectionTitle>
              {stats.most_chosen_airline[0] ? (
                <p>
                  <Label>Linia:</Label> <Value>{stats.most_chosen_airline[0].fli_airline}</Value> -{" "}
                  <Value>{stats.most_chosen_airline[0].count} lotów</Value>
                </p>
              ) : <p>Brak danych</p>}
            </Section>

            {/* Najczęstsze lotnisko wylotu */}
            <Section>
              <SectionTitle>Najczęstsze lotnisko wylotu</SectionTitle>
              <List>
                {stats.most_frequent_departure_airport.map((airport, i) => (
                  <ListItem key={i}>
                    <Label>{airport.fli_dest_air_icao} / {airport.fli_dest_air_iata}</Label>
                    <Value>{airport.count} lotów</Value>
                  </ListItem>
                ))}
              </List>
            </Section>

            {/* Linia z najmniejszym opóźnieniem */}
            <Section>
              <SectionTitle>Linia z najmniejszym opóźnieniem</SectionTitle>
              {stats.least_delay_airline[0] ? (
                <p>
                  <Label>Linia:</Label> <Value>{stats.least_delay_airline[0].fli_airline}</Value> -{" "}
                  <Value>{stats.least_delay_airline[0].avg_delay} minut</Value>
                </p>
              ) : <p>Brak danych</p>}
            </Section>

            {/* Najczęstszy cel lotu */}
            <Section>
              <SectionTitle>Najczęstszy cel lotu</SectionTitle>
              {stats.most_frequent_destination[0] ? (
                <p>
                  <Label>Lotnisko:</Label> <Value>{stats.most_frequent_destination[0].count || stats.most_frequent_destination[0].fli_arr_air_iata}</Value>
                </p>
              ) : <p>Brak danych</p>}
            </Section>

            {/* Najczęściej używany samolot */}
            <Section>
              <SectionTitle>Najczęściej używany samolot</SectionTitle>
              {stats.most_flight_aircraft[0] ? (
                <p>
                  <Label>Samolot:</Label> <Value>{stats.most_flight_aircraft[0].aircraft}</Value> -{" "}
                  <Value>{stats.most_flight_aircraft[0].number_of_flights} lotów</Value>
                </p>
              ) : <p>Brak danych</p>}
            </Section>

            {/* Suma czasu lotów */}
            <Section>
              <SectionTitle>Suma czasu lotów</SectionTitle>
              <p>
                <Label>Łączny czas:</Label> <Value>{stats.sum_time_of_flights[0]?.total_duration || "brak danych"}</Value>
              </p>
            </Section>

          </StatsContainer>
        </FlightsContent>
      </ContentWrapper>
    </MainWrapper>
  );
}
