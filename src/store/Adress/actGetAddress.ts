// src/store/Promo/actValidateCoupon.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AddressDTO } from "../../DTO/AdressDTO";
import { GetAdressURL } from "../../EndPoints/EndPoints";
import type { RootState } from "../store";

export const actGetadress = createAsyncThunk<
  AddressDTO[],
  void,
  { state: RootState }
>("GetAdress/fetch", async (_, { getState, rejectWithValue }) => {
  const { LanguageSlice, OTPauthconfigration, restaurantSettingsSlice } =
    getState() as RootState;
  const branchId = restaurantSettingsSlice.selectedBranch;

  try {
    // branch_id بيخلي الباك يرجع delivery_area الخاصة بالفرع المختار لكل عنوان
    const res = await axios.get(
      `${GetAdressURL}${branchId ? `&branch_id=${branchId}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${OTPauthconfigration.OTPToken}`,
          "Branch-id": `${branchId}`,
          "x-localization": LanguageSlice.currentLanguage || "en",
        },
      }
    );

    return res.data as AddressDTO[];
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return rejectWithValue(
      error?.response?.data || "حدث خطأ أثناء تحميل البيانات"
    );
  }
});
