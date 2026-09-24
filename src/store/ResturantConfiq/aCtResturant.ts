// 📂 src/redux/acts/actRestaurantSettings.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { ConfiqDTO } from "../../DTO/CongigDTO";
import { ResturantConfiqURL } from "../../EndPoints/EndPoints";


export const actRestaurantSettings = createAsyncThunk<
  ConfiqDTO, 
  void, 
  { rejectValue: string } 
>(
  "restaurantSettings/fetchRestaurantSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ConfiqDTO>(
       ResturantConfiqURL
      );
      return response.data as ConfiqDTO;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch settings");
    }
  }
);
