// src/store/Promo/actValidateCoupon.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../store";
import type { CouponResponse } from "../../../DTO/promoDTO";

export const actGetCopoun = createAsyncThunk<
  CouponResponse,
  string, 
  { state: RootState }
>("promo/get", async (apiUrl, { getState, rejectWithValue }) => {
  const { LanguageSlice, OTPauthconfigration,restaurantSettingsSlice } = getState() as RootState;
  const currentLanguage = LanguageSlice.currentLanguage;
  const accessToken = OTPauthconfigration.OTPToken

  try {
    const res = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Branch-id": restaurantSettingsSlice.selectedBranch,
        "x-localization": currentLanguage || "en",
      },
    });

    return res.data as CouponResponse;
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return rejectWithValue(
      error?.response?.data || "حدث خطأ أثناء تحميل البيانات"
    );
  }
});
