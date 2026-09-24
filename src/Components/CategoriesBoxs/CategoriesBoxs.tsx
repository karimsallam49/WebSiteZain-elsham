import { useMemo } from "react";
import Categoryplaceholder from "../../assets/BackGround.png";
import { useNavigate } from "react-router-dom";
import "./Categoriesstyle.css";
import { SectionName } from "../SectionName/SectionName";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../Hooks/hooks";
import cuisinepic from "../../assets/image/cuisine.png";
const CategoriesBoxs = () => {
  const { categories } = useAppSelector((state)=>state.CategoriesSlice);
  
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const data = useMemo(
    () => categories.filter((cat) => cat.parent_id === 0),
    [categories]
  );

  return (
    <div className="w-100 text-start position-relative">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <SectionName title={t("All-Categories")} />
      <button
  className="btn btn-link text-decoration-none text-dark fw-semibold d-flex align-items-center gap-2"
  onClick={() => navigate("/cuisine")}
style={{ fontSize: "medium" }}
>
  <img src={cuisinepic} alt="Cuisine" style={{ width: 18, height: 18 }} />
  {t("seeByCuisine")}
</button>
      </div>

      <div className="row g-3 p-2"> 
        {data &&
          data.map((el) => (
            <div
              key={el.id}
              className="col-3 col-md-3 col-lg-3" 
              onClick={() => navigate(`/category/${el.id}/${el.name}`)}
            >
              <div className="categorybox-item">
                <img
                  src={el.image_full_path || Categoryplaceholder}
                  alt={el.name}
                  onError={(e) => (e.currentTarget.src = Categoryplaceholder)}
                  className="categorybox-img w-100 h-100 object-fit-cover"
                />
                <div className="categorybox-overlay w-100 align-items-center justify-content-center d-flex">
                 {el.name}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoriesBoxs;
