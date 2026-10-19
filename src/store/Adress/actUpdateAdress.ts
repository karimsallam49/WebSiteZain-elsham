import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";
import type { AddressDTO } from "../../DTO/AdressDTO";
import { UpdateAdressURL } from "../../EndPoints/EndPoints";

interface UpdateAdressPayload {
  id: number;
  body: AddressDTO;
}

export const actUpdateAdress = createAsyncThunk<
  AddressDTO,
  UpdateAdressPayload,
  { state: RootState }
>("adress/update", async ({ id, body }, { getState, rejectWithValue }: any) => {
  const { LanguageSlice, OTPauthconfigration, restaurantSettingsSlice } =
    getState() as RootState;
  const currentLanguage = LanguageSlice.currentLanguage;
  const accessToken = OTPauthconfigration.OTPToken;

  try {
    const res = await axios.put(`${UpdateAdressURL}${id}`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Branch-id": restaurantSettingsSlice.selectedBranch,
        "x-localization": currentLanguage || "en",
      },
    });

    return res.data as AddressDTO;
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return rejectWithValue(
      error?.response?.data || "حدث خطأ أثناء تحميل البيانات"
    );
  }
});
