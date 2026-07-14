import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import axios from "axios";
import moment from "moment";
import styled, { keyframes } from "styled-components";
import { Plane, Clock, CheckCircle, MapPin, Calendar, Info, X, ArrowLeft, Armchair } from "lucide-react";
import FadeIn from "react-fade-in";
import CircularProgress from "@mui/material/CircularProgress";
import airports from "../data/airports.json";

// Leaflet imports
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// SVG Armchair Icon Helper
const ArmchairIcon = ({ selected }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={selected ? "#ffffff" : "#64748b"} stroke={selected ? "#2563eb" : "#94a3b8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
    <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
    <path d="M6 18v2" />
    <path d="M18 18v2" />
  </svg>
);

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

  const renderSeatMap = () => {
    const seat = selectedFlight?.fli_seat;
    if (!seat) {
      return (
        <CabinContainer>
          <CabinTitle><Armchair size={18} /> Układ miejsc w kabinie</CabinTitle>
          <div style={{ padding: "2rem", background: "#f8fafc", borderRadius: "16px", color: "#64748b", textAlign: "center", border: "1px dashed #e2e8f0" }}>
            Brak zdefiniowanego miejsca dla tego lotu.
          </div>
        </CabinContainer>
      );
    }
    
    const seatMatch = seat.match(/^(\d+)([A-F])$/i);
    let rowNum = 12;
    let seatLetter = 'A';
    
    if (seatMatch) {
      rowNum = parseInt(seatMatch[1], 10);
      seatLetter = seatMatch[2].toUpperCase();
    } else {
      const digits = seat.match(/\d+/);
      const letters = seat.match(/[A-F]/i);
      if (digits) rowNum = parseInt(digits[0], 10);
      if (letters) seatLetter = letters[0].toUpperCase();
    }

    const rows = [];
    for (let r = rowNum - 2; r <= rowNum + 2; r++) {
      if (r > 0 && r < 40) {
        rows.push(r);
      }
    }
    if (rows.length === 0) rows.push(rowNum);

    const cols = ['A', 'B', 'C', 'AISLE', 'D', 'E', 'F'];

    return (
      <CabinContainer>
        <CabinTitle><Armchair size={18} /> Wizualizacja kabiny (rząd {rowNum})</CabinTitle>
        <SeatGrid>
          {/* Header letters */}
          <SeatRow>
            <RowLabel></RowLabel>
            {cols.map((c, idx) => {
              if (c === 'AISLE') return <AisleSpace key={idx} />;
              return <SeatHeaderLabel key={idx}>{c}</SeatHeaderLabel>;
            })}
          </SeatRow>

          {/* Rows */}
          {rows.map((r) => (
            <SeatRow key={r}>
              <RowLabel>{r}</RowLabel>
              {cols.map((c, idx) => {
                if (c === 'AISLE') return <AisleLabel key={idx}>Aisle</AisleLabel>;
                const isSelected = r === rowNum && c === seatLetter;
                return (
                  <SeatButton
                    key={idx}
                    selected={isSelected}
                    title={`Rząd ${r}, Miejsce ${c}`}
                  >
                    <ArmchairIcon selected={isSelected} />
                  </SeatButton>
                );
              })}
            </SeatRow>
          ))}
        </SeatGrid>
        <CabinLegend>
          <LegendItem><LegendIndicator color="#dbeafe" border="#2563eb" /> Twoje miejsce ({seat})</LegendItem>
          <LegendItem><LegendIndicator color="#f1f5f9" border="#cbd5e1" /> Wolne miejsce</LegendItem>
        </CabinLegend>
      </CabinContainer>
    );
  };

  const renderFlightMap = () => {
    const depAirport = airports[selectedFlight?.fli_dest_air_icao];
    const arrAirport = airports[selectedFlight?.fli_arr_air_icao];

    const depLat = depAirport?.lat;
    const depLon = depAirport?.lon;
    const arrLat = arrAirport?.lat;
    const arrLon = arrAirport?.lon;

    const hasMapCoords = depLat != null && depLon != null && arrLat != null && arrLon != null;
    const centerLat = hasMapCoords ? (depLat + arrLat) / 2 : 52.0;
    const centerLon = hasMapCoords ? (depLon + arrLon) / 2 : 19.0;

    return (
      <MapWrapper>
        <h3><MapPin size={18} /> Mapa trasy lotu</h3>
        {hasMapCoords ? (
          <div style={{ height: "300px", width: "100%", borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <MapContainer center={[centerLat, centerLon]} zoom={4} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <CircleMarker center={[depLat, depLon]} radius={8} pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.8, weight: 2 }}>
                <Popup>
                  <strong>Odlot:</strong> {selectedFlight.fli_dest_air_iata || selectedFlight.fli_dest_air_icao}<br />
                  {depAirport.name}
                </Popup>
              </CircleMarker>
              <CircleMarker center={[arrLat, arrLon]} radius={8} pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.8, weight: 2 }}>
                <Popup>
                  <strong>Przylot:</strong> {selectedFlight.fli_arr_air_iata || selectedFlight.fli_arr_air_icao}<br />
                  {arrAirport.name}
                </Popup>
              </CircleMarker>
              <Polyline positions={[[depLat, depLon], [arrLat, arrLon]]} pathOptions={{ color: '#6366f1', weight: 3, dashArray: '6, 8' }} />
            </MapContainer>
          </div>
        ) : (
          <div style={{ padding: "3.5rem 1.5rem", background: "#f8fafc", borderRadius: "16px", color: "#64748b", textAlign: "center", border: "1px dashed #e2e8f0" }}>
            Nie można wyświetlić trasy lotu – brak współrzędnych GPS dla lotnisk w bazie danych.
          </div>
        )}
      </MapWrapper>
    );
  };

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
                <HeaderTitleBlock>
                  <Plane size={24} style={{ transform: "rotate(45deg)", color: "#60a5fa" }} />
                  <div>
                    <HeaderTitle>KARTA PODSUMOWANIA LOTU</HeaderTitle>
                    <HeaderSubtitle>SZCZEGÓŁOWY LOGBOOK PILOTA</HeaderSubtitle>
                  </div>
                </HeaderTitleBlock>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, display: "block", color: "#60a5fa" }}>{selectedFlight.fli_number}</span>
                  <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>{selectedFlight.fli_airline}</span>
                </div>
              </FullPagePassHeader>
              
              <FullPagePassBody>
                <SplitLayout>
                  <LeftColumn>
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
                  </LeftColumn>

                  <RightColumn>
                    {renderFlightMap()}
                    {renderSeatMap()}
                  </RightColumn>
                </SplitLayout>
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
        <div style={{ width: "100%", maxWidth: "100%" }}>
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

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
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

  @media (max-width: 768px) {
    background: transparent;
    border: none;
    box-shadow: none;
    overflow: visible;
    margin-top: 1rem;
  }
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
    tbody {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: transparent;
    }
    tr {
      display: block;
      width: 100%;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
      padding: 1.25rem 1rem;
      box-sizing: border-box;
      transition: transform 0.2s ease;
      
      &:hover {
        transform: translateY(-2px);
      }
    }
    td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: none;
      padding: 0.6rem 0;
      border-bottom: 1px solid #f1f5f9;
      
      &:last-child {
        border-bottom: none;
        padding-top: 0.75rem;
        padding-bottom: 0;
      }
      
      &::before {
        content: attr(data-label);
        font-weight: 700;
        color: #64748b;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
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
  max-width: 100%;
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

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const HeaderTitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const HeaderTitle = styled.span`
  font-weight: 800;
  font-size: 1.2rem;
  letter-spacing: 0.05em;
  display: block;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const HeaderSubtitle = styled.span`
  font-size: 0.8rem;
  opacity: 0.7;
  display: block;

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const FullPagePassBody = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: #ffffff;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    gap: 1.5rem;
  }
