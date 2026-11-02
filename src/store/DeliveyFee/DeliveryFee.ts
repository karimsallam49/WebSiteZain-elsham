import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { BranchDeliveryChargeResponse } from "../../DTO/DeliveryFeeDTO";
import { DeliveriinfoUrl } from "../../EndPoints/EndPoints";
import type { RootState } from "../store";

export const actDeliveryFee = createAsyncThunk<
  BranchDeliveryChargeResponse,
  void,
  { state: RootState }
>("DeliveryFee/fetch", async (_, { getState, rejectWithValue }) => {
  const { LanguageSlice, OTPauthconfigration, restaurantSettingsSlice } =
    getState() as RootState;
  const branchId = restaurantSettingsSlice.selectedBranch ?? 1;

  try {
    const res = await axios.get(`${DeliveriinfoUrl}${branchId}`, {
      headers: {
        Authorization: `Bearer ${OTPauthconfigration.OTPToken}`,
        "Branch-id": `${branchId}`,
        "x-localization": LanguageSlice.currentLanguage || "en",
      },
    });

    return res.data as BranchDeliveryChargeResponse;
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return rejectWithValue(
      error?.response?.data || "حدث خطأ أثناء تحميل البيانات"
    );
  }
});
