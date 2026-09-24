import type { wishListDTO } from "../../DTO/wishListDTO";
import { WishListUrl } from "../../EndPoints/EndPoints";
import { createAppAsyncThunk } from "../FetchData/FetchData";


export const actWishList = createAppAsyncThunk<wishListDTO>(
  "actWishList/fetch",
  WishListUrl
);
