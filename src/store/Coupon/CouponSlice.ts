import { createSlice } from "@reduxjs/toolkit";
import type { CouponDTO,CouponResponse } from "../../DTO/promoDTO";
import { actValidateCoupon } from "./actgetcoupon/actValidateCoupon";
import { actGetCopoun } from "./actgetcoupon/actgetcoupon";

interface CouponinitialState {
  CouponVerifyData: CouponDTO | null;
  CouponData: CouponResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: CouponinitialState = {
  CouponVerifyData: null,
  CouponData: null,
  loading: false,
  error: null,
};

const CouponSlice = createSlice({
  name: "Coupon",
  initialState,
  reducers: {
    clearCoupon: (state) => {
      state.CouponVerifyData = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actValidateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actValidateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.CouponVerifyData = action.payload;
      })
      .addCase(actValidateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "حدث خطأ أثناء تحميل الإشعارات";
      });
    builder
      .addCase(actGetCopoun.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetCopoun.fulfilled, (state, action) => {
        state.loading = false;
        state.CouponData = action.payload;
      })
      .addCase(actGetCopoun.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "حدث خطأ أثناء تحميل الإشعارات";
      });
  },
});

export const { clearCoupon } = CouponSlice.actions;
export default CouponSlice.reducer;
