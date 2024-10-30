import { toast } from 'react-toastify';
import styled from "styled-components";
import NavBar from "../components/Navbar";
import axios from 'axios';
import React, { useState,useEffect } from "react";

const MainDiv = styled.div`
    background-color: white;
    display: flex;
    align-items: center;
    width: 100%;
    height: 
    100vh;
`
const FlightsContent = styled.div`
 display: flex;
 justify-content: center;
 align-items: center;
height: 100vh;
overflow-y: auto; 
width: 100%;
`

const AddFlightsDiv = styled.div`
  display: flex;
 justify-content: center;
 align-items: center;
    width: 80%;
    height: 90%;
    border: 1px solid red;
 `

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
  fliAircraftType: ""
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
  fliAircraftType: ""
});


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
    fliAircraftType: preFlightData.fliAircraftType
  };
  axios.post("/addflightquery", flightData).then((response) => {
    if (response.status = 200) {
      toast.success('Dane zostały pomyślnie zapisane!')

      setPreFlightData(initialPreFlightData)
    }
  }).catch((err) => {
    toast.error(err.response.data)

  })
};

    const [loty, setLoty] = useState();

    return (
        <MainDiv>
            <NavBar></NavBar>
            <FlightsContent>
                <AddFlightsDiv>
                    <p>Dodaj lot</p>
                </AddFlightsDiv>
            </FlightsContent>
        </MainDiv>

    )
}