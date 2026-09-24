import { createSlice } from "@reduxjs/toolkit";
import { categoriesurl } from "../../EndPoints/EndPoints";
import type { Category, CategoryListResponse } from "../../DTO/CategoriesDTO";
import { createAppAsyncThunk } from "../FetchData/FetchData";


export const fetchCategories = createAppAsyncThunk<CategoryListResponse>(
  "categories/fetch",
  categoriesurl
);

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categoriesSlice.reducer;
