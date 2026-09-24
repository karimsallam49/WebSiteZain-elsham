// src/store/Promo/actValidateCoupon.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";
import {  UpdateUserInfoUrl } from "../../EndPoints/EndPoints";

export const actUpdateUser = createAsyncThunk<
any,
  any, 

  { state: RootState }
>("update/user", async (body, { getState, rejectWithValue }) => {
  const { LanguageSlice, OTPauthconfigration,restaurantSettingsSlice } = getState() as RootState;
  const currentLanguage = LanguageSlice.currentLanguage;
  const accessToken = OTPauthconfigration.OTPToken
  const Body={
    ...body,
    _method:"put"
  }

  try {
 const res = await axios.put(
  `${UpdateUserInfoUrl}`,
  Body, 
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Branch-id": restaurantSettingsSlice.selectedBranch,

        "Content-Type": "multipart/form-data",
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
