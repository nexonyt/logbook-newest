import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import NavBar from "../components/Navbar";
import AirportSearchInput from "../components/AirportSearchInput";
import airports from "../data/airports.json";
import { Plane, Calendar, MapPin, Info } from "lucide-react";

const initialPreFlightData = {
  userID: 0,
  flightNumber: "",
  flightDateDeparture: "",
  flightTimeDeparture: "",
  flightDateArrival: "",
  flightTimeArrival: "",
  flightAirline: "",
  flightDestIATA: "",
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

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        let payloadBase64 = token.split(".")[1];
        if (payloadBase64) {
          payloadBase64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(atob(payloadBase64));
          if (payload.user_id) {
            setPreFlightData((prev) => ({
              ...prev,
              userID: payload.user_id
            }));
          }
        }
      }
    } catch (e) {
      console.error("Error decoding token for userID:", e);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreFlightData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendData = async () => {
    if (!preFlightData.flightNumber || !preFlightData.flightAirline) {
      toast.error("Wpisz przynajmniej numer lotu i linię lotniczą.");
      return;
    }

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
      if (response.status === 200) {
        toast.success("Lot został pomyślnie zapisany!");
        // Keep the user ID but reset the rest of the form
        setPreFlightData((prev) => ({
          ...initialPreFlightData,
          userID: prev.userID
        }));
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
        <FormCard>
          <FormTitle>Dodaj nowy lot</FormTitle>
          <FormSubtitle>Uzupełnij poniższy formularz, aby dodać wpis do swojego logbooka</FormSubtitle>
          
          <SectionHeader>
            <Plane size={18} /> Informacje ogólne
          </SectionHeader>
          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Numer lotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightNumber"
                value={preFlightData.flightNumber}
                onChange={handleChange}
                placeholder="np. FR 1234"
              />
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Linia lotnicza</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightAirline"
                value={preFlightData.flightAirline}
                onChange={handleChange}
                placeholder="np. Ryanair"
              />
            </DivContainerWithLabel>
          </AddFlightsDivRow>

          <SectionHeader>
            <MapPin size={18} /> Trasa (Lotniska)
          </SectionHeader>
          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Kod ICAO lotniska odlotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightDestICAO"
                value={preFlightData.flightDestICAO}
                onChange={handleChange}
                placeholder="np. EPWA"
              />
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Kod IATA lotniska odlotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightDestIATA"
                value={preFlightData.flightDestIATA}
                onChange={handleChange}
                placeholder="np. WAW"
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
                placeholder="Wpisz kod IATA lub nazwę lotniska"
                airports={airports}
                onChange={(e) => setPreFlightData((prev) => ({ ...prev, flightArrivalIATA: e.target.value }))}
                onAirportSelect={(airport) => setPreFlightData((prev) => ({ ...prev, flightArrivalIATA: airport.iata }))}
              />
            </DivContainerWithLabel>
          </AddFlightsDivRow>

          <SectionHeader>
            <Calendar size={18} /> Harmonogram i czasy
          </SectionHeader>
          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Data odlotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightDateDeparture"
                value={preFlightData.flightDateDeparture}
                onChange={handleChange}
                placeholder="YYYY-MM-DD (np. 2024-07-15)"
              />
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Godzina odlotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightTimeDeparture"
                value={preFlightData.flightTimeDeparture}
                onChange={handleChange}
                placeholder="HH:MM (np. 17:15)"
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
                placeholder="YYYY-MM-DD (np. 2024-07-15)"
              />
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Godzina przylotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightTimeArrival"
                value={preFlightData.flightTimeArrival}
                onChange={handleChange}
                placeholder="HH:MM (np. 22:45)"
              />
            </DivContainerWithLabel>
          </AddFlightsDivRow>
          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Czas trwania lotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="flightDuration"
                value={preFlightData.flightDuration}
                onChange={handleChange}
                placeholder="HH:MM (np. 3:45)"
              />
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Opóźnienie lotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="fliDelay"
                value={preFlightData.fliDelay}
                onChange={handleChange}
                placeholder="HH:MM (np. 0:30)"
              />
            </DivContainerWithLabel>
          </AddFlightsDivRow>

          <SectionHeader>
            <Info size={18} /> Szczegóły samolotu i rejsu
          </SectionHeader>
          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Typ samolotu</CustomLabel>
              <AddFlightsInput
                type="text"
                name="fliAircraftType"
                value={preFlightData.fliAircraftType}
                onChange={handleChange}
                placeholder="np. Boeing 737-800"
              />
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Rejestracja samolotu (Reg)</CustomLabel>
              <AddFlightsInput
                type="text"
                name="fliAircraft"
                value={preFlightData.fliAircraft}
                onChange={handleChange}
                placeholder="np. SP-RSX"
              />
            </DivContainerWithLabel>
          </AddFlightsDivRow>
          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Numer miejsca (Seat)</CustomLabel>
              <AddFlightsInput
                type="text"
                name="fliSeats"
                value={preFlightData.fliSeats}
                onChange={handleChange}
                placeholder="np. 14F"
              />
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Dodatkowe uwagi / notatka</CustomLabel>
              <AddFlightsInput
                type="text"
                name="fliDetails"
                value={preFlightData.fliDetails}
                onChange={handleChange}
                placeholder="np. Turbulencje nad Alpami"
              />
            </DivContainerWithLabel>
          </AddFlightsDivRow>

          <SubmitButton onClick={sendData}>
            <Plane size={18} style={{ transform: "rotate(45deg)" }} />
            Zapisz lot w logbooku
          </SubmitButton>
        </FormCard>
      </FlightsContent>
    </MainDiv>
  );
}

// ---------------- STYLED COMPONENTS ---------------- //

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
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

const FormCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
  border: 1px solid #e2e8f0;
  padding: 3rem;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FormTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
  margin-top: 0;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const FormSubtitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  text-align: center;
  margin-bottom: 2.5rem;
  margin-top: 0;
`;

const SectionHeader = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-top: 2rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 0.5rem;

  svg {
    color: #3b82f6;
  }
`;

const AddFlightsInput = styled.input`
  width: 100%;
  background-color: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #1e293b;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: #3b82f6;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
    outline: none;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const AddFlightsDivRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.25rem;
  width: 100%;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const CustomLabel = styled.label`
  display: block;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const DivContainerWithLabel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  & > div {
    width: 100%;
  }

  & input {
    width: 100%;
    box-sizing: border-box;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 2.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #ffffff;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`;