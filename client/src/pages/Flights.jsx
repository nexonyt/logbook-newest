import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar"; // Assuming NavBar is a separate component
import axios from "axios";
import moment from "moment";
import styled, { keyframes } from "styled-components";

// --- Styled Components ---

const MainDiv = styled.div`
  background-color: white;
  display: flex;
  min-height: 100vh;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const FlightsContent = styled.div`
  animation: ${fadeIn} 0.3s ease-in-out;
  display: flex; 
  justify-content: center;
  align-items: flex-start; 
  min-height: 100vh;
  overflow: auto;
  width: 100%;
  box-sizing: border-box;
  padding: 2rem;
`;

const PageContainer = styled.div`
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const ContentWrapper = styled.main`
  flex-grow: 1;
  width: 100%;
  max-width: 800px; /* trochę węższe niż wcześniej */
  padding: 2rem 1rem;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 2.5rem;
  }

  @media (min-width: 1024px) {
    padding: 3rem;
  }
`;

// Zmienione: vertical list, jeden pod drugim
const FlightsList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// Karta lotu
const FlightCard = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 1rem; /* odstęp między kartami */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`;

// Powiększony kierunek na górze
const FlightDirection = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const CardHeader = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  color: #34495e;
  font-size: 1.4rem;
  text-align: center;
  word-break: break-word;
  line-height: 1.3;
`;

const InfoItem = styled.p`
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #555;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  line-height: 1.4;

  strong {
    color: #333;
    min-width: 110px;
    margin-right: 0.8rem;
    flex-shrink: 0;
  }
`;

// Separator między kartami (linia ---)
const Separator = styled.div`
  text-align: center;
  color: #999;
  font-size: 1.5rem;
  user-select: none;
  margin: 0.5rem 0;
`;

// Wiadomości typu loading/error itp.
const MessageContainer = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #6c757d;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;
`;

// --- Flights Component ---

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post("https://api-flights.nexonstudio.pl/getAllFlights", { userID: 1 });
        setFlights(response.data);
      } catch (err) {
        console.error("Błąd podczas pobierania lotów:", err);
        setError("Nie udało się załadować lotów. Spróbuj ponownie później.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  return (
    <MainDiv>
      <NavBar />
      <FlightsContent>
        {loading && (
          <MessageContainer>
            Ładowanie lotów...
          </MessageContainer>
        )}

        {error && (
          <MessageContainer style={{ color: "red", borderColor: "red" }}>
            {error}
          </MessageContainer>
        )}

        {!loading && !error && flights.length === 0 && (
          <MessageContainer>
            Brak dostępnych lotów.
          </MessageContainer>
        )}

        {!loading && !error && flights.length > 0 && (
          <FlightsList>
            {flights.map((flight, index) => (
              <React.Fragment key={flight.fli_number}>
                <FlightCard>
                  <FlightDirection>
                    {flight.fli_dest_air_iata} → {flight.fli_arr_air_iata}
                  </FlightDirection>
                  <CardHeader>
                    {flight.fli_number} – {flight.fli_airline}
                  </CardHeader>
                  <InfoItem>
                    <strong>Data wylotu:</strong> {moment(flight.fli_dep_time).format("YYYY-MM-DD HH:mm")}
                  </InfoItem>
                  <InfoItem>
                    <strong>Data przylotu:</strong> {moment(flight.fli_arr_time).format("YYYY-MM-DD HH:mm")}
                  </InfoItem>
                  <InfoItem>
                    <strong>Typ samolotu:</strong> {flight.fli_aircraft_type}
                  </InfoItem>
                  <InfoItem>
                    <strong>Numer samolotu:</strong> {flight.fli_aircraft}
                  </InfoItem>
                  <InfoItem>
                    <strong>Czas trwania:</strong> {flight.fli_duration}
                  </InfoItem>
                  <InfoItem>
                    <strong>Opóźnienie:</strong> {flight.fli_delay}
                  </InfoItem>
                  {flight.fli_seat && (
                    <InfoItem>
                      <strong>Miejsce:</strong> {flight.fli_seat}
                    </InfoItem>
                  )}
                  {flight.notes && (
                    <InfoItem>
                      <strong>Notatka:</strong> {flight.notes}
                    </InfoItem>
                  )}
                </FlightCard>
                {index < flights.length - 1 && <Separator>---</Separator>}
              </React.Fragment>
            ))}
          </FlightsList>
        )}
      </FlightsContent>
    </MainDiv>
  );
}
