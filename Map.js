import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMAp, Marker, Popup } from "react-leaflet";
import { useState } from "react";
import { Box } from "@mui/material";
import { getPlaces } from "./CovidApi";
import L from "leaflet";
import "./styles/_map.scss";

function useRefEffect({ effect, ref = {} }) {
  useEffect(() => {
    effect(ref.current);
  }, [effect, ref]);
}

const Map = () => {
  const [pos, setPos] = useState([36.714805, 3.189095]);
  const mapRef = useRef();
  async function mapEffect({ target: map }) {
    let json = "";
    getPlaces().then((res) => {
      json = res;
      console.log(res);
      const geoJsonLayer = new L.GeoJSON(res, {
        pointToLayer: (feature, lating) => {
          const { properties } = feature;
          const { country, updated, cases, deaths, recovered, drapeau } =
            properties;
          let updatedFormat = 0;
          updatedFormat = new Date(updated).toLocaleString();
          const html = `<span class="icon-marker">
          <span class="icon-marker-tooltip">
            <h2>${country}</h2>
            <ul>
            <li><img src=${drapeau}  className="drapeau1"/></li>
              <li><strong>Confirmed:</strong> ${cases}</li>
              <li><strong>Deaths:</strong> ${deaths}</li>
              <li><strong>Recovered:</strong> ${recovered}</li>
              <li><strong>Last Update:</strong> ${updatedFormat}</li>
            </ul>
          </span>
          ${cases}
        </span> `;
          return L.marker(lating, {
            icon: L.divIcon({ className: "icon", html }),
            riseOnHover: true,
          });
        },
      });
      geoJsonLayer.addTo(map);
    });
  }

  useRefEffect({
    ref: mapRef,
    effect: mapEffect,
  });

  return (
    <Box>
      <MapContainer
        whenReady={(map) => (mapRef.current = map)}
        id="map"
        center={pos}
        zoom={3}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={pos}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default Map;
