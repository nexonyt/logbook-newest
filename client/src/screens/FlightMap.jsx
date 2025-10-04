import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function FlightMap({ flights }) {
  if (!flights || flights.length === 0) {
    return <p>Brak danych o lotach</p>;
  }

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {flights.map((flight, index) => {
        const from = flight.from?.lat && flight.from?.lng ? [flight.from.lat, flight.from.lng] : null;
        const to = flight.to?.lat && flight.to?.lng ? [flight.to.lat, flight.to.lng] : null;

        if (!from || !to) {
          console.warn(`Lot nr ${index} ma niekompletne dane:`, flight);
          return null; // pomijamy błędny wpis
        }

        return (
          <React.Fragment key={index}>
            <Marker position={from}>
              <Popup>
                Start: {flight.from.city}, {flight.from.country}
              </Popup>
            </Marker>

            <Marker position={to}>
              <Popup>
                Cel: {flight.to.city}, {flight.to.country}
              </Popup>
            </Marker>

            <Polyline positions={[from, to]} color="blue" />
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
}
