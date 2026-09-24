import { createSlice } from "@reduxjs/toolkit";
import { GetHeaderBackGrounImagesURl } from "../../EndPoints/EndPoints";
import { createAppAsyncThunk } from "../FetchData/FetchData";
import type { BranchDTO } from "../../DTO/BrachDTO";


export const actGetBranch = createAppAsyncThunk<BranchDTO>(
  "actGetBranch/fetch",
  GetHeaderBackGrounImagesURl
);

interface Branchintial {
  BranchImages: BranchDTO|null;
  loading: boolean;
  error: string | null;
}

const initialState: Branchintial = {
  BranchImages: null,
  loading: false,
  error: null,
};

const BranchImages = createSlice({
  name: "BranchImages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actGetBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(actGetBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.BranchImages = action.payload;
      })
      .addCase(actGetBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default BranchImages.reducer;
