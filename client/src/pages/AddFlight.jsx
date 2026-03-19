import React, { useState } from "react";
import { toast } from "react-toastify";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import NavBar from "../components/Navbar";
import AirportSearchInput from "../components/AirportSearchInput";
import airports from "../data/airports.json";

const initialPreFlightData = {
  userID: 0,
  flightNumber: "",
  flightDateDeparture: "",
  flightTimeDeparture: "",
  flightDateArrival: "",
  flightTimeArrival: "",
  flightAirline: "",
  flightDestIATA: "", // Założyłem, że Dest to Odlot według Twojego nazewnictwa w sendData
  flightDestICAO: "",
  flightArrivalIATA: "",
  flightArrivalICAO: "",
  fliAircraft: "",
  fliDelay: "",
  flightDuration: "",
  fliSeats: "",
  fliDetails: "",
  fliAircraftType: "",
};

export default function AddFlights() {
  const [preFlightData, setPreFlightData] = useState(initialPreFlightData);

  // Uniwersalny handler dla standardowych inputów tekstowych
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreFlightData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendData = async () => {
    const flightData = {
      userID: preFlightData.userID,
      flightNumber: preFlightData.flightNumber,
      flightDeparture: `${preFlightData.flightDateDeparture} ${preFlightData.flightTimeDeparture}:00`,
      flightArrival: `${preFlightData.flightDateArrival} ${preFlightData.flightTimeArrival}:00`,
      flightAirline: preFlightData.flightAirline,
      flightDestIATA: preFlightData.flightDestIATA,
      flightDestICAO: preFlightData.flightDestICAO,
      flightArrivalIATA: preFlightData.flightArrivalIATA,
      flightArrivalICAO: preFlightData.flightArrivalICAO,
      fliAircraft: preFlightData.fliAircraft,
      flightDuration: preFlightData.flightDuration,
      fliDelay: preFlightData.fliDelay,
      fliSeats: preFlightData.fliSeats,
      fliDetails: preFlightData.fliDetails,
      fliAircraftType: preFlightData.fliAircraftType,
    };

    try {
      const response = await axios.post("/addflightquery", flightData);
      // POPRAWKA: Użycie === zamiast =
      if (response.status === 200) {
        toast.success("Dane zostały pomyślnie zapisane!");
        setPreFlightData(initialPreFlightData); // Reset formularza
      }
    } catch (err) {
      const errorMessage = err.response?.data || "Wystąpił błąd podczas zapisu.";
      toast.error(errorMessage);
    }
  };

  return (
    <MainDiv>
      <NavBar />
      <FlightsContent>
        <AddFlightsDiv>
          <HeaderTitle>Uzupełnij dane swojego lotu</HeaderTitle>
          
          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Numer lotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightNumber"
                value={preFlightData.flightNumber}
                onChange={handleChange}
                placeholder="FR 1234"
              />
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Linia lotnicza</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightAirline"
                value={preFlightData.flightAirline}
                onChange={handleChange}
                placeholder="Enter Air"
              />
            </DivContainerWithLabel>
          </AddFlightsDivRow>

          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Data odlotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightDateDeparture"
                value={preFlightData.flightDateDeparture}
                onChange={handleChange}
                placeholder="15.07.2024"
              />
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Godzina odlotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightTimeDeparture"
                value={preFlightData.flightTimeDeparture}
                onChange={handleChange}
                placeholder="17:15"
              />
            </DivContainerWithLabel>
          </AddFlightsDivRow>

          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Data przylotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightDateArrival"
                value={preFlightData.flightDateArrival}
                onChange={handleChange}
                placeholder="15.07.2024"
              />
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Godzina przylotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightTimeArrival"
                value={preFlightData.flightTimeArrival}
                onChange={handleChange}
                placeholder="22:45"
              />
            </DivContainerWithLabel>
          </AddFlightsDivRow>

          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Kod ICAO lotniska odlotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightDestICAO"
                value={preFlightData.flightDestICAO}
                onChange={handleChange}
                placeholder="EPWA"
              />
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Kod IATA lotniska odlotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightDestIATA"
                value={preFlightData.flightDestIATA}
                onChange={handleChange}
                placeholder="WAW"
              />
            </DivContainerWithLabel>
          </AddFlightsDivRow>

          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Kod ICAO lotniska przylotu</CustomLabel>
              <AirportSearchInput
                placeholder="Wpisz kod ICAO lub nazwę lotniska"
                airports={airports}
                onChange={(e) => setPreFlightData((prev) => ({ ...prev, flightArrivalICAO: e.target.value }))}
                onAirportSelect={(airport) => setPreFlightData((prev) => ({ ...prev, flightArrivalICAO: airport.icao }))}
              />
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Kod IATA lotniska przylotu</CustomLabel>
              <AirportSearchInput
                type="text"
                placeholder="Wpisz kod IATA lub nazwę lotniska"
                airports={airports}
                onChange={(e) => setPreFlightData((prev) => ({ ...prev, flightArrivalIATA: e.target.value }))}
                onAirportSelect={(airport) => setPreFlightData((prev) => ({ ...prev, flightArrivalIATA: airport.iata }))}
              />
            </DivContainerWithLabel>
          </AddFlightsDivRow>

          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Czas lotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightDuration"
                value={preFlightData.flightDuration}
                onChange={handleChange}
                placeholder="3:45"
              />
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Jakie opóźnienie?</CustomLabel>
              <AddFlightsInput
                type="text"
                name="fliDelay"
                value={preFlightData.fliDelay}
                onChange={handleChange}
                placeholder="0:30"
              />
            </DivContainerWithLabel>
          </AddFlightsDivRow>

          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Numer miejsca</CustomLabel>
              <AddFlightsInput
                type="text"
                name="fliSeats"
                value={preFlightData.fliSeats}
                onChange={handleChange}
                placeholder="7A"
              />
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Rejestracja samolotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="fliAircraft"
                value={preFlightData.fliAircraft}
                onChange={handleChange}
                placeholder="SP-RSX"
              />
            </DivContainerWithLabel>
          </AddFlightsDivRow>

          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Dodatkowe informacje</CustomLabel>
              <AddFlightsInput
                type="text"
                name="fliDetails"
                value={preFlightData.fliDetails}
                onChange={handleChange}
                placeholder="Silne turbulencje"
              />
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Typ samolotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="fliAircraftType"
                value={preFlightData.fliAircraftType}
                onChange={handleChange}
                placeholder="Boeing 737-8AS"
              />
            </DivContainerWithLabel>
          </AddFlightsDivRow>

          <SubmitButton onClick={sendData}>Zapisz lot</SubmitButton>
        </AddFlightsDiv>
      </FlightsContent>
    </MainDiv>
  );
}

