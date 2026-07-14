import React, { useState } from "react";
import styled from "styled-components";

const AddFlightsInput = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: block;
  width: 100%;
  background-color: #ffffff;
  color: #1e293b;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  line-height: 1.25;
  outline: none;
  box-sizing: border-box;
  font-size: 0.95rem;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 48px;
  left: 0;
  width: 100%;
  border: 1px solid #e2e8f0;
  background-color: #fff;
  z-index: 20;
  list-style: none;
  margin: 0.25rem 0 0 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const SuggestionItem = styled.li`
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
  color: #334155;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8fafc;
    color: #3b82f6;
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
