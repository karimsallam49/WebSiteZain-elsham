import { useMemo } from "react";
import Categoryplaceholder from "../../assets/BackGround.png";
import { useNavigate } from "react-router-dom";
import "./Categoriesstyle.css";
import { SectionName } from "../../Components/SectionName/SectionName";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../Hooks/hooks";

const AllCategoriesPage = () => {
  const { categories} = useAppSelector((state)=>state.CategoriesSlice);
  const navigate = useNavigate();

  const data = useMemo(
    () => categories.filter((cat) => cat.parent_id === 0),
    [categories]
  );
  const { t } = useTranslation();
  return (
    <div className="container py-3 all-categories-page">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <SectionName title={t("All-Categories")} />
        <button
          className="btn btn-link text-decoration-none fw-semibold"
          onClick={() => navigate(-1)}
        >
          ← 
        </button>
      </div>

      <div className="categoriesbox-wrappper">
        {data &&
          data.map((el) => (
            <div
              onClick={() => navigate(`/category/${el.id}/${el.name}`)}
              key={el.id}
              className="categorybox-item"
            >
              <img
                src={el.banner_image_full_path || Categoryplaceholder}
                alt={el.name}
                onError={(e) => (e.currentTarget.src = Categoryplaceholder)}
                className="categorybox-img w-100 h-100 object-fit-cover"
              />
              <div className="categorybox-overlay">
                <span>{el.name}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllCategoriesPage;