// ---------------- STYLED COMPONENTS ---------------- //

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const HeaderTitle = styled.div`
  font-size: 24px;
  margin-top: 45px;
`;

const MainDiv = styled.div`
  background-color: white;
  display: flex;
  min-height: 50vw;
`;

const FlightsContent = styled.div`
  animation: ${fadeIn} 0.3s ease-in-out;
  display: flex; 
  justify-content: center;
  align-items: center; 
  min-height: 100vh;
  overflow: auto;
  width: 100%;
  box-sizing: border-box;
`;

const AddFlightsDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 90%;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const AddFlightsInput = styled.input`
  width: 100%;
  /* Usunąłem max-width stąd, ponieważ kontrolujemy to już z poziomu DivContainerWithLabel */
  background-color: #e2e8f0;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  padding: 0.75rem 1rem;
  color: #4a5568;
  box-sizing: border-box;

  &:focus {
    background-color: #ffffff;
    border-color: #a0aec0;
    outline: none; /* Pozbywa się domyślnej, czarnej ramki przeglądarki przy kliknięciu */
  }

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const AddFlightsDivRow = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  width: 100%;

  @media (max-width: 800px) {
    gap: 15px;
  }
`;

const CustomLabel = styled.label`
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #131218;
  font-size: 0.75rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const DivContainerWithLabel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1; 
  min-width: 250px; 
  /* Zmniejszamy max-width kontenera z 500px na 300px, 
     aby idealnie pasował do szerokości inputów i trzymał je w równych kolumnach */
  max-width: 300px; 
  margin: 0 10px;

  /* Wymuszamy, aby komponent AirportSearchInput (który prawdopodobnie jest div-em) 
     oraz wszystkie inputy wewnątrz zajmowały 100% szerokości kontenera */
  & > div {
    width: 100%;
  }

  & input {
    width: 100%;
    box-sizing: border-box; /* Zapobiega rozpychaniu przez padding */
  }
`;

const SubmitButton = styled.button`
  display: inline-block;
  margin: 3rem 0;
  border-radius: 0.25rem;
  background-color: #181818;
  color: #fafafa;
  box-shadow: 0 4px 9px -4px rgba(51, 45, 45, 0.7);
  padding-top: 0.625rem;
  padding-bottom: 0.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  line-height: 1.25;
  transition: background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  outline: none;
  
  &:hover {
    cursor: pointer;
    background-color: #525252;
    box-shadow: 0 8px 9px -4px rgba(51, 45, 45, 0.2), 0 4px 18px 0 rgba(51, 45, 45, 0.1);
  }
  &:focus {
    background-color: #1e3a8a;
    box-shadow: 0 8px 9px -4px rgba(51, 45, 45, 0.2), 0 4px 18px 0 rgba(51, 45, 45, 0.1);
  }
  &:active {
    background-color: #1d4ed8;
    box-shadow: 0 8px 9px -4px rgba(51, 45, 45, 0.2), 0 4px 18px 0 rgba(51, 45, 45, 0.1);
  }
`;