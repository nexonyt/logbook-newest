import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import NavBar from "../components/Navbar";
import axios from "axios";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import worldCountries from "../data/countries.json";
import airports from "../data/airports.json";
import ReactCountryFlag from "react-country-flag";
import { Globe, Plus, Trash2, Search, Info, PlaneTakeoff, Compass } from "lucide-react";
import FadeIn from "react-fade-in";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

// Helper component to auto-fit map bounds to visited countries
function FitBounds({ visitedCodes }) {
  const map = useMap();

  useEffect(() => {
    if (!visitedCodes || visitedCodes.length === 0) return;

    // Build a list of bounding boxes or points representing the visited countries
    const coords = [];
    worldCountries.features.forEach(feature => {
      const code = feature.properties?.iso_a2 || feature.properties?.ISO_A2;
      if (code && visitedCodes.includes(code)) {
        // Collect coordinates to calculate a rough bounding box
        if (feature.geometry?.type === "Polygon") {
          feature.geometry.coordinates[0].forEach(coord => {
            coords.push([coord[1], coord[0]]); // Leaflet wants [lat, lon]
          });
        } else if (feature.geometry?.type === "MultiPolygon") {
          feature.geometry.coordinates.forEach(polygon => {
            polygon[0].forEach(coord => {
              coords.push([coord[1], coord[0]]);
            });
          });
        }
      }
    });

    if (coords.length > 0) {
      map.fitBounds(coords, { padding: [40, 40], maxZoom: 6 });
    }
  }, [visitedCodes, map]);

  return null;
}

// Compile a list of all world countries from countries.json for the dropdown/search
const allWorldCountries = (() => {
  const list = [];
  const seen = new Set();
  
  worldCountries.features.forEach(f => {
    const code = f.properties?.iso_a2 || f.properties?.ISO_A2;
    const name = f.properties?.name || f.properties?.NAME || f.properties?.NAME_LONG || "";
    if (code && name && !seen.has(code)) {
      seen.add(code);
      list.push({ code, name });
    }
  });

  return list.sort((a, b) => a.name.localeCompare(b.name));
})();

