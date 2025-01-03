import React, { useState } from "react";
import styled from "styled-components";

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
  width: 100%;
`;

const AirportSearchInput = ({ placeholder, onAirportSelect, airports }) => {
  const [query, setQuery] = useState("");
  const [filteredAirports, setFilteredAirports] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFilteredAirports([]);
      return;
    }
 if (value.length>=2) {

     const results = Object.values(airports).filter(
         (airport) =>
            (airport.iata && airport.iata.toLowerCase().includes(value.toLowerCase())) ||
         (airport.icao && airport.icao.toLowerCase().includes(value.toLowerCase())) ||
         (airport.name && airport.name.toLowerCase().includes(value.toLowerCase()))
        );
        
        setFilteredAirports(results);
    }
  };

  const handleSelectAirport = (airport) => {
    setQuery(`${airport.name} (${airport.iata}/${airport.icao})`);
    setFilteredAirports([]);
    onAirportSelect(airport); // Przekaż wybrane lotnisko do nadrzędnego komponentu
  };

  return (
    <InputWrapper>
      <AddFlightsInput
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        
      />
      {filteredAirports.length > 0 && (
        <SuggestionsList>
          {filteredAirports.map((airport) => (
            <SuggestionItem
              key={airport.icao}
              onClick={() => handleSelectAirport(airport)}
            >
              {airport.name}, {airport.iata}/{airport.icao}
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
    </InputWrapper>
  );
};

export default AirportSearchInput;
