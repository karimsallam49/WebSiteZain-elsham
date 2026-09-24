import { useEffect, useRef } from "react";
import L from "../../utilities/leaflet";
import type { Branch } from "../../DTO/CongigDTO";

interface GoogleMapProps {
  branches: Branch[];
  branchImageUrl?: string;
  selectedBranchId: number | null;
  onSelectBranch: (branch: Branch) => void;
}

const DEFAULT_CENTER: [number, number] = [30.0444, 31.2357];

const BranchGoogleMap = ({
  branches,
  branchImageUrl,
  selectedBranchId,
  onSelectBranch,
}: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const onSelectBranchRef = useRef(onSelectBranch);
  onSelectBranchRef.current = onSelectBranch;

  const selectedBranch =
    branches.find((b) => b.id === selectedBranchId) || null;

  // Initialize Map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView(DEFAULT_CENTER, 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Render a marker for every branch
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = branches
      .filter(
        (b) => !isNaN(Number(b.latitude)) && !isNaN(Number(b.longitude))
      )
      .map((branch) => {
        const marker = L.marker([
          Number(branch.latitude),
          Number(branch.longitude),
        ])
          .addTo(map)
          .bindPopup(branch.name);
        marker.on("click", () => onSelectBranchRef.current(branch));
        return marker;
      });

    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.2));
    }
  }, [branches]);

  useEffect(() => {
    if (!selectedBranch || !mapInstance.current) return;

    const lat = Number(selectedBranch.latitude);
    const lng = Number(selectedBranch.longitude);

    mapInstance.current.setView([lat, lng], 14);
  }, [selectedBranch]);

  return (
    <div style={{ position: "relative", width: "100%", height: "80vh" }}>
    
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "12px",
        }}
      />

      <div
        className="branch-cards-overlay"
        style={{
          position: "absolute",
          bottom: "15px",
          left: "0",
          width: "100%",
          padding: "0 10px",
          overflowX: "auto",
          whiteSpace: "nowrap",
          display: "flex",
          gap: "10px",
          zIndex: 999,
        }}
      >
        {branches.map((branch) => (
          <div
            key={branch.id}
            onClick={() => onSelectBranch(branch)}
            style={{
              width: "140px",
              maxWidth: "140px",
              background: "#fff",
              borderRadius: "10px",
              padding: "8px",
              cursor: "pointer",
              border:
                selectedBranchId === branch.id
                  ? "2px solid #0d6efd"
                  : "2px solid transparent",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            {branch.image && (
              <img
                src={`${branchImageUrl}/${branch.image}`}
                alt={branch.name}
                style={{
                  width: "100%",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "5px",
                }}
              />
            )}

            <div style={{ fontSize: "13px", fontWeight: 600 }}>
              {branch.name}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#777",
                marginTop: "3px",
                width: "90%",
                  overflow: "hidden",    
                whiteSpace: "nowrap", 
                textOverflow:"ellipsis"
              }}
            >
              {branch.address}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchGoogleMap;
