// src/store/Promo/actValidateCoupon.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";
import type { CouponResponse } from "../../DTO/promoDTO";
import type { AddressDTO } from "../../DTO/AdressDTO";
import { AddAdressURL } from "../../EndPoints/EndPoints";

export const actAddadress = createAsyncThunk<
  AddressDTO,
 AddressDTO ,
  { state: RootState }
>("adress/add", async (body, { getState, rejectWithValue }: any) => {
  const { LanguageSlice, OTPauthconfigration,restaurantSettingsSlice } = getState() as RootState;
  const currentLanguage = LanguageSlice.currentLanguage;
  const accessToken = OTPauthconfigration.OTPToken;

  try {
    const res = await axios.post(AddAdressURL, body,{
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
