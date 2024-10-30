import React, { useState } from "react";
import styled from "styled-components";
import NavBar from "../components/Navbar";

const MainDiv = styled.div`
    background-color: white;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100vh;
`

const MainDivForFlightDetails = styled.div`
    display: flex;
    justify-content: center;
    border: 1px solid red;
    width: 100%;
    height: 80%;
`
export const FlightsContent = styled.div`
height: 100vh;
overflow-y: auto; 
width: 100%;
`

export default function Flights() {
    const [loty,setLoty] = useState();

    return (
        <MainDiv>
            <NavBar></NavBar>
            <FlightsContent>
            <MainDivForFlightDetails>
            <p>Loty</p>
            </MainDivForFlightDetails>
            </FlightsContent>        
        </MainDiv>
        
    )
}