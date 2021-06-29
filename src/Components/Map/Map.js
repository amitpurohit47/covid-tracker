import React from "react";
import { Map as Leafletmap, TileLayer } from "react-leaflet";
import { showDataOnMap } from "../../utils/utils";
import "./Map.css";

function Map({ center, zoom, countries, caseType }) {
  return (
    <div className="map">
      <Leafletmap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      {showDataOnMap(countries,caseType)}
      </Leafletmap>
    </div>
  );
}

export default Map;