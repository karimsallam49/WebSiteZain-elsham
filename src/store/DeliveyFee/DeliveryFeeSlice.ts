import { createSlice } from "@reduxjs/toolkit";
import { actDeliveryFee } from "./DeliveryFee";
import type { BranchDeliveryChargeResponse } from "../../DTO/DeliveryFeeDTO";

interface DeliveryFeeintial {
  deliverfeeData: BranchDeliveryChargeResponse| null;
  loading: boolean;
  error: string | null;
}

const initialState: DeliveryFeeintial = {
  deliverfeeData: null,
  loading: false,
  error: null,
};

const DeliveryFeeSlice = createSlice({
  name: "DeliveryFee",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.deliverfeeData = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeliveryFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actDeliveryFee.fulfilled, (state, action) => {
        state.loading = false;
        state.deliverfeeData = action.payload;
      })
      .addCase(actDeliveryFee.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "حدث خطأ أثناء تحميل الإشعارات";
      });
  },
});

export const { clearNotifications } = DeliveryFeeSlice.actions;
export default DeliveryFeeSlice.reducer;
