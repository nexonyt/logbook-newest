import ReactCountryFlag from "react-country-flag";
import airportsData from "../data/airports.json";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
export default function UniqueAirports({ stats }) {
  const uniqueCountries = [
    ...new Set(
      stats.unique_airports.map((icao) => airportsData[icao]?.country).filter(Boolean)
    ),
  ];

  return (
    <StatCard>

      <StatHeader>
        <Globe size={18} /> Unikalne kraje wylotu i przylotu: {uniqueCountries.length}
      </StatHeader>
      <Divider />
      <CountryList
        as={motion.div}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.15, // odstęp czasowy między flagami (fala)
            },
          },
        }}
      >
        {uniqueCountries.map((country, index) => (
          <CountryFlag
            as={motion.div}
            key={index}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.9 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            data-tooltip={country}
          >
            <ReactCountryFlag
              countryCode={country}
              svg
              style={{ fontSize: "2em" }}
            />
          </CountryFlag>
        ))}
      </CountryList>

    </StatCard>
  );
}

const CountryList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
`;

const CountryFlag = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
  padding: 5px;
  background: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
  }

@media (min-width: 500px) {
  &::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: -30px;
    background: rgba(0, 0, 0, 0.75);
    color: #fff;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.8rem;
    white-space: nowrap;
    opacity: 0;
    transform: translateY(5px);
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  &:hover::after {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

const StatCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 150px;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0.5rem 0 1rem;
`;
