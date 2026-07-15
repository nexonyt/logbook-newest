import React, { useState, useEffect, useRef } from "react";
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
  z-index: 50;
  list-style: none;
  margin: 0.25rem 0 0 0;
  padding: 0;
  max-height: 220px;
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const SuggestionItem = styled.li`
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.85rem;
  color: #334155;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8fafc;
    color: #3b82f6;
  }

  strong {
    color: #0f172a;
    font-weight: 700;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const AirportSearchInput = ({ placeholder, onAirportSelect, airports, value, onChange }) => {
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close suggestions when user clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (event) => {
    const val = event.target.value;
    onChange(val);
    setIsOpen(true);

    if (val.trim() === "") {
      setFilteredAirports([]);
      return;
    }

    if (val.length >= 2) {
      const results = Object.values(airports).filter(
        (airport) =>
          (airport.iata && airport.iata.toLowerCase().includes(val.toLowerCase())) ||
          (airport.icao && airport.icao.toLowerCase().includes(val.toLowerCase())) ||
          (airport.name && airport.name.toLowerCase().includes(val.toLowerCase())) ||
          (airport.city && airport.city.toLowerCase().includes(val.toLowerCase())) ||
          (airport.country && airport.country.toLowerCase().includes(val.toLowerCase()))
      );
      
      // Limit to 10 items for maximum performance and neat visual layout
      setFilteredAirports(results.slice(0, 10));
    } else {
      setFilteredAirports([]);
    }
  };

  const handleSelectAirport = (airport) => {
    const displayValue = `${airport.name} (${airport.iata || "---"}/${airport.icao})`;
    onChange(displayValue);
    setFilteredAirports([]);
    setIsOpen(false);
    onAirportSelect(airport);
  };

  return (
    <InputWrapper ref={containerRef}>
      <AddFlightsInput
        type="text"
        placeholder={placeholder}
        value={value || ""}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && filteredAirports.length > 0 && (
        <SuggestionsList>
          {filteredAirports.map((airport) => (
            <SuggestionItem
              key={airport.icao}
              onClick={() => handleSelectAirport(airport)}
            >
              <strong>{airport.icao} / {airport.iata || "---"}</strong> - {airport.name} ({airport.city}, {airport.country})
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
    </InputWrapper>
  );
};

export default AirportSearchInput;
