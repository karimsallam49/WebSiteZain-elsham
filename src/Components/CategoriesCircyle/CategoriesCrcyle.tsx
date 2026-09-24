import { memo } from "react";
import type { Category } from "../../DTO/CategoriesDTO";
// import { CategoryImg } from "../../EndPoints/EndPoints";

type categoriesProps = {
  records: Category;
};

const CategoriesCrcyleComponent = ({ records }: categoriesProps) => {
  return (
  
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div
          className="mb-2 bg-light rounded d-flex align-items-center justify-content-center"
          style={{
            width: "100%",
            maxWidth: "160px",
            height: "120px",
            border: "1px solid yellow",
          }}
        >
          <img
            src={`https://media-files.tryordersystem.com/menu/zainalsham/creating/689e5613691c1.jpeg`}
            alt={records.name}
            className="rounded"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        </div>
        <p className="text-center">مسحب دجاج</p>
      </div>
  );
};

export const CategoriesCrcyle = memo(CategoriesCrcyleComponent);
