import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductDTO } from "../../DTO/ProductsDTO";

interface CartItem extends ProductDTO {
  quantity: number;
  original_price?: number;
}

interface CartInitialState {
  CartData: CartItem[];
  loading: boolean;
  error: string | null;
}

interface AddToCartPayload {
  products: any;
  quantity: number;
}

const initialState: CartInitialState = {
  CartData: [],
  loading: false,
  error: null,
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.CartData = [];
      state.error = null;
      state.loading = false;
    },

    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const { products, quantity } = action.payload;
      
      const existingItem = state.CartData.find((item) => item.id === products.id);

      if (existingItem) {
       
        Object.assign(existingItem, products, { quantity });
      } else {
        
        state.CartData.push({ ...products, quantity });
      }
    },

    RemoveFromCart: (state, action: PayloadAction<number>) => {
      state.CartData = state.CartData.filter((el) => el.id !== action.payload);
    },
    DeleteCard: (state) => {
      state.CartData = [];
    },

    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.CartData.find((el) => el.id === action.payload);
      if (item) item.quantity += 1;
    },

    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.CartData.find((el) => el.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item && item.quantity === 1) {
       
        state.CartData = state.CartData.filter((el) => el.id !== action.payload);
      }
    },
  },
});

export const {
  clearCart,
  addToCart,
  RemoveFromCart,
  increaseQuantity,
  decreaseQuantity,
  DeleteCard,
} = CartSlice.actions;
export default CartSlice.reducer;
