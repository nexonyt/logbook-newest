import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NavBar from "../components/Navbar";
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
  Globe,
} from "lucide-react";

// const MyCustomLoader = () => (
//   <ContentLoader
//     width="100%"
//     height={80}
//     viewBox="0 0 380 80"
//     backgroundColor="#f3f3f3"
//     foregroundColor="#ecebeb"
//   >
//     <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
//   </ContentLoader>
// );

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

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;

  @media screen and (max-width: 800px) {
    gap: 0.2rem;
  }
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;

  @media screen and (max-width: 800px) {
    gap: 1rem;
  }
`;

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

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Brak tokena w localStorage");
        let payloadBase64 = token.split(".")[1];
        if (!payloadBase64) throw new Error("Niepoprawny token JWT");
        payloadBase64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(payloadBase64));
        const userID = payload.user_id;
        if (!userID) throw new Error("Brak userID w tokenie");

        const res = await fetch(
          "http://localhost:4040/getflightdurationsum",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userID }),
          }
        );
        if (!res.ok) throw new Error("Błąd w pobieraniu danych");
        const data = await res.json();

        await new Promise((resolve) => setTimeout(resolve, 500));

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
    if (!delay) return "0h 0m";
    const parts = delay.split(":");
    if (parts.length < 2) return delay;
    const [hours, minutes] = parts;
    return `${parseInt(hours, 10)}h ${minutes}m`;
  }

  if (loading)
    return (
      <MainWrapper>
        <NavBar />
        <ContentWrapper>
          <FadeIn>
            <DashboardContainer>
              <h2>Podsumowanie</h2>
              <SummaryGrid>
                <StatCard>
                  <StatHeader>
                    <Clock5 size={18} />
                    Całkowity czas lotów
                  </StatHeader>
                  <Divider />
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                  >
                    <CircularProgress color="inherit" />
                  </Box>
                </StatCard>
                <StatCard>
                  <StatHeader>
                    <Ticket size={18} />
                    Najczęściej wybierana linia
                  </StatHeader>
                  <Divider />
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                  >
                    <CircularProgress color="inherit" />
                  </Box>
                </StatCard>
                <StatCard>
                  <StatHeader>
                    <MapPinHouse size={18} />
                    Najdłuższy lot
                  </StatHeader>
                  <Divider />

                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                  >
                    <CircularProgress color="inherit" />
                  </Box>
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
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                  >
                    <CircularProgress color="inherit" />
                  </Box>
                </StatCard>
                <StatCard>
                  <StatHeader>
                    <MapPin size={18} />
                    Najczęstszy cel podróży
                  </StatHeader>
                  <Divider />
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                  >
                    <CircularProgress color="inherit" />
                  </Box>
                </StatCard>
                <StatCard>
                  <StatHeader>
                    <AlarmClockOff size={18} />
                    Największe opóźnienie lotu
                  </StatHeader>
                  <Divider />
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                  >
                    <CircularProgress color="inherit" />
                  </Box>
                </StatCard>
                <StatCard>
                  <StatHeader>
                    <Hourglass size={18} />
                    Najmniej opóźnień
                  </StatHeader>
                  <Divider />
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                  >
                    <CircularProgress color="inherit" />
                  </Box>
                </StatCard>
                <StatCard>
                  <StatHeader>
                    <Plane size={18} />
                    Najwięcej latałeś samolotem
                  </StatHeader>
                  <Divider />
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                  >
                    <CircularProgress color="inherit" />
                  </Box>
                </StatCard>
              </StatsGrid>
            </DashboardContainer>
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
        <DashboardContainer>
          <h2>Podsumowanie</h2>
          <SummaryGrid>
            <StatCard>
              <StatHeader>
                <Clock5 size={18} />
                Całkowity czas lotów
              </StatHeader>
              <Divider />
              <FadeIn>
                <StatValue>
                  {stats.sum_time_of_flights?.[0]?.total_duration || "0h 0m"}
                </StatValue>
                <StatSubtext>
                  Tyle czasu swojego życia spędziłeś w samolocie
                </StatSubtext>
              </FadeIn>
            </StatCard>
            <StatCard>
              <StatHeader>
                <Ticket size={18} />
                Najczęściej wybierana linia
              </StatHeader>
              <Divider />
              <FadeIn>
                <StatValue>
                  {stats.most_chosen_airline?.[0]?.fli_airline || "Brak"}
                </StatValue>
                <StatSubtext>
                  Leciałeś tą linią ponad{" "}
                  <BoldedText>{stats.most_chosen_airline?.[0]?.count || 0}</BoldedText>{" "}
                  razy{" "}
                </StatSubtext>
              </FadeIn>
            </StatCard>
            <StatCard>
              <StatHeader>
                <MapPinHouse size={18} />
                Najdłuższy lot
              </StatHeader>
              <Divider />
              <FadeIn>
                <StatValue>
                  {formatDate(stats.longest_flight?.[0]?.max_duration)}
                </StatValue>
                <StatSubtext>
                  {stats.longest_flight?.[0]?.fli_dest_air_icao ? (
                    <span>
                      Na trasie{" "}
                      <BoldedText>
                        {stats.longest_flight[0].fli_dest_air_icao}/
                        {stats.longest_flight[0].fli_dest_air_iata} -{" "}
                        {stats.longest_flight[0].fli_arr_air_icao}/
                        {stats.longest_flight[0].fli_arr_air_iata}
                      </BoldedText>{" "}
                      linią {stats.longest_flight[0].fli_airline}
                    </span>
                  ) : (
                    "Brak danych"
                  )}
                </StatSubtext>
              </FadeIn>
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
                {stats.most_frequent_departure_airport?.[0] ? (
                  <>
                    <StatValue>
                      {stats.most_frequent_departure_airport[0].fli_dest_air_icao} / {stats.most_frequent_departure_airport[0].fli_dest_air_iata}
                    </StatValue>
                    <StatSubtext>
                      {stats.most_frequent_departure_airport[0].count} lotów
                    </StatSubtext>
                  </>
                ) : (
                  <>
                    <StatValue>Brak</StatValue>
                    <StatSubtext>Brak danych</StatSubtext>
                  </>
                )}
              </FadeIn>
            </StatCard>
            <StatCard>
              <StatHeader>
                <MapPin size={18} />
                Najczęstszy cel podróży
              </StatHeader>
              <Divider />
              <FadeIn>
                <StatValue>
                  {stats.most_frequent_destination?.[0]
                    ? `${stats.most_frequent_destination[0].fli_arr_air_icao}/${stats.most_frequent_destination[0].fli_arr_air_iata}`
                    : "Brak"}
                </StatValue>
                <StatSubtext>
                  Poleciałeś do tego miejsca, aż{" "}
                  <BoldedText>
                    {stats.most_frequent_destination?.[0]?.count || 0}
                  </BoldedText>{" "}
                  razy
                </StatSubtext>
              </FadeIn>
            </StatCard>
            <StatCard>
              <StatHeader>
                <AlarmClockOff size={18} />
                Największe opóźnienie lotu
              </StatHeader>
              <Divider />
              <FadeIn>
                <StatValue>
                  {stats.max_delay?.[0]
                    ? `${formatDate(stats.max_delay[0].fli_delay)} - ${stats.max_delay[0].max_delay || ""}`
                    : "Brak"}
                </StatValue>
                <StatSubtext>
                  {stats.max_delay?.[0] ? (
                    `${stats.max_delay[0].fli_dest_air_icao || ""}/${stats.max_delay[0].fli_dest_air_iata || ""} - ${stats.max_delay[0].fli_arr_air_icao || ""}/${stats.max_delay[0].fli_arr_air_iata || ""}`
                  ) : (
                    "Brak opóźnień"
                  )}
                </StatSubtext>
              </FadeIn>
            </StatCard>
            <StatCard>
              <StatHeader>
                <Hourglass size={18} />
                Najmniej opóźnień
              </StatHeader>
              <Divider />
              <FadeIn>
                <StatValue>
                  {stats.least_delay_airline?.[0]?.fli_airline || "Brak"}
                </StatValue>
                <StatSubtext>
                  {stats.least_delay_airline?.[0]?.avg_delay != null
                    ? `${stats.least_delay_airline[0].avg_delay}h`
                    : "Brak danych"}
                </StatSubtext>
              </FadeIn>
            </StatCard>
            <StatCard>
              <StatHeader>
                <Plane size={18} />
                Najwięcej latałeś samolotem
              </StatHeader>
              <Divider />
              <FadeIn>
                <StatValue>
                  {stats.most_flight_aircraft?.[0]?.aircraft || "Brak"}
                </StatValue>
                <StatSubtext>
                  {stats.most_flight_aircraft?.[0]?.number_of_flights || 0} razy
                </StatSubtext>
              </FadeIn>
            </StatCard>
          </StatsGrid>
          <FadeIn>
            <UniqueAirports stats={stats} />
          </FadeIn>
        </DashboardContainer>
      </ContentWrapper>
    </MainWrapper>
  );
}
