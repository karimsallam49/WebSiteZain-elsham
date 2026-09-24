import {
  ShoppingCart,
  Heart,
  Bell,

} from "lucide-react";
import { useAppSelector } from '../../Hooks/hooks';
import { Link } from 'react-router';

const HeaderLinks = () => {
  const { notificationsData } = useAppSelector((state) => state.notificationsSlice);
  const { wishlistData } = useAppSelector((state) => state.wishlistSlice);
  const { CartData } = useAppSelector((state) => state.cartSlice);

  return (
    <div
      className="d-flex align-items-center gap-3 position-relative"
      style={{ flex: 1, justifyContent: "flex-end",margin:"0 1rem" }}
    >

<div className="position-relative d-none d-lg-flex">
        <Link style={{ color: "gray" }} to="/cart">
          <ShoppingCart className="Grarcolor cursor-pointer" size={22} strokeWidth={1.6} />
        </Link>
        <span
          className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill"
          style={{
            fontSize: "9px",
            padding: "2px 4px",
            minWidth: "14px",
            minHeight: "14px",
          }}
        >
          {CartData.length}
        </span>
      </div>

     
      <div className="position-relative">
        <Link style={{ color: "gray" }} to="/wishlist">
          <Heart className="Grarcolor cursor-pointer" size={22} strokeWidth={1.6} />
        </Link>
        <span
          className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill"
          style={{
            fontSize: "9px",
            padding: "2px 4px",
            minWidth: "14px",
            minHeight: "14px",
          }}
        >
          {wishlistData?.total_size}
        </span>
      </div>

      
      <div className="position-relative">
        <Link style={{ color: "gray" }} to="/notifications">
          <Bell className="Grarcolor cursor-pointer" size={22} strokeWidth={1.6} />
        </Link>
        <span
          className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill"
          style={{
            fontSize: "9px",
            padding: "2px 4px",
            minWidth: "14px",
            minHeight: "14px",
          }}
        >
          {notificationsData?.length}
        </span>
      </div>

 
    </div>
  );
};

export default HeaderLinks;
