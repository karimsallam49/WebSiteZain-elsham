// src/store/Promo/actValidateCoupon.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";
import { CancellOrderURl } from "../../EndPoints/EndPoints";

export const actCancellOrde = createAsyncThunk<
any,
  string, 

  { state: RootState }
>("cancell/order", async (code, { getState, rejectWithValue }) => {
  const { LanguageSlice, OTPauthconfigration,restaurantSettingsSlice } = getState() as RootState;
  const currentLanguage = LanguageSlice.currentLanguage;
  const accessToken = OTPauthconfigration.OTPToken
  const Body={
    order_id:`${code}`,
    _method:"put"
  }

  try {
 const res = await axios.put(
  `${CancellOrderURl}`,
  Body, 
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Branch-id": restaurantSettingsSlice.selectedBranch,

      "x-localization": currentLanguage || "en",
    },
  }
)

    return res.data;
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return rejectWithValue(
      error?.response?.data || "حدث خطأ أثناء تحميل البيانات"
    );
  }
});
