import { useState } from "react";
import { Card, Button } from "react-bootstrap";
import {  useAppSelector } from "../../Hooks/hooks";
import { Link } from "react-router-dom";
import "./SelectBranch.css";
import { useTranslation } from "react-i18next";
import type { Branch } from "../../DTO/HeaderDTO";
import BranchGoogleMap from "../../Components/BranchGoogleMap/BranchGoogleMap";
import { ChevronRight } from "lucide-react";

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
    <div className="container py-3 select-branch-page">
      {view === "list" && (
        <>
         <Link
                    to="/"
                    className="position-fixed z-3 top-0 start-0 m-3 text-white bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "35px", height: "35px" }}
                    >
                            <ChevronRight size={20} style={{ transform: "rotate(180deg)" }} />
                          </Link>
          <div className="row g-3 mb-4">
            {BranchesData.map((branch) => (
              <div key={branch.id} className="col-12 col-md-6 col-lg-4">
                <Card
                  className={`branch-card h-100 shadow-sm border-0 ${
                    selectedBranchId === branch.id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectBranch(branch.id)}
                >
                  <div className="branch-img-wrapper">
                    <Card.Img
                      variant="top"
                      src={`${BranchUrl}/${branch.image}`}
                      className="branch-img"
                      alt={branch.name}
                    />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="fw-bold">{branch.name}</Card.Title>
                    <Card.Text className="text-muted small mb-2">
                      {branch.address}
                    </Card.Text>
                    <div className="text-secondary small">
                      ⏱️ {branch.preparation_time}{" "}
                      {t("SelectBranch.preparation_time")}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>

          
          {/* <div className="text-center">
            <Button
              onClick={handleGoHome}
              disabled={!selectedBranchId}
              className="go-home-btn"
            >
              {t("SelectBranch.select_branch")}
            </Button>
          </div> */}
        </>
      )}

      
      {view === "map" && selectedBranch && (
        <>
          <Button
            className="btn btn-secondary mb-3"
            onClick={() => setView("list")}
          >
            ← Back
          </Button>

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
