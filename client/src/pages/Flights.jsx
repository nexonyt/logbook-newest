import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import axios from "axios";
import moment from "moment";
import styled, { keyframes } from "styled-components";
import { Plane, Clock, CheckCircle, MapPin, Calendar, Info, X, ArrowLeft } from "lucide-react";
import FadeIn from "react-fade-in";
import CircularProgress from "@mui/material/CircularProgress";

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Brak tokena w localStorage");
        let payloadBase64 = token.split(".")[1];
        if (!payloadBase64) throw new Error("Niepoprawny token JWT");
        payloadBase64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(payloadBase64));
        const userID = payload.user_id;
        if (!userID) throw new Error("Brak userID w tokenie");

        const response = await axios.post("http://localhost:4040/getAllFlights", { userID });
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

  if (selectedFlight) {
    return (
      <MainDiv>
        <NavBar />
        <FlightsContent>
          <DetailViewContainer>
            <BackButton onClick={() => setSelectedFlight(null)}>
              <ArrowLeft size={16} /> Powrót do listy lotów
            </BackButton>

            <FullPageBoardingPass>
              <FullPagePassHeader>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Plane size={24} style={{ transform: "rotate(45deg)", color: "#60a5fa" }} />
                  <div>
                    <span style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "0.05em", display: "block" }}>KARTA PODSUMOWANIA LOTU</span>
                    <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>SZCZEGÓŁOWY LOGBOOK PILOTA</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, display: "block", color: "#60a5fa" }}>{selectedFlight.fli_number}</span>
                  <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>{selectedFlight.fli_airline}</span>
                </div>
              </FullPagePassHeader>
              
              <FullPagePassBody>
                <FullPageAirportRow>
                  <AirportCode>
                    <span className="code">{selectedFlight.fli_dest_air_iata || "---"}</span>
                    <span className="name">{selectedFlight.fli_dest_air_icao || "---"}</span>
                  </AirportCode>
                  <FlightPathLine>
                    <Plane size={24} style={{ transform: "rotate(90deg)" }} />
                  </FlightPathLine>
                  <AirportCode align="flex-end">
                    <span className="code">{selectedFlight.fli_arr_air_iata || "---"}</span>
                    <span className="name">{selectedFlight.fli_arr_air_icao || "---"}</span>
                  </AirportCode>
                </FullPageAirportRow>

                <FullPageDetailsGrid>
                  <DetailItem>
                    <span className="label">Linia lotnicza</span>
                    <span className="val">{selectedFlight.fli_airline}</span>
                  </DetailItem>
                  <DetailItem>
                    <span className="label">Numer lotu</span>
                    <span className="val">{selectedFlight.fli_number}</span>
                  </DetailItem>
                  <DetailItem>
                    <span className="label">Odlot (IATA / ICAO)</span>
                    <span className="val">
                      {selectedFlight.fli_dest_air_iata || "---"} / {selectedFlight.fli_dest_air_icao || "---"}
                    </span>
                  </DetailItem>
                  <DetailItem>
                    <span className="label">Przylot (IATA / ICAO)</span>
                    <span className="val">
                      {selectedFlight.fli_arr_air_iata || "---"} / {selectedFlight.fli_arr_air_icao || "---"}
                    </span>
                  </DetailItem>
                  <DetailItem>
                    <span className="label">Czas odlotu</span>
                    <span className="val">{moment(selectedFlight.fli_dep_time).format("YYYY-MM-DD HH:mm")}</span>
                  </DetailItem>
                  <DetailItem>
                    <span className="label">Czas przylotu</span>
                    <span className="val">{moment(selectedFlight.fli_arr_time).format("YYYY-MM-DD HH:mm")}</span>
                  </DetailItem>
                  <DetailItem>
                    <span className="label">Typ maszyny</span>
                    <span className="val">{selectedFlight.fli_aircraft_type || "Brak danych"}</span>
                  </DetailItem>
                  <DetailItem>
                    <span className="label">Samolot (Reg)</span>
                    <span className="val">{selectedFlight.fli_aircraft || "Brak danych"}</span>
                  </DetailItem>
                  <DetailItem>
                    <span className="label">Miejsce (Seat)</span>
                    <span className="val">{selectedFlight.fli_seat || "Brak danych"}</span>
                  </DetailItem>
                  <DetailItem>
                    <span className="label">Czas lotu</span>
                    <span className="val">{selectedFlight.fli_duration || "0:00"}</span>
                  </DetailItem>
                  <DetailItem>
                    <span className="label">Opóźnienie</span>
                    <span className="val" style={{ color: selectedFlight.fli_delay && selectedFlight.fli_delay !== "0:00" ? "#ef4444" : "inherit" }}>
                      {selectedFlight.fli_delay || "Brak"}
                    </span>
                  </DetailItem>
                  <DetailItem>
                    <span className="label">Status rejsu</span>
                    <span className="val" style={{ color: "#10b981", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <CheckCircle size={14} /> Wylądował
                    </span>
                  </DetailItem>
                </FullPageDetailsGrid>

                {selectedFlight.notes && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Uwagi i komentarze pilota</span>
                    <NotesBlock>{selectedFlight.notes}</NotesBlock>
                  </div>
                )}
              </FullPagePassBody>
            </FullPageBoardingPass>
          </DetailViewContainer>
        </FlightsContent>
      </MainDiv>
    );
  }

  return (
    <MainDiv>
      <NavBar />
      <FlightsContent>
        <div style={{ width: "100%", maxWidth: "1200px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Dziennik Lotów</h1>
              <p style={{ color: "#64748b", margin: "0.25rem 0 0 0", fontSize: "0.95rem" }}>Wszystkie Twoje zarejestrowane loty</p>
            </div>
          </div>

          {loading && (
            <MessageContainer>
              <CircularProgress size={30} style={{ marginBottom: "1rem" }} />
              <div>Wczytywanie wpisów dziennika...</div>
            </MessageContainer>
          )}

          {error && (
            <MessageContainer style={{ color: "#ef4444", borderColor: "#fecaca", background: "#fef2f2" }}>
              {error}
            </MessageContainer>
          )}

          {!loading && !error && flights.length === 0 && (
            <MessageContainer>
              Brak lotów w Twoim logbooku. Kliknij "Dodaj lot", aby zapisać pierwszy lot!
            </MessageContainer>
          )}

          {!loading && !error && flights.length > 0 && (
            <FadeIn>
              <TableContainer>
                <FlightTable>
                  <TableHeader>
                    <tr>
                      <th>Data</th>
                      <th>Lot</th>
                      <th>Trasa</th>
                      <th>Linia</th>
                      <th>Samolot</th>
                      <th>Czas</th>
                      <th>Szczegóły</th>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {flights.map((flight, idx) => (
                      <tr key={idx}>
                        <td data-label="Data">
                          {moment(flight.fli_dep_time).format("YYYY-MM-DD")}
                        </td>
                        <td data-label="Lot" style={{ fontWeight: 700 }}>
                          {flight.fli_number}
                        </td>
                        <td data-label="Trasa">
                          <span style={{ fontWeight: 600 }}>
                            {flight.fli_dest_air_iata || flight.fli_dest_air_icao}
                          </span>
                          <span style={{ color: "#94a3b8", margin: "0 0.4rem" }}>→</span>
                          <span style={{ fontWeight: 600 }}>
                            {flight.fli_arr_air_iata || flight.fli_arr_air_icao}
                          </span>
                        </td>
                        <td data-label="Linia">{flight.fli_airline}</td>
                        <td data-label="Samolot">
                          {flight.fli_aircraft_type || flight.fli_aircraft || "Brak"}
                        </td>
                        <td data-label="Czas">{flight.fli_duration || "0:00"}</td>
                        <td data-label="Szczegóły">
                          <ActionButton onClick={() => setSelectedFlight(flight)}>
                            <Info size={14} /> Zobacz
                          </ActionButton>
                        </td>
                      </tr>
                    ))}
                  </TableBody>
                </FlightTable>
              </TableContainer>
            </FadeIn>
          )}
        </div>
      </FlightsContent>
    </MainDiv>
  );
}

// --- Styled Components ---

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MainDiv = styled.div`
  background-color: #f8fafc;
  display: flex;
  min-height: 100vh;
`;

const FlightsContent = styled.div`
  animation: ${fadeIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex; 
  justify-content: center;
  align-items: flex-start; 
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  padding: 3rem 1.5rem;
`;

const MessageContainer = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1rem;
  color: #6c757d;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  border: 1px solid #e2e8f0;
  margin-top: 2rem;
`;

const TableContainer = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  margin-top: 1.5rem;
`;

const FlightTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    display: block;
    thead {
      display: none;
    }
    tbody, tr, td {
      display: block;
      width: 100%;
    }
    tr {
      border-bottom: 8px solid #f1f5f9;
      padding: 1.25rem 1rem;
      box-sizing: border-box;
    }
    td {
      border: none;
      padding: 0.5rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: right;
      
      &::before {
        content: attr(data-label);
        font-weight: 700;
        color: #64748b;
        text-align: left;
        margin-right: 1rem;
      }
    }
  }
