import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({ value, onChange }) {
  const [position, setPosition] = useState(
    value?.lat && value?.lng ? value : null,
  );

  useEffect(() => {
    if (value?.lat && value?.lng) {
      setPosition(value);
    }
  }, [value]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onChange?.(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function MapPicker({ onSelect, value }) {
  const defaultPosition = [21.3891, 39.8579];

  const center =
    value?.lat && value?.lng
      ? [Number(value.lat), Number(value.lng)]
      : defaultPosition;

  return (
    <div style={{ height: 320, borderRadius: 14, overflow: "hidden" }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker value={value} onChange={onSelect} />
      </MapContainer>
    </div>
  );
}
