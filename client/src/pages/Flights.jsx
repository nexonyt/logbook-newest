import React, { useState } from "react";
import styled from "styled-components";
import NavBar from "../components/Navbar";
import { FlightsContent } from "../styles";

const MainDiv = styled.div`
    background-color: white;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100vh;
`

export default function Flights() {
    const [loty,setLoty] = useState();

    return (
        <MainDiv>
            <NavBar></NavBar>
            <FlightsContent>
            <p>Loty</p>
            </FlightsContent>        
        </MainDiv>
        
    )
}