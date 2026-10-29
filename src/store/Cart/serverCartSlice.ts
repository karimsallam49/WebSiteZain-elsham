import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { serverCartUrl } from "../../EndPoints/EndPoints";
import type { ServerCartResponse } from "../../DTO/ServerCartDTO";
import { DeleteCard } from "./CartSlice";
import type { RootState } from "../store";

interface CartParams {
  order_type?: string;
  coupon_code?: string;
  redeem_points?: number;
}

export interface AddToServerCartArgs extends CartParams {
  product_id: number;
  quantity: number;
  variations?: any[];
  add_on_ids?: number[];
  add_on_qtys?: number[];
}

interface ServerCartState {
  data: ServerCartResponse | null;
  syncing: boolean;
  pushed: boolean;
}

const initialState: ServerCartState = {
  data: null,
  syncing: false,
  pushed: false,
};

const num = (v: unknown): number => Number(v) || 0;

const normalizeCart = (data: ServerCartResponse): ServerCartResponse => ({
  ...data,
  item_count: num(data.item_count),
  subtotal: num(data.subtotal),
  total_tax: num(data.total_tax),
  payable_total: num(data.payable_total),
  items: (data.items ?? []).map((i) => ({
    ...i,
    quantity: num(i.quantity),
    unit_price: num(i.unit_price),
    discount_per_unit: num(i.discount_per_unit),
    tax_per_unit: num(i.tax_per_unit),
    final_unit_price: num(i.final_unit_price),
    addons_total: num(i.addons_total),
    addons_tax: num(i.addons_tax),
    line_total: num(i.line_total),
    original_line_total:
      i.original_line_total != null ? num(i.original_line_total) : undefined,
    original_final_unit_price:
      i.original_final_unit_price != null
        ? num(i.original_final_unit_price)
        : undefined,
  })),
  discounts: {
    ...data.discounts,
    coupon: num(data.discounts?.coupon),
    referral: num(data.discounts?.referral),
    first_order: num(data.discounts?.first_order),
    loyalty: num(data.discounts?.loyalty),
    spin_prize: num(data.discounts?.spin_prize),
    spin_free_product: num(data.discounts?.spin_free_product),
    spin_free_delivery:
      data.discounts?.spin_free_delivery === true ||
      (data.discounts?.spin_free_delivery as unknown) === "true" ||
      num(data.discounts?.spin_free_delivery) === 1,
    total: num(data.discounts?.total),
  },
  pending_prizes: data.pending_prizes ?? [],
});

const authHeaders = (state: RootState) => ({
  Authorization: `Bearer ${state.OTPauthconfigration.OTPToken}`,
  "Branch-id": state.restaurantSettingsSlice.selectedBranch,
  "x-localization": state.LanguageSlice.currentLanguage ?? "en",
});

const buildParams = (state: RootState, args: CartParams) => {
  const params = new URLSearchParams();
  params.set("order_type", args.order_type ?? "delivery");
  if (state.restaurantSettingsSlice.selectedBranch)
    params.set(
      "branch_id",
      String(state.restaurantSettingsSlice.selectedBranch)
    );
  if (args.coupon_code) params.set("coupon_code", args.coupon_code);
  if (args.redeem_points) params.set("redeem_points", String(args.redeem_points));
  return params;
};

const fetchCart = async (
  state: RootState,
  args: CartParams
): Promise<ServerCartResponse | null> => {
  try {
    const res = await axios.get<ServerCartResponse>(
      `${serverCartUrl}?${buildParams(state, args).toString()}`,
      { headers: authHeaders(state) }
    );
    return normalizeCart(res.data);
  } catch {
    return null;
  }
};

/**
 * هات سلة السيرفر (preview بالكوبون/النقاط) — وأول مرة بيحصل push للعناصر
 * المحلية (الـguest cart) على السيرفر: بيضيف المنتجات الناقصة بس من غير
 * ما يمسح حاجة من سلة السيرفر.
 */
export const loadServerCart = createAsyncThunk<
  ServerCartResponse | null,
  CartParams,
  { state: RootState }
>("serverCart/load", async (args, { getState, dispatch }) => {
  const state = getState();
  if (!state.OTPauthconfigration.OTPToken) return null;
  const headers = authHeaders(state);
  const orderType = args.order_type ?? "delivery";

  try {
    if (!state.serverCartSlice.pushed) {
      const localItems = state.cartSlice.CartData;
      let pushedAny = false;
      if (localItems.length > 0) {
        const current = await axios
          .get<ServerCartResponse>(
            `${serverCartUrl}?order_type=${orderType}`,
            { headers }
          )
          .catch(() => null);
        const serverProductIds = new Set(
          (current?.data?.items ?? []).map((i) => i.product_id)
        );
        for (const item of localItems) {
          if (serverProductIds.has(item.id)) continue;
          const res = await axios
            .post(
              `${serverCartUrl}/add`,
              {
                product_id: item.id,
                quantity: item.quantity,
                order_type: orderType,
                variations: item.variations ?? [],
                add_on_ids: item.add_on_ids ?? [],
                add_on_qtys: item.add_on_qtys ?? [],
              },
              { headers }
            )
            .catch(() => null);
          if (res) pushedAny = true;
        }
        // بعد أول نقل ناجح لسلة الـguest على السيرفر، امسح النسخة المحلية
        // عشان السيرفر يبقى هو المرجع الوحيد ومترجعش تتدفع تاني بعد reload
        if (pushedAny || serverProductIds.size > 0) dispatch(DeleteCard());
      }
    }
    return await fetchCart(getState(), args);
  } catch {
    return null;
  }
});

