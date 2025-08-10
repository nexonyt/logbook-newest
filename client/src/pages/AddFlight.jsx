import { toast } from "react-toastify";
import styled, { keyframes } from "styled-components";
import NavBar from "../components/Navbar";
import axios from "axios";
import React, { useState, useEffect } from "react";
import AirportSearchInput from "../components/AirportSearchInput";
import airports from "../data/airports.json";


export default function AddFlights() {


  const [user, setUser] = useState(null);
  const [dataReceived, setDataReceived] = useState(false);
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
  const [preFlightData, setPreFlightData] = useState({
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
  });
  console.log(preFlightData)
  let flightNumber = "";
  let flightDeparture = "";
  const sendData = () => {
    const flightData = {
      userID: preFlightData.userID,
      flightNumber: preFlightData.flightNumber,
      flightDeparture:
        preFlightData.flightDateDeparture +
        " " +
        preFlightData.flightTimeDeparture +
        ":00",
      flightArrival:
        preFlightData.flightDateArrival +
        " " +
        preFlightData.flightTimeArrival +
        ":00",
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
    axios
      .post("/addflightquery", flightData)
      .then((response) => {
        if ((response.status = 200)) {
          toast.success("Dane zostały pomyślnie zapisane!");

          setPreFlightData(initialPreFlightData);
        }
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  const [loty, setLoty] = useState();

  const handleAirportSelect = (airport, type) => {
    console.log(`Selected ${type}:`, airport);

  };

  return (
    <MainDiv>
      <NavBar></NavBar>
      <FlightsContent>
        <AddFlightsDiv>
          <HeaderTitle>Uzupełnij dane swojego lotu</HeaderTitle>
          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Numer lotu</CustomLabel>
              <AddFlightsInput
                type="text"
                placeholder="FR 1234"
              ></AddFlightsInput>
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Linia lotnicza</CustomLabel>
              <AddFlightsInput
                type="text"
                placeholder="Enter Air"
                onChange={(e) =>
                  setPreFlightData({
                    ...preFlightData,
                    flightNumber: e.target.value,
                  })
                }
              ></AddFlightsInput>
            </DivContainerWithLabel>
          </AddFlightsDivRow>
          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Data odlotu</CustomLabel>
              <AddFlightsInput
                type="text"
                placeholder="15.07.2024"
                onChange={(e) =>
                  setPreFlightData({
                    ...preFlightData,
                    flightDateDeparture: e.target.value,
                  })
                }
              ></AddFlightsInput>
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Godzina odlotu</CustomLabel>
              <AddFlightsInput
                type="text"
                placeholder="17:15"
              ></AddFlightsInput>
            </DivContainerWithLabel>
          </AddFlightsDivRow>
          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Data przylotu</CustomLabel>
              <AddFlightsInput
                type="text"
                placeholder="15.07.2024"
              ></AddFlightsInput>
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Godzina przylotu</CustomLabel>
              <AddFlightsInput
                type="text"
                placeholder="22:45"
              ></AddFlightsInput>
            </DivContainerWithLabel>
          </AddFlightsDivRow>
          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Kod ICAO lotniska odlotu</CustomLabel>
              <AddFlightsInput type="text" placeholder="EPWA"></AddFlightsInput>
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Kod IATA lotniska odlotu</CustomLabel>
              <AddFlightsInput type="text" placeholder="WAW"></AddFlightsInput>
            </DivContainerWithLabel>
          </AddFlightsDivRow>
          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Kod ICAO lotniska przylotu</CustomLabel>
              <AirportSearchInput
                placeholder="Wpisz kod ICAO lub nazwę lotniska"
                onChange={(e) => {

                  setPreFlightData({
                    ...preFlightData,
                    flightDepartureICAO: e.target.value,
                  });
                }}
                onAirportSelect={(airport) => {

                  setPreFlightData({
                    ...preFlightData,
                    flightDepartureICAO: airport.icao,
                  });
                }}
                airports={airports}
              />

            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Kod IATA lotniska przylotu</CustomLabel>
              <AirportSearchInput
                placeholder="Wpisz kod IATA lub nazwę lotniska"
                onAirportSelect={(airport) => handleAirportSelect(airport, "IATA przylotu")}
                airports={airports}
                type="text"

                onChange={(e) =>
                  setPreFlightData({
                    ...preFlightData,
                    flightArrivalIATA: e.target.value,
                  })
                }
              />
            </DivContainerWithLabel>
          </AddFlightsDivRow>
          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Czas lotu</CustomLabel>
              <AddFlightsInput type="text" placeholder="3:45"></AddFlightsInput>
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Jakie opóźnienie?</CustomLabel>
              <AddFlightsInput type="text" placeholder="0:30"></AddFlightsInput>
            </DivContainerWithLabel>
          </AddFlightsDivRow>
          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Numer miejsca</CustomLabel>
              <AddFlightsInput type="text" placeholder="7A"></AddFlightsInput>
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Rejestracja samolotu</CustomLabel>
              <AddFlightsInput
                type="text"
                placeholder="SP-RSX"
              ></AddFlightsInput>
            </DivContainerWithLabel>
          </AddFlightsDivRow>
          <AddFlightsDivRow>
            <DivContainerWithLabel>
              <CustomLabel>Dodatkowe informacje</CustomLabel>
              <AddFlightsInput
                type="text"
                placeholder="Silne turbulencje"
              ></AddFlightsInput>
            </DivContainerWithLabel>
            <DivContainerWithLabel>
              <CustomLabel>Typ samolotu</CustomLabel>
              <AddFlightsInput
                type="text"
                placeholder="Boeing 737-8AS"
              ></AddFlightsInput>
            </DivContainerWithLabel>
          </AddFlightsDivRow>
          <SubmitButton>Zapisz lot</SubmitButton>
        </AddFlightsDiv>
      </FlightsContent>

    </MainDiv>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 250px; /* szerokość navbaru */
  background-color: #f8f9fa;
  border-right: 1px solid #ddd;
  box-sizing: border-box;
  padding-top: 20px;
`;


const HeaderTitle = styled.div`
  font-size: 24px;
  margin-top: 45px;
`;

const MainDiv = styled.div`
  background-color: white;
  display: flex;
  min-height: 100vh;

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
  height: 100vh;

  @media (max-width: 500px) {
    margin: 50px;
  }
`;

const AddFlightsInput = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: block;
  width: 200px;
  background-color: #e2e8f0;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 1rem;
  padding-right: 1rem;
  line-height: 1.25;
  outline: none;

  &:focus {
    background-color: #ffffff;
    border-color: #a0aec0;
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  border: 1px solid #ccc;
  background-color: #fff;
  z-index: 10;
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
`;

const SuggestionItem = styled.li`
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px solid #eee;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 300px;
`;

const AddFlightsDivRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 20%;
  margin: 10px 20px;

@media (max-width: 500px) {
      flex-direction: column;
        width: 100%;
          margin: 0px;
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
  width: 100vw;
  margin: 0px 10px;
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
    box-shadow: 0 8px 9px -4px rgba(51, 45, 45, 0.2),
      0 4px 18px 0 rgba(51, 45, 45, 0.1);
  }
  &:focus {
    background-color: #1e3a8a;
    box-shadow: 0 8px 9px -4px rgba(51, 45, 45, 0.2),
      0 4px 18px 0 rgba(51, 45, 45, 0.1);
  }
  &:active {
    background-color: #1d4ed8;
    box-shadow: 0 8px 9px -4px rgba(51, 45, 45, 0.2),
      0 4px 18px 0 rgba(51, 45, 45, 0.1);
  }
`;