export default function VisitedCountries() {
  const [flightsCountries, setFlightsCountries] = useState([]);
  const [customCountries, setCustomCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom Addition State
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [adding, setAdding] = useState(false);

  // Helper: Retrieve userID from JWT token
  const getUserID = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Brak tokena w localStorage");
    let payloadBase64 = token.split(".")[1];
    if (!payloadBase64) throw new Error("Niepoprawny token JWT");
    payloadBase64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(payloadBase64));
    return payload.user_id;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userID = getUserID();

      // Fetch Flights
      const flightsResponse = await axios.post("http://localhost:4040/getAllFlights", { userID });
      const flightsData = flightsResponse.data;

      // Extract unique countries visited via flights
      const fCountries = new Set();
      flightsData.forEach(flight => {
        if (flight.fli_dest_air_icao && airports[flight.fli_dest_air_icao]?.country) {
          fCountries.add(airports[flight.fli_dest_air_icao].country);
        }
        if (flight.fli_arr_air_icao && airports[flight.fli_arr_air_icao]?.country) {
          fCountries.add(airports[flight.fli_arr_air_icao].country);
        }
      });
      setFlightsCountries(Array.from(fCountries));

      // Fetch custom visited countries (visited without flights)
      const customResponse = await axios.post("http://localhost:4040/get-visited-countries", { userID });
      setCustomCountries(customResponse.data);

    } catch (err) {
      console.error("Błąd wczytywania danych państw:", err);
      setError("Nie udało się załadować danych o odwiedzonych krajach.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCountry = async () => {
    if (!selectedCountry) return;
    
    // Check if already visited
    if (flightsCountries.includes(selectedCountry.code) || customCountries.includes(selectedCountry.code)) {
      toast.info("Ten kraj jest już zaznaczony jako odwiedzony!");
      setSelectedCountry(null);
      setSearchQuery("");
      return;
    }

    try {
      setAdding(true);
      const userID = getUserID();
      await axios.post("http://localhost:4040/add-visited-country", {
        userID,
        countryCode: selectedCountry.code
      });
      
      setCustomCountries(prev => [...prev, selectedCountry.code]);
      toast.success(`Dodano ${selectedCountry.name} do listy!`);
      setSelectedCountry(null);
      setSearchQuery("");
    } catch (err) {
      console.error("Błąd podczas dodawania kraju:", err);
      toast.error("Nie udało się zapisać kraju w bazie danych.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveCountry = async (code, name) => {
    if (!window.confirm(`Czy na pewno chcesz usunąć ${name} z listy odwiedzonych krajów?`)) return;

    try {
      const userID = getUserID();
      await axios.post("http://localhost:4040/remove-visited-country", {
        userID,
        countryCode: code
      });
      
      setCustomCountries(prev => prev.filter(c => c !== code));
      toast.info(`Usunięto ${name} z listy.`);
    } catch (err) {
      console.error("Błąd podczas usuwania kraju:", err);
      toast.error("Nie udało się usunąć kraju z bazy danych.");
    }
  };

  // Combine both lists for polygon highlighting
  const allVisitedCodes = Array.from(new Set([...flightsCountries, ...customCountries]));

  // Auto-complete suggestions logic
  const suggestions = allWorldCountries.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !flightsCountries.includes(c.code) &&
    !customCountries.includes(c.code)
  ).slice(0, 5);

  const getCountryName = (code) => {
    return allWorldCountries.find(c => c.code === code)?.name || code;
  };

  return (
    <MainDiv>
      <NavBar />
      <ContentWrapper>
        <MapContent>
          <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
            
            {/* Header */}
            <HeaderBlock>
              <div>
                <Title><Globe size={28} /> Odwiedzone Kraje</Title>
                <Subtitle>Mapa świata przedstawiająca kraje odwiedzone samolotem oraz wpisane ręcznie</Subtitle>
              </div>
            </HeaderBlock>

            {loading && (
              <MessageContainer>
                <CircularProgress size={30} style={{ marginBottom: "1rem" }} />
                <div>Ładowanie statystyk geograficznych...</div>
              </MessageContainer>
            )}

            {error && (
              <MessageContainer style={{ color: "#ef4444", borderColor: "#fecaca", background: "#fef2f2" }}>
                {error}
              </MessageContainer>
            )}

            {!loading && !error && (
              <FadeIn>
                <SplitLayout>
                  
                  {/* Left Column: Visual Map */}
                  <LeftColumn>
                    <MapOuterWrapper>
                      <MapContainer 
                        center={[20.0, 0.0]} 
                        zoom={2} 
                        style={{ height: "100%", width: "100%", borderRadius: "16px", overflow: "hidden" }}
                      >
                        <TileLayer
                          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        
                        {/* Auto fit map to visited countries */}
                        <FitBounds visitedCodes={allVisitedCodes} />

                        {/* World Countries Polygon highlights */}
                        <GeoJSON 
                          key={allVisitedCodes.join("-")} // Force re-render when list updates
                          data={worldCountries} 
                          style={(feature) => {
                            const code = feature.properties?.iso_a2 || feature.properties?.ISO_A2;
                            const isVisited = code && allVisitedCodes.includes(code);
                            
                            return {
                              fillColor: '#10b981',
                              fillOpacity: isVisited ? 0.35 : 0.0,
                              color: isVisited ? '#059669' : 'transparent',
                              weight: isVisited ? 1.5 : 0
                            };
                          }}
                          onEachFeature={(feature, layer) => {
                            const name = feature.properties?.name || feature.properties?.NAME || feature.properties?.NAME_LONG || "";
                            const code = feature.properties?.iso_a2 || feature.properties?.ISO_A2;
                            const isVisited = code && allVisitedCodes.includes(code);
                            
                            if (isVisited) {
                              const method = flightsCountries.includes(code) ? "odwiedzony samolotem" : "odwiedzony bez lotu";
                              layer.bindPopup(`<strong>${name}</strong><br/>Kraj ${method}!`);
                            } else {
                              layer.bindPopup(`<strong>${name}</strong>`);
                            }
                          }}
                        />
                      </MapContainer>
                    </MapOuterWrapper>
                  </LeftColumn>

                  {/* Right Column: Sidebar Control Panel */}
                  <RightColumn>
                    
                    {/* Add custom country widget */}
                    <ControlCard>
                      <CardTitle><Plus size={16} /> Dodaj kraj (odwiedzony bez lotów)</CardTitle>
                      <FormGroup>
                        <AutocompleteWrapper>
                          <Search size={16} className="search-icon" />
                          <input
                            type="text"
                            placeholder="Wpisz nazwę państwa..."
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setSelectedCountry(null);
                              setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                          />
                          {showSuggestions && searchQuery.trim() !== "" && suggestions.length > 0 && (
                            <SuggestionsList>
                              {suggestions.map((c) => (
                                <SuggestionItem 
                                  key={c.code}
                                  onMouseDown={() => {
                                    setSelectedCountry(c);
                                    setSearchQuery(c.name);
                                    setShowSuggestions(false);
                                  }}
                                >
                                  <ReactCountryFlag countryCode={c.code} svg style={{ marginRight: "8px" }} />
                                  {c.name}
                                </SuggestionItem>
                              ))}
                            </SuggestionsList>
                          )}
                        </AutocompleteWrapper>
                        <AddBtn 
                          disabled={!selectedCountry || adding}
                          onClick={handleAddCountry}
                        >
                          {adding ? "Dodawanie..." : "Dodaj"}
                        </AddBtn>
                      </FormGroup>
                    </ControlCard>

                    {/* Stats overview */}
                    <ControlCard>
                      <CardTitle><Compass size={16} /> Statystyki geograficzne</CardTitle>
                      <StatsContainer>
                        <StatBadge>
                          <span className="num">{allVisitedCodes.length}</span>
                          <span className="label">Kraje ogółem</span>
                        </StatBadge>
                        <StatBadge>
                          <span className="num" style={{ color: "#3b82f6" }}>{flightsCountries.length}</span>
                          <span className="label">Przez loty</span>
                        </StatBadge>
                        <StatBadge>
                          <span className="num" style={{ color: "#10b981" }}>{customCountries.length}</span>
                          <span className="label">Wpisy ręczne</span>
                        </StatBadge>
                      </StatsContainer>
                    </ControlCard>

                    {/* Visited without flights list */}
                    <ControlCard>
                      <CardTitle><Globe size={16} style={{ color: "#10b981" }} /> Odwiedzone bez lotów ({customCountries.length})</CardTitle>
                      {customCountries.length === 0 ? (
                        <EmptyMessage>Brak ręcznie wpisanych państw.</EmptyMessage>
                      ) : (
                        <CountryList>
                          {customCountries.map(code => {
                            const name = getCountryName(code);
                            return (
                              <CountryItem key={code}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <ReactCountryFlag countryCode={code} svg style={{ fontSize: "1.25em", marginRight: "8px" }} />
                                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{name}</span>
                                </div>
                                <DeleteBtn onClick={() => handleRemoveCountry(code, name)}>
                                  <Trash2 size={14} />
                                </DeleteBtn>
                              </CountryItem>
                            );
                          })}
                        </CountryList>
                      )}
                    </ControlCard>

                    {/* Visited via flights list */}
                    <ControlCard>
                      <CardTitle><PlaneTakeoff size={16} style={{ color: "#3b82f6" }} /> Odwiedzone korytarzami lotów ({flightsCountries.length})</CardTitle>
                      {flightsCountries.length === 0 ? (
                        <EmptyMessage>Brak lotów w bazie uniemożliwia automatyczne zliczenie.</EmptyMessage>
                      ) : (
                        <CountryList>
                          {flightsCountries.map(code => {
                            const name = getCountryName(code);
                            return (
                              <CountryItem key={code} style={{ background: "#f8fafc", borderColor: "#f1f5f9" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <ReactCountryFlag countryCode={code} svg style={{ fontSize: "1.25em", marginRight: "8px" }} />
                                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{name}</span>
                                </div>
                                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#3b82f6", background: "#dbeafe", padding: "2px 8px", borderRadius: "8px" }}>
                                  LOTY
                                </span>
                              </CountryItem>
                            );
                          })}
                        </CountryList>
                      )}
                    </ControlCard>

                  </RightColumn>
                </SplitLayout>
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
    color: #10b981;
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  margin: 0.25rem 0 0 0;
  font-size: 0.95rem;
`;

const SplitLayout = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MapOuterWrapper = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  height: 650px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    height: 450px;
  }
`;

const ControlCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
`;

const CardTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FormGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const AutocompleteWrapper = styled.div`
  position: relative;
  flex: 1;

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.65rem 0.65rem 0.65rem 2.5rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    font-size: 0.85rem;
    color: #0f172a;
    background-color: #f8fafc;
    transition: all 0.2s ease;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #10b981;
      background-color: #ffffff;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
  }
`;

const SuggestionsList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-top: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
`;

const SuggestionItem = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #334155;

  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }
`;

const AddBtn = styled.button`
  background: #10b981;
  color: #ffffff;
  border: none;
  padding: 0 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #059669;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
`;

const StatBadge = styled.div`
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .num {
    font-size: 1.25rem;
    font-weight: 800;
    color: #0f172a;
  }

  .label {
    font-size: 0.7rem;
    color: #64748b;
    font-weight: 500;
    margin-top: 0.2rem;
    text-align: center;
  }
`;

const CountryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 2px;
`;

const CountryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
`;

const DeleteBtn = styled.button`
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ef4444;
    background: #fef2f2;
  }
`;

const EmptyMessage = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
  text-align: center;
  padding: 1rem 0;
  font-style: italic;
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