export const serverCartAdd = createAsyncThunk<
  ServerCartResponse | null,
  AddToServerCartArgs,
  { state: RootState }
>("serverCart/add", async (args, { getState }) => {
  const state = getState();
  if (!state.OTPauthconfigration.OTPToken) return null;
  try {
    const res = await axios.post<ServerCartResponse>(
      `${serverCartUrl}/add?${buildParams(state, args).toString()}`,
      {
        product_id: args.product_id,
        quantity: args.quantity,
        order_type: args.order_type ?? "delivery",
        variations: args.variations ?? [],
        add_on_ids: args.add_on_ids ?? [],
        add_on_qtys: args.add_on_qtys ?? [],
      },
      { headers: authHeaders(state) }
    );
    return normalizeCart(res.data);
  } catch {
    return null;
  }
});

export const serverCartUpdateQty = createAsyncThunk<
  ServerCartResponse | null,
  { cart_id: number; quantity: number } & CartParams,
  { state: RootState }
>("serverCart/update", async (args, { getState }) => {
  const state = getState();
  if (!state.OTPauthconfigration.OTPToken) return null;
  try {
    const res = await axios.post<ServerCartResponse>(
      `${serverCartUrl}/update?${buildParams(state, args).toString()}`,
      { cart_id: args.cart_id, quantity: args.quantity },
      { headers: authHeaders(state) }
    );
    return normalizeCart(res.data);
  } catch {
    return null;
  }
});

export const serverCartRemove = createAsyncThunk<
  ServerCartResponse | null,
  { cart_id: number } & CartParams,
  { state: RootState }
>("serverCart/remove", async (args, { getState }) => {
  const state = getState();
  if (!state.OTPauthconfigration.OTPToken) return null;
  try {
    const res = await axios.post<ServerCartResponse>(
      `${serverCartUrl}/update?${buildParams(state, args).toString()}`,
      { cart_id: args.cart_id, quantity: 0 },
      { headers: authHeaders(state) }
    );
    return normalizeCart(res.data);
  } catch {
    return null;
  }
});

export const serverCartClearAll = createAsyncThunk<
  ServerCartResponse | null,
  CartParams,
  { state: RootState }
>("serverCart/clearAll", async (args, { getState }) => {
  const state = getState();
  if (!state.OTPauthconfigration.OTPToken) return null;
  try {
    const res = await axios.post<ServerCartResponse>(
      `${serverCartUrl}/clear?${buildParams(state, args).toString()}`,
      {},
      { headers: authHeaders(state) }
    );
    return normalizeCart(res.data);
  } catch {
    return null;
  }
});

const serverCartSlice = createSlice({
  name: "serverCart",
  initialState,
  reducers: {
    clearServerCart: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    const onPending = (state: ServerCartState) => {
      state.syncing = true;
    };
    const onFulfilled = (
      state: ServerCartState,
      action: { payload: ServerCartResponse | null }
    ) => {
      state.syncing = false;
      if (action.payload) state.data = action.payload;
    };
    const onRejected = (state: ServerCartState) => {
      state.syncing = false;
    };
    builder
      .addCase(loadServerCart.pending, onPending)
      .addCase(loadServerCart.fulfilled, (state, action) => {
        // علّم pushed بس لو الرد نجح — لو السيرفر وقع نعيد المحاولة المرة الجاية
        if (action.payload) state.pushed = true;
        onFulfilled(state, action);
      })
      .addCase(loadServerCart.rejected, onRejected)
      .addCase(serverCartAdd.pending, onPending)
      .addCase(serverCartAdd.fulfilled, onFulfilled)
      .addCase(serverCartAdd.rejected, onRejected)
      .addCase(serverCartUpdateQty.pending, onPending)
      .addCase(serverCartUpdateQty.fulfilled, onFulfilled)
      .addCase(serverCartUpdateQty.rejected, onRejected)
      .addCase(serverCartRemove.pending, onPending)
      .addCase(serverCartRemove.fulfilled, onFulfilled)
      .addCase(serverCartRemove.rejected, onRejected)
      .addCase(serverCartClearAll.pending, onPending)
      .addCase(serverCartClearAll.fulfilled, onFulfilled)
      .addCase(serverCartClearAll.rejected, onRejected);
  },
});

export const { clearServerCart } = serverCartSlice.actions;
export default serverCartSlice.reducer;
