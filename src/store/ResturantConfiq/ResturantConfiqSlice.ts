
import { createSlice } from "@reduxjs/toolkit";
import type { RestaurantSettingsState } from "../../DTO/CongigDTO";
import { actRestaurantSettings } from "./aCtResturant";




const initialState: RestaurantSettingsState = {
  resturantdata: null,
  loading: "idle",
  error: null,
  selectedBranch:null
};

const restaurantSettingsSlice = createSlice({
  name: "restaurantSettings",
  initialState,
  reducers: {
    clearRestaurantSettings: (state) => {
      state.resturantdata = null;
      state.error = null;
      state.loading = "idle";
    },
    selectAbranch:(state,action)=>{
      state.selectedBranch=action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(actRestaurantSettings.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(actRestaurantSettings.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.resturantdata = action.payload;
      })
      .addCase(actRestaurantSettings.rejected, (state, action) => {
        state.loading = "failed";
        if (action.payload && typeof action.payload === "string") {
          state.error = action.payload;
        } else {
          state.error = "Unexpected error occurred";
        }
      });
  },
});

export const { clearRestaurantSettings,selectAbranch } = restaurantSettingsSlice.actions;
export default restaurantSettingsSlice.reducer;
