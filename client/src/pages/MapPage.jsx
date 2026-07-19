import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import NavBar from "../components/Navbar";
import axios from "axios";
import { useMap, MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import airports from "../data/airports.json";
import { Plane, MapPin, Compass, Search, Filter, RefreshCw, Globe, ArrowRight } from "lucide-react";
import FadeIn from "react-fade-in";
import CircularProgress from "@mui/material/CircularProgress";

// Helper component to auto-fit map bounds to show all flights
function FitBounds({ flightsData }) {
  const map = useMap();

  useEffect(() => {
    if (!flightsData || flightsData.length === 0) return;

    const coords = [];
    flightsData.forEach(flight => {
      const dep = airports[flight.fli_dest_air_icao];
      const arr = airports[flight.fli_arr_air_icao];
      if (dep && dep.lat != null && dep.lon != null) {
        coords.push([dep.lat, dep.lon]);
      }
      if (arr && arr.lat != null && arr.lon != null) {
        coords.push([arr.lat, arr.lon]);
      }
    });

    if (coords.length > 0) {
      map.fitBounds(coords, { padding: [50, 50], maxZoom: 8 });
    }
  }, [flightsData, map]);

  return null;
}

// Helper component to capture map background clicks
function MapEvents({ onMapClick }) {
  useMapEvents({
    click: () => {
      onMapClick();
    }
  });
  return null;
}

export default function MapPage() {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected Route & Home Airport States
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);
  const [homeAirport, setHomeAirport] = useState("");

  // Filters
  const [searchAirport, setSearchAirport] = useState("");
  const [searchAirline, setSearchAirline] = useState("");

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

        const response = await axios.post("/getAllFlights", { userID });
        const flightsData = response.data;
        setFlights(flightsData);
        setFilteredFlights(flightsData);

        // Deduce user's home airport (airport with the highest departure counts)
        const counts = {};
        flightsData.forEach(f => {
          if (f.fli_dest_air_icao) {
            counts[f.fli_dest_air_icao] = (counts[f.fli_dest_air_icao] || 0) + 1;
          }
        });
        let maxCount = 0;
        let home = "";
        Object.entries(counts).forEach(([icao, count]) => {
          if (count > maxCount) {
            maxCount = count;
            home = icao;
          }
        });
        setHomeAirport(home);
      } catch (err) {
        console.error("Błąd wczytywania lotów dla mapy:", err);
        setError("Nie udało się pobrać danych o lotach. Spróbuj ponownie później.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  // Filter effect
  useEffect(() => {
    let result = flights;

    if (searchAirport.trim() !== "") {
      const q = searchAirport.toLowerCase();
      result = result.filter(f =>
        (f.fli_dest_air_icao && f.fli_dest_air_icao.toLowerCase().includes(q)) ||
        (f.fli_dest_air_iata && f.fli_dest_air_iata.toLowerCase().includes(q)) ||
        (f.fli_arr_air_icao && f.fli_arr_air_icao.toLowerCase().includes(q)) ||
        (f.fli_arr_air_iata && f.fli_arr_air_iata.toLowerCase().includes(q))
      );
    }

    if (searchAirline.trim() !== "") {
      const q = searchAirline.toLowerCase();
      result = result.filter(f =>
        f.fli_airline && f.fli_airline.toLowerCase().includes(q)
      );
    }

    setFilteredFlights(result);
  }, [searchAirport, searchAirline, flights]);

  // Calculations for stats
  const uniqueAirports = new Set();
  const uniqueCountries = new Set();

  filteredFlights.forEach(f => {
    if (f.fli_dest_air_icao) {
      uniqueAirports.add(f.fli_dest_air_icao);
      const details = airports[f.fli_dest_air_icao];
      if (details?.country) uniqueCountries.add(details.country);
    }
    if (f.fli_arr_air_icao) {
      uniqueAirports.add(f.fli_arr_air_icao);
      const details = airports[f.fli_arr_air_icao];
      if (details?.country) uniqueCountries.add(details.country);
    }
  });

  const getAirportFlights = (icao) => {
    return flights.filter(f => f.fli_dest_air_icao === icao || f.fli_arr_air_icao === icao);
  };

  const handleResetFilters = () => {
    setSearchAirport("");
    setSearchAirline("");
  };

  // Collect unique airport positions to render markers
  const airportMarkers = {};
  filteredFlights.forEach(flight => {
    [
      { icao: flight.fli_dest_air_icao, iata: flight.fli_dest_air_iata },
      { icao: flight.fli_arr_air_icao, iata: flight.fli_arr_air_iata }
    ].forEach(ap => {
      if (ap.icao && airports[ap.icao] && !airportMarkers[ap.icao]) {
        const data = airports[ap.icao];
        if (data.lat != null && data.lon != null) {
          airportMarkers[ap.icao] = {
            icao: ap.icao,
            iata: ap.iata || data.iata,
            name: data.name,
            city: data.city,
            country: data.country,
            lat: data.lat,
            lon: data.lon
          };
        }
      }
    });
  });

  const isAnyRouteSelected = selectedRouteIndex !== null;

  return (
    <MainDiv>
      <NavBar />
      <ContentWrapper>
        <MapContent>
          <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>

            {/* Header */}
            <HeaderBlock>
              <div>
                <Title><Compass size={28} /> Interaktywna Mapa Lotów</Title>
                <Subtitle>Wizualizacja wszystkich Twoich tras i odwiedzonych lotnisk</Subtitle>
              </div>
              {(searchAirport || searchAirline) && (
                <ResetButton onClick={handleResetFilters}>
                  <RefreshCw size={14} /> Resetuj filtry
                </ResetButton>
              )}
            </HeaderBlock>

            {loading && (
              <MessageContainer>
                <CircularProgress size={30} style={{ marginBottom: "1rem" }} />
                <div>Generowanie mapy i przetwarzanie tras...</div>
              </MessageContainer>
            )}

            {error && (
              <MessageContainer style={{ color: "#ef4444", borderColor: "#fecaca", background: "#fef2f2" }}>
                {error}
              </MessageContainer>
            )}

            {!loading && !error && (
              <FadeIn>

                {/* Stats Bar */}
                <StatsGrid>
                  <StatCard>
                    <StatIconWrapper color="#3b82f6">
                      <Plane size={20} style={{ transform: "rotate(45deg)" }} />
                    </StatIconWrapper>
                    <StatDetails>
                      <span className="value">{filteredFlights.length}</span>
                      <span className="label">Wyświetlone loty</span>
                    </StatDetails>
                  </StatCard>

                  <StatCard>
                    <StatIconWrapper color="#10b981">
                      <MapPin size={20} />
                    </StatIconWrapper>
                    <StatDetails>
                      <span className="value">{uniqueAirports.size}</span>
                      <span className="label">Odwiedzone lotniska</span>
                    </StatDetails>
                  </StatCard>

                  <StatCard>
                    <StatIconWrapper color="#8b5cf6">
                      <Globe size={20} />
                    </StatIconWrapper>
                    <StatDetails>
                      <span className="value">{uniqueCountries.size}</span>
                      <span className="label">Odwiedzone kraje</span>
                    </StatDetails>
                  </StatCard>
                </StatsGrid>

                {/* Filters */}
                <FiltersCard>
                  <FilterTitle><Filter size={16} /> Filtrowanie tras</FilterTitle>
                  <FiltersForm>
                    <InputWrapper>
                      <Search size={16} className="input-icon" />
                      <input
                        type="text"
                        placeholder="Szukaj lotniska (np. EPKK, LHR)..."
                        value={searchAirport}
                        onChange={(e) => setSearchAirport(e.target.value)}
                      />
                    </InputWrapper>

                    <InputWrapper>
                      <Search size={16} className="input-icon" />
                      <input
                        type="text"
                        placeholder="Szukaj linii (np. Ryanair, LOT)..."
                        value={searchAirline}
                        onChange={(e) => setSearchAirline(e.target.value)}
                      />
                    </InputWrapper>
                  </FiltersForm>
                </FiltersCard>

                {/* Map Display */}
                <MapOuterWrapper>
                  <MapContainer
                    center={[50.0, 15.0]}
                    zoom={4}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    <MapEvents onMapClick={() => setSelectedRouteIndex(null)} />

                    {/* Fit Bounds automatically */}
                    <FitBounds flightsData={filteredFlights} />

                    {/* Flight Path Lines */}
                    {filteredFlights.map((flight, idx) => {
                      const dep = airports[flight.fli_dest_air_icao];
                      const arr = airports[flight.fli_arr_air_icao];

                      if (dep && arr && dep.lat != null && dep.lon != null && arr.lat != null && arr.lon != null) {
                        const isSelected = selectedRouteIndex === idx;

                        // Style options based on whether this route is selected, or if another route is selected
                        const color = isSelected ? '#1e40af' : '#6366f1'; // Navy blue when selected, standard indigo otherwise
                        const weight = isSelected ? 4.5 : 2.5;
                        const opacity = isAnyRouteSelected
                          ? (isSelected ? 1.0 : 0.05)
                          : 0.45; // Dim others to almost transparent, highlight current

                        return (
                          <Polyline
                            key={`line-${idx}`}
                            positions={[[dep.lat, dep.lon], [arr.lat, arr.lon]]}
                            pathOptions={{
                              color: color,
                              weight: weight,
                              opacity: opacity,
                              dashArray: 'none'
                            }}
                            eventHandlers={{
                              click: (e) => {
                                L.DomEvent.stopPropagation(e);
                                setSelectedRouteIndex(prev => prev === idx ? null : idx);
                              }
                            }}
                          >
                            <Popup>
                              <PopupContainer>
                                <PopupTitle>{flight.fli_number || "Lot"}</PopupTitle>
                                <PopupRoute>
                                  <span>{flight.fli_dest_air_iata || flight.fli_dest_air_icao}</span>
                                  <ArrowRight size={14} />
                                  <span>{flight.fli_arr_air_iata || flight.fli_arr_air_icao}</span>
                                </PopupRoute>
                                <PopupDetail><strong>Linia:</strong> {flight.fli_airline || "Brak danych"}</PopupDetail>
                                <PopupDetail><strong>Maszyna:</strong> {flight.fli_aircraft_type || flight.fli_aircraft || "Brak danych"}</PopupDetail>
                                <PopupDetail><strong>Czas trwania:</strong> {flight.fli_duration || "0:00"}</PopupDetail>
                              </PopupContainer>
                            </Popup>
                          </Polyline>
                        );
                      }
                      return null;
                    })}

                    {/* Airport Markers */}
                    {Object.values(airportMarkers).map((ap) => {
                      const associatedFlights = getAirportFlights(ap.icao);
                      const isHome = ap.icao === homeAirport;

                      // Highlight marker if it is departure/arrival of selected route, or if no route is selected
                      let isAirportHighlighted = true;
                      if (isAnyRouteSelected) {
                        const activeFlight = filteredFlights[selectedRouteIndex];
                        isAirportHighlighted = (activeFlight.fli_dest_air_icao === ap.icao || activeFlight.fli_arr_air_icao === ap.icao);
                      }

                      // Visual options for home base and standard airports
                      const markerColor = isHome ? '#dc2626' : '#4f46e5'; // Red for home, Indigo for normal
                      const fillColor = isHome ? '#ef4444' : '#818cf8';
                      const radius = isHome ? 10 : 7;
                      const opacity = isAirportHighlighted ? 1.0 : 0.1;
                      const fillOpacity = isAirportHighlighted ? (isHome ? 0.95 : 0.85) : 0.05;

                      return (
                        <CircleMarker
                          key={`marker-${ap.icao}`}
                          center={[ap.lat, ap.lon]}
                          radius={radius}
                          pathOptions={{
                            color: markerColor,
                            fillColor: fillColor,
                            fillOpacity: fillOpacity,
                            opacity: opacity,
                            weight: isHome ? 2.5 : 1.5
                          }}
                        >
                          <Popup>
                            <PopupContainer>
                              <PopupTitle style={{ color: isHome ? '#dc2626' : '#1e293b' }}>
                                {ap.name} {isHome && "(Twój port bazowy 🏠)"}
                              </PopupTitle>
                              <PopupDetail><strong>Kod ICAO/IATA:</strong> {ap.icao} / {ap.iata || "---"}</PopupDetail>
                              <PopupDetail><strong>Miasto:</strong> {ap.city}, {ap.country}</PopupDetail>
                              <div style={{ margin: "8px 0 3px 0", borderTop: "1px solid #e2e8f0", paddingTop: "5px", fontSize: "0.8rem", fontWeight: "bold" }}>
                                Powiązane loty ({associatedFlights.length}):
                              </div>
                              <FlightsMiniList>
                                {associatedFlights.slice(0, 5).map((f, i) => (
                                  <MiniListItem key={i}>
                                    <strong>{f.fli_number}</strong>: {f.fli_dest_air_iata} → {f.fli_arr_air_iata} ({f.fli_airline})
                                  </MiniListItem>
                                ))}
                                {associatedFlights.length > 5 && (
                                  <MiniListItem style={{ color: "#64748b", fontStyle: "italic" }}>
                                    oraz {associatedFlights.length - 5} więcej...
                                  </MiniListItem>
                                )}
                              </FlightsMiniList>
                            </PopupContainer>
                          </Popup>
                        </CircleMarker>
                      );
                    })}
                  </MapContainer>
                </MapOuterWrapper>

                {filteredFlights.length === 0 && (
                  <div style={{ padding: "2rem", textAlign: "center", color: "#64748b", background: "#ffffff", borderRadius: "16px", marginTop: "1rem", border: "1px dashed #cbd5e1" }}>
                    Brak lotów spełniających kryteria filtrowania.
                  </div>
                )}

              </FadeIn>
            )}

          </div>
        </MapContent>
      </ContentWrapper>
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
  width: 100%;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  overflow-x: hidden;
  width: 100%;
`;

const MapContent = styled.div`
  animation: ${fadeIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
  box-sizing: border-box;
  padding: 3rem 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const HeaderBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: #4f46e5;
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  margin: 0.25rem 0 0 0;
  font-size: 0.95rem;
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ffffff;
  color: #4f46e5;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIconWrapper = styled.div`
  background: ${props => props.color}15;
  color: ${props => props.color};
  padding: 0.75rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatDetails = styled.div`
  display: flex;
  flex-direction: column;

  .value {
    font-size: 1.5rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
  }

  .label {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 500;
    margin-top: 0.1rem;
  }
`;

const FiltersCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
`;

const FilterTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FiltersForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;

  .input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    font-size: 0.9rem;
    color: #0f172a;
    background-color: #f8fafc;
    transition: all 0.2s ease;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #4f46e5;
      background-color: #ffffff;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }
  }
`;

const MapOuterWrapper = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  height: 600px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    height: 450px;
  }
`;

const MessageContainer = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1rem;
  color: #6c757d;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  border: 1px solid #e2e8f0;
  margin-top: 1rem;
`;

// Popup styles
const PopupContainer = styled.div`
  font-family: inherit;
  color: #334155;
  min-width: 200px;
  max-width: 280px;
`;

const PopupTitle = styled.h4`
  margin: 0 0 6px 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 4px;
`;

const PopupRoute = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 800;
  color: #4f46e5;
  margin: 8px 0;
`;

const PopupDetail = styled.div`
  font-size: 0.78rem;
  color: #475569;
  margin: 3px 0;
`;

const FlightsMiniList = styled.ul`
  margin: 4px 0 0 0;
  padding-left: 12px;
  font-size: 0.75rem;
  color: #334155;
`;

const MiniListItem = styled.li`
  margin: 3px 0;
`;
