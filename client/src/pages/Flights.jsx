import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar"; // Assuming NavBar is a separate component
import axios from "axios";
import moment from "moment";
import styled, { keyframes } from "styled-components";
import { Plane, Clock, CheckCircle, MapPin, Calendar } from "lucide-react";
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


//Nowe style

const FlightCardHeader = styled.div`
  display: flex;
  width: 80%;
  justify-content: space-between;
  align-items: center;
`
export const FlightCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin-bottom: 16px;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FlightCardDetailsColumn = styled.div`
  flex: 1 1 200px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FlightCardDetailsInformation = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #333;
`;
const FlightCardDetails = styled.div`
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  padding: 16px 0;
`;

export const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #e5e7eb;
`;

export const FlightDirection = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 8px;
`;

export const CardHeader = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
`;

export const InfoItem = styled.div`
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 6px;

  strong {
    color: #111;
  }
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
                  <FlightCardHeader>
                    <h2>{flight.fli_dest_air_icao}/{flight.fli_dest_air_iata} → {flight.fli_arr_air_icao}/{flight.fli_arr_air_iata}</h2>
                    <p>{flight.fli_number} - {flight.fli_airline}</p>
                  </FlightCardHeader>

                  <Divider />

                  <FlightCardDetails>
                    <FlightCardDetailsColumn>
                      <FlightCardDetailsInformation>
                        <Plane size={16} /> Linia lotnicza: {flight.fli_airline}
                      </FlightCardDetailsInformation>
                      <FlightCardDetailsInformation>
                        <MapPin size={16} /> Numer lotu: {flight.fli_number}
                      </FlightCardDetailsInformation>
                      <FlightCardDetailsInformation>
                        <Clock size={16} /> Czas trwania: {flight.fli_duration}
                      </FlightCardDetailsInformation>
                    </FlightCardDetailsColumn>

                    <FlightCardDetailsColumn>
                      <FlightCardDetailsInformation>
                        <Clock size={16} /> Odlot: {flight.fli_dep_time}
                      </FlightCardDetailsInformation>
                      <FlightCardDetailsInformation>
                        <Clock size={16} /> Przylot: {flight.fli_arr_time}
                      </FlightCardDetailsInformation>
                      <FlightCardDetailsInformation>
                        <Calendar size={16} /> Terminal: 1
                      </FlightCardDetailsInformation>
                    </FlightCardDetailsColumn>
                  </FlightCardDetails>

                  {/* 

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
                  )}*/}
                </FlightCard>
              </React.Fragment>
            ))}
          </FlightsList>
        )}
      </FlightsContent>
    </MainDiv>
  );
}
