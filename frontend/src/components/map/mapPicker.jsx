import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ value, onChange, readOnly }) {
  useMapEvents({
    click(e) {
      if (readOnly) return;
      onChange?.([e.latlng.lat, e.latlng.lng]);
    },
  });

  return value ? <Marker position={value} icon={markerIcon} /> : null;
}

function MapController({ value }) {
  const map = useMap();

  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 0);
    return () => clearTimeout(t);
  }, [map, value]);

  useEffect(() => {
    if (value?.length === 2) {
      map.setView(value, Math.max(map.getZoom(), 13), { animate: true });
    }
  }, [map, value]);

  return null;
}

export default function MapPicker({ value, onChange, readOnly = false }) {
  const center = [27.7172, 85.324]; // Kathmandu default

  return (
    <div className="h-75 w-full overflow-hidden rounded-lg">
      <MapContainer
        center={value?.length === 2 ? value : center}
        zoom={13}
        scrollWheelZoom={!readOnly}
        dragging={!readOnly}
        doubleClickZoom={!readOnly}
        boxZoom={!readOnly}
        keyboard={!readOnly}
        touchZoom={!readOnly}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker value={value} onChange={onChange} readOnly={readOnly} />
        <MapController value={value} />
      </MapContainer>
    </div>
  );
}
