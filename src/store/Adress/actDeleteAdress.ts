// src/store/Promo/actValidateCoupon.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";
import { DeleteAdress } from "../../EndPoints/EndPoints";

export const actDeleteadress = createAsyncThunk<
any,
  string, 
  { state: RootState }
>("delete/adress", async (code, { getState, rejectWithValue }) => {
  const { LanguageSlice, OTPauthconfigration,restaurantSettingsSlice } = getState() as RootState;
  const currentLanguage = LanguageSlice.currentLanguage;
  const accessToken = OTPauthconfigration.OTPToken
console.log(accessToken);

  try {
    const res = await axios.delete(`${DeleteAdress}address_id=${code}`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Branch-id": restaurantSettingsSlice.selectedBranch,
        "x-localization": currentLanguage || "en",
      },
    });

    return res.data;
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return rejectWithValue(
      error?.response?.data || "حدث خطأ أثناء تحميل البيانات"
    );
  }
});
