import { createSlice } from "@reduxjs/toolkit";
import type { wishListDTO } from "../../DTO/wishListDTO";
import { actWishList } from "./actWishList";

interface WishListState {
  wishlistData: wishListDTO | null;
  loading: boolean;
  error: string | null;
}

const initialState: WishListState = {
  wishlistData: null,
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearwishlist: (state) => {
      state.wishlistData = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actWishList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actWishList.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistData = action.payload;
      })
      .addCase(actWishList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "حدث خطأ أثناء تحميل الإشعارات";
      });
  },
});

export const { clearwishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