`;

const FullPageAirportRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  width: 100%;

  @media (max-width: 600px) {
    margin-bottom: 1rem;
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

    @media (max-width: 600px) {
      font-size: 2.25rem;
    }
  }

  .name {
    font-size: 1rem;
    font-weight: 600;
    color: #64748b;
    margin-top: 0.25rem;
    letter-spacing: 0.05em;

    @media (max-width: 600px) {
      font-size: 0.85rem;
    }
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
    margin: 0 0.75rem;
    svg {
      padding: 0 0.4rem;
    }
  }
`;

const FullPageDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  background: #f8fafc;
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid #f1f5f9;

  @media (max-width: 600px) {
    padding: 1.25rem 1rem;
    gap: 1rem;
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

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const SplitLayout = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 2rem;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const MapWrapper = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  
  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const CabinContainer = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const CabinTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SeatGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: center;
  background: #f8fafc;
  padding: 1.25rem 0.75rem;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  border-left: 4px solid #3b82f6;
  border-right: 4px solid #3b82f6;

  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
    gap: 0.3rem;
  }
`;

const SeatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  justify-content: center;
`;

const RowLabel = styled.div`
  width: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-align: center;

  @media (max-width: 600px) {
    width: 16px;
    font-size: 0.65rem;
  }
`;

const SeatHeaderLabel = styled.div`
  width: 32px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-align: center;

  @media (max-width: 600px) {
    width: 28px;
    font-size: 0.65rem;
  }
`;

const AisleSpace = styled.div`
  width: 16px;

  @media (max-width: 600px) {
    width: 10px;
  }
`;

const AisleLabel = styled.div`
  width: 16px;
  font-size: 0.55rem;
  font-weight: 700;
  color: #cbd5e1;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  text-align: center;
  letter-spacing: 0.1em;
  user-select: none;

  @media (max-width: 600px) {
    width: 10px;
    font-size: 0.45rem;
  }
`;

const SeatButton = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.selected ? '#dbeafe' : '#ffffff'};
  border: 1px solid ${props => props.selected ? '#2563eb' : '#e2e8f0'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    background: ${props => props.selected ? '#dbeafe' : '#f1f5f9'};
  }

  @media (max-width: 600px) {
    width: 28px;
    height: 28px;
    border-radius: 5px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const CabinLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.75rem;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #64748b;
`;

const LegendIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: ${props => props.color};
  border: 1px solid ${props => props.border};
`;
