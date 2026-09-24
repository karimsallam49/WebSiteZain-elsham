import { useNavigate } from "react-router-dom";
import "./Categoriesstyle.css";
import { SectionName } from "../../Components/SectionName/SectionName";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../Hooks/hooks";
import { useFetch } from "../../Hooks/useFetch";
import { cuisineListUrl } from "../../EndPoints/EndPoints";
import type { CuisineDTO } from "../../DTO/CuisineDTO";
import CuisineCard from "../../Components/CuisineCard/CuisineCard";
import { Col, Row } from "react-bootstrap";

const AllCuisinePage = () => {
    const {currentLanguage}=useAppSelector((state)=>state.LanguageSlice)
    const {data}=useFetch<CuisineDTO[] >(currentLanguage,cuisineListUrl)
  const navigate = useNavigate();


  const { t } = useTranslation();
  return (
    <div className="container py-3 cuisine-page">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <SectionName title={t("All-cuisine")} />
        <button
          className="btn btn-link text-decoration-none fw-semibold"
          onClick={() => navigate(-1)}
        >
          ← 
        </button>
      </div>

   <div className="categoriesbox-wrappe container">
      <Row className="g-3">
        {data &&
          data.map((el) => (
            <Col
              key={el.id}
              xs={6}   
              sm={6}
              md={4}  
              lg={3}   
            >
              <CuisineCard el={el} />
            </Col>
          ))}
      </Row>
    </div>
    </div>
  );
};

export default AllCuisinePage;