`;

const TableHeader = styled.thead`
  background-color: #f8fafc;
  border-bottom: 2px solid #e2e8f0;

  th {
    padding: 1rem 1.25rem;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #f1f5f9;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f8fafc;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 1rem 1.25rem;
    color: #1e293b;
    vertical-align: middle;
  }
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #f1f5f9;
  border: none;
  color: #2563eb;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #2563eb;
    color: #ffffff;
  }
`;

// Full Page Flight Details View Styled Components

const DetailViewContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  animation: ${fadeIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
  }
`;

const FullPageBoardingPass = styled.div`
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const FullPagePassHeader = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #ffffff;
  padding: 2rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: repeating-linear-gradient(90deg, #3b82f6, #3b82f6 15px, transparent 15px, transparent 30px);
  }

  @media (max-width: 600px) {
    padding: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const FullPagePassBody = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: #ffffff;

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
`;

const FullPageAirportRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }
`;

const AirportCode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.align || 'flex-start'};

  .code {
    font-size: 3rem;
    font-weight: 900;
    color: #0f172a;
    line-height: 1;
  }

  .name {
    font-size: 1rem;
    font-weight: 600;
    color: #64748b;
    margin-top: 0.25rem;
    letter-spacing: 0.05em;
  }

  @media (max-width: 600px) {
    align-items: center;
  }
`;

const FlightPathLine = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 2rem;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    border-top: 2px dashed #cbd5e1;
    top: 50%;
  }

  svg {
    color: #2563eb;
    background: #ffffff;
    padding: 0 1rem;
    z-index: 5;
  }

  @media (max-width: 600px) {
    width: 100%;
    margin: 0.5rem 0;
  }
`;

const FullPageDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  background: #f8fafc;
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid #f1f5f9;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;

  span.label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    margin-bottom: 0.25rem;
  }

  span.val {
    font-size: 1rem;
    font-weight: 600;
    color: #334155;
  }
`;

const NotesBlock = styled.div`
  background: #fffbeb;
  border: 1px dashed #fef3c7;
  padding: 1.5rem;
  border-radius: 12px;
  color: #78350f;
  font-size: 0.95rem;
  line-height: 1.5;
`;

