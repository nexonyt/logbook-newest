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

export const FlightsContent = styled.div`
height: 100vh;
overflow-y: auto; 
`

export default function Stats() {
    const [loty,setLoty] = useState();

    return (
        <MainDiv>
            <NavBar></NavBar>
            <FlightsContent>
            <p>Statystyki</p>
            </FlightsContent>        
        </MainDiv>
        
    )
}