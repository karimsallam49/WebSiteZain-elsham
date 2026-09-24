import { createSlice } from "@reduxjs/toolkit";
import { actAddadress } from "./actAddAdress";
import type { AddressDTO } from "../../DTO/AdressDTO";
import { actGetadress } from "./actGetAddress";

interface Adressintial {
  AdressData: AddressDTO []| null;
  selectedAdress:AddressDTO|null,
  editeAdress:AddressDTO|null,
  loading: boolean;
  error: string | null;
}

const initialState: Adressintial = {
  AdressData: null,
  editeAdress:null,
  selectedAdress:null,
  loading: false,
  error: null,
};

const CouponSlice = createSlice({
  name: "Adress",
  initialState,
  reducers: {
    clearadress: (state) => {
      state.AdressData = null;
      state.error = null;
      state.loading = false;
    },
    addadress: (state,action) => {
    state.selectedAdress = action.payload;
       state.error = null;
      state.loading = false;
    },
    editeAdressAction: (state,action) => {
    state.editeAdress = action.payload;
       state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actAddadress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actAddadress.fulfilled, (state) => {
        state.loading = false;
       
      })
      .addCase(actAddadress.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "حدث خطأ أثناء تحميل الإشعارات";
      });
    builder
      .addCase(actGetadress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetadress.fulfilled, (state,action) => {
        state.AdressData=action.payload
        state.loading = false;
       
      })
      .addCase(actGetadress.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "حدث خطأ أثناء تحميل الإشعارات";
      });
   
  },
});

export const { clearadress,addadress,editeAdressAction } = CouponSlice.actions;
export default CouponSlice.reducer;
