import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { LocateFixed } from "lucide-react";
import { Spinner } from "react-bootstrap";
import L, { reverseGeocode } from "../../utilities/leaflet";
import i18n from "../../i18n";

interface GoogleMapProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number, address?: string) => void;
}

const GoogleMapComponent = ({ lat, lng, onLocationChange }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const onLocationChangeRef = useRef(onLocationChange);
  onLocationChangeRef.current = onLocationChange;

  const [locating, setLocating] = useState(false);

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newLat = pos.coords.latitude;
        const newLng = pos.coords.longitude;

        markerRef.current?.setLatLng([newLat, newLng]);
        mapInstance.current?.setView([newLat, newLng], 17);

        const address = await reverseGeocode(newLat, newLng);
        onLocationChangeRef.current(newLat, newLng, address);
        setLocating(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocating(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([lat, lng], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);

    const updateLocation = async (newLat: number, newLng: number) => {
      marker.setLatLng([newLat, newLng]);
      map.panTo([newLat, newLng]);
      const address = await reverseGeocode(newLat, newLng);
      onLocationChangeRef.current(newLat, newLng, address);
    };

    map.on("click", (e: L.LeafletMouseEvent) => {
      updateLocation(e.latlng.lat, e.latlng.lng);
    });

    marker.on("dragend", () => {
      const position = marker.getLatLng();
      updateLocation(position.lat, position.lng);
    });

    mapInstance.current = map;
    markerRef.current = marker;

    handleLocateMe();

    return () => {
      map.remove();
      mapInstance.current = null;
      markerRef.current = null;
    };
  }, [handleLocateMe]);

  useEffect(() => {
    if (!mapInstance.current || !markerRef.current) return;
    markerRef.current.setLatLng([lat, lng]);
    mapInstance.current.panTo([lat, lng]);
  }, [lat, lng]);

  const handleSearch = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const query = searchRef.current?.value;
    if (!query) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();

      if (data.length > 0) {
        const place = data[0];
        const newLat = parseFloat(place.lat);
        const newLng = parseFloat(place.lon);

        markerRef.current?.setLatLng([newLat, newLng]);
        mapInstance.current?.setView([newLat, newLng], 15);

        const address =
          place.display_name ?? (await reverseGeocode(newLat, newLng));
        onLocationChangeRef.current(newLat, newLng, address);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        ref={searchRef}
        type="text"
        onKeyDown={handleSearch}
        placeholder={
          i18n.language === "ar"
            ? "ابحث عن موقعك هنا"
            : "Search your location here"
        }
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          width: "75%",
          maxWidth: "350px",
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          outline: "none",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      />
      <button
        type="button"
        onClick={handleLocateMe}
        disabled={locating}
        title={
          i18n.language === "ar" ? "موقعي الحالي" : "My current location"
        }
        style={{
          position: "absolute",
          bottom: "15px",
          right: "10px",
          zIndex: 1000,
          width: "38px",
          height: "38px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          background: "#fff",
          cursor: locating ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        {locating ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <LocateFixed size={18} />
        )}
      </button>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "300px",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      />
    </div>
  );
};

export default GoogleMapComponent;
