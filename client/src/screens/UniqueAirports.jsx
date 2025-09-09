import ReactCountryFlag from "react-country-flag";
import airportsData from "../data/airports.json";

export default function UniqueAirports({ stats }) {
  // Wyciągamy unikalne kody krajów
  const uniqueCountries = [
    ...new Set(
      stats.unique_airports.map((icao) => airportsData[icao]?.country).filter(Boolean)
    ),
  ];

  return (
    <div>
      <h3>
        Unikalne kraje wylotu i przylotu: {uniqueCountries.length}
      </h3>
      <p>
        {uniqueCountries.map((country, index) => (
          <span key={index} style={{ marginRight: "8px" }}>
            <ReactCountryFlag
              countryCode={country}
              svg
              style={{ fontSize: "2em" }}
            />
          </span>
        ))}
      </p>
    </div>
  );
}
