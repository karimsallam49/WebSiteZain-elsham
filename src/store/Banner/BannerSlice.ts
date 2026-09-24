import { createSlice } from "@reduxjs/toolkit";
import { actBanner } from "./aCtBanner";
import type { BannerDTO } from "../../DTO/BannerDTO";

interface Bannerintialstate {
  BannerData: BannerDTO[]| null;
  BannerLoading: boolean;
  error: string | null;
}

const initialState: Bannerintialstate = {
  BannerData: null,
  BannerLoading: false,
  error: null,
};

const DeliveryFeeSlice = createSlice({
  name: "BannerSlice",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.BannerData = null;
      state.error = null;
      state.BannerLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actBanner.pending, (state) => {
        state.BannerLoading = true;
        state.error = null;
      })
      .addCase(actBanner.fulfilled, (state, action) => {
        state.BannerLoading = false;
        state.BannerData = action.payload;
      })
      .addCase(actBanner.rejected, (state, action) => {
        state.BannerLoading = false;
        state.error =
          (action.payload as string) || "حدث خطأ أثناء تحميل الإشعارات";
      });
  },
});

export const { clearNotifications } = DeliveryFeeSlice.actions;
export default DeliveryFeeSlice.reducer;
