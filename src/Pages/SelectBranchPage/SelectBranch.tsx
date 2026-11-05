import { useState } from "react";
import { useAppSelector } from "../../Hooks/hooks";
import { Link } from "react-router-dom";
import "./SelectBranch.css";
import { useTranslation } from "react-i18next";
import type { Branch } from "../../DTO/HeaderDTO";
import BranchGoogleMap from "../../Components/BranchGoogleMap/BranchGoogleMap";
import { ChevronRight, Clock, MapPin } from "lucide-react";

const SelectBranch = () => {
  const { t } = useTranslation();
  const { resturantdata } = useAppSelector((state) => state.restaurantSettingsSlice);
  const BranchesData = resturantdata?.branches || [];
  const BranchUrl = resturantdata?.base_urls.branch_image_url;

  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [view, setView] = useState<"list" | "map">("list");

  const handleSelectBranch = (id: number) => {
    setSelectedBranchId(id);
    const branch = resturantdata?.branches.find((b) => b.id === id) || null;
    setSelectedBranch(branch);
    setView("map");
  };

  return (
    <div className="sb-page">
      {view === "list" && (
        <>
          <div className="v2-rail-head sb-head">
            <Link to="/" className="sb-back" aria-label="back">
              <ChevronRight size={18} />
            </Link>
            <h2 className="v2-rail-title">
              {t("SelectBranch.select_branch", "اختار الفرع")}
            </h2>
          </div>

          <div className="sb-grid">
            {BranchesData.map((branch) => (
              <button
                key={branch.id}
                type="button"
                className={`sb-card ${
                  selectedBranchId === branch.id ? "selected" : ""
                }`}
                onClick={() => handleSelectBranch(branch.id)}
              >
                <div className="sb-img">
                  <img
                    src={`${BranchUrl}/${branch.image}`}
                    alt={branch.name}
                    loading="lazy"
                  />
                </div>
                <div className="sb-body">
                  <strong className="sb-name">{branch.name}</strong>
                  <span className="sb-addr">
                    <MapPin size={12} />
                    {branch.address}
                  </span>
                  <span className="sb-time">
                    <Clock size={12} />
                    {branch.preparation_time}{" "}
                    {t("SelectBranch.preparation_time")}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {view === "map" && selectedBranch && (
        <>
          <button className="sb-back-btn" onClick={() => setView("list")}>
            <ChevronRight size={16} /> {t("back", "رجوع")}
          </button>
          <BranchGoogleMap
            branches={BranchesData}
            selectedBranchId={selectedBranchId}
            branchImageUrl={BranchUrl}
            onSelectBranch={(branch) => {
              setSelectedBranch(branch);
              setSelectedBranchId(branch.id);
            }}
          />
        </>
      )}
    </div>
  );
};

export default SelectBranch;
