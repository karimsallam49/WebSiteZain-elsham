import { Card } from "react-bootstrap";
import Categoryplaceholder from "../../assets/image/placeholder_image .png";
import { useNavigate } from "react-router-dom";
import type { CuisineDTO } from "../../DTO/CuisineDTO";
import { useAppSelector } from "../../Hooks/hooks";

const CuisineCard = ({ el }: { el: CuisineDTO }) => {
  const navigate = useNavigate();
    const {resturantdata}=useAppSelector((state)=>state.restaurantSettingsSlice)
  const ImageUrl= resturantdata?.base_urls.cuisine_image_url

  return (
    <Card
      className=" shadow-sm  overflow-hidden rounded-4"
      style={{
        cursor: "pointer",
        transition: "transform 0.3s ease",
      }}
      onClick={() =>
        navigate(`/CuisineProductsPage/${el.id}`, {
          state: { name: el.name, image: `${ImageUrl}/${el.image}` },
        })
      }
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={el.image ? `${ImageUrl}/${el.image}` : Categoryplaceholder}
          onError={(e) => (e.currentTarget.src = Categoryplaceholder)}
          className="w-100 object-fit-cover"
          style={{
            height: "140px", 
            objectFit: "cover",
          }}
        />

           <Card.Body className="text-center p-2"

          style={{
            fontWeight: "600",
            fontSize: "1.1rem",
            backdropFilter: "blur(2px)",
          }}
        >
          {el.name}
        </Card.Body>
      </div>
    </Card>
  );
};

export default CuisineCard;
