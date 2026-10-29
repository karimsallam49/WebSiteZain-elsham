import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  RemoveFromCart,
  DeleteCard,
} from "../store/Cart/CartSlice";
import {
  serverCartAdd,
  serverCartUpdateQty,
  serverCartRemove,
  serverCartClearAll,
} from "../store/Cart/serverCartSlice";
import { ImageUrl } from "../EndPoints/EndPoints";
import { getItemUnitPrice, getItemVariationsTotal, getItemAddonsTotal } from "../utilities/cartPricing";
import type { ProductDTO } from "../DTO/ProductsDTO";

export interface CartUiItem {
  key: string;
  productId: number;
  cartId: number | null;
  name: string;
  image: string;
  description: string;
  quantity: number;
  unitPrice: number;
  originalUnitPrice: number | null;
  lineTotal: number;
  available: boolean;
  reason: string | null;
  isPrize: boolean;
  free: boolean;
  prizeHint: string | null;
  remainingToUnlock: number | null;
  addonsText: string | null;
}

/**
 * طبقة الكارت الموحّدة:
 * - مستخدم مسجّل → سلة السيرفر هي المرجع (items + mutations على الـ API)
 * - guest → الـ Redux المحلي زي ما هو
 */
export const useCart = () => {
  const dispatch = useAppDispatch();
  const { OTPToken } = useAppSelector((state) => state.OTPauthconfigration);
  const { CartData } = useAppSelector((state) => state.cartSlice);
  const { data: serverCart, syncing } = useAppSelector(
    (state) => state.serverCartSlice
  );

  const isAuthed = !!OTPToken;
  const useServer = isAuthed && !!serverCart;

  const items: CartUiItem[] = useServer
    ? serverCart.items.map((si) => ({
        key: `s${si.id}`,
        productId: si.product_id,
        cartId: si.id,
        name: si.product_name,
        image: si.product_image ?? "",
        description: "",
        quantity: si.quantity,
        unitPrice: si.final_unit_price + si.addons_total,
        originalUnitPrice:
          si.free && si.original_final_unit_price != null
            ? si.original_final_unit_price + si.addons_total
            : si.unit_price + si.addons_total > si.final_unit_price + si.addons_total
              ? si.unit_price + si.addons_total
              : null,
        lineTotal: si.line_total,
        available: si.available,
        reason: si.reason,
        isPrize: si.is_prize_item,
        free: si.free,
        prizeHint: si.prize?.hint ?? null,
        remainingToUnlock: si.prize?.remaining_to_unlock ?? null,
        addonsText:
          si.addons?.length > 0
            ? si.addons.map((a) => a.name).join("، ")
            : null,
      }))
    : CartData.map((item) => {
        const unitPrice = getItemUnitPrice(item);
        const original =
          (Number(item.original_price) || 0) +
          getItemVariationsTotal(item) +
          getItemAddonsTotal(item);
        return {
          key: `l${item.id}`,
          productId: item.id,
          cartId: null,
          name: item.name,
          image: item.image ? `${ImageUrl}/${item.image}` : "",
          description: item.description ?? "",
          quantity: item.quantity,
          unitPrice,
          originalUnitPrice: original > unitPrice ? original : null,
          lineTotal: unitPrice * item.quantity,
          available: true,
          reason: null,
          isPrize: false,
          free: false,
          prizeHint: null,
          remainingToUnlock: null,
          addonsText: null,
        };
      });

  const count = useServer
    ? serverCart.item_count || items.reduce((s, i) => s + i.quantity, 0)
    : items.reduce((s, i) => s + i.quantity, 0);

  const findItem = useCallback(
    (productId: number) => items.find((i) => i.productId === productId),
    [items]
  );

  const add = useCallback(
    (
      product: Partial<ProductDTO> & { id: number; original_price?: number },
      quantity: number
    ) => {
      if (isAuthed) {
        // الـadd على السيرفر بيدمج الكمية — لو المنتج موجود بالفعل
        // استخدم update بالكمية المطلوبة بدل ما تتضاعف
        const existing = items.find((i) => i.productId === product.id);
        if (existing?.cartId != null) {
          dispatch(
            serverCartUpdateQty({ cart_id: existing.cartId, quantity })
          );
        } else {
          dispatch(
            serverCartAdd({
              product_id: product.id,
              quantity,
              variations: product.variations ?? [],
              add_on_ids: product.add_on_ids ?? [],
              add_on_qtys: product.add_on_qtys ?? [],
            })
          );
        }
      } else {
        dispatch(addToCart({ products: { ...product, quantity }, quantity }));
      }
    },
    [dispatch, isAuthed, items]
  );

  const increase = useCallback(
    (item: CartUiItem) => {
      if (isAuthed && item.cartId != null) {
        dispatch(
          serverCartUpdateQty({
            cart_id: item.cartId,
            quantity: item.quantity + 1,
          })
        );
      } else {
        dispatch(increaseQuantity(item.productId));
      }
    },
    [dispatch, isAuthed]
  );

  const decrease = useCallback(
    (item: CartUiItem) => {
      if (isAuthed && item.cartId != null) {
        dispatch(
          serverCartUpdateQty({
            cart_id: item.cartId,
            quantity: item.quantity - 1,
          })
        );
      } else {
        dispatch(decreaseQuantity(item.productId));
      }
    },
    [dispatch, isAuthed]
  );

  const remove = useCallback(
    (item: CartUiItem) => {
      if (isAuthed && item.cartId != null) {
        dispatch(serverCartRemove({ cart_id: item.cartId }));
      } else {
        dispatch(RemoveFromCart(item.productId));
      }
    },
    [dispatch, isAuthed]
  );

  const clear = useCallback(() => {
    if (isAuthed) {
      dispatch(serverCartClearAll({}));
    }
    dispatch(DeleteCard());
  }, [dispatch, isAuthed]);

  return {
    items,
    count,
    summary: serverCart,
    syncing,
    isAuthed,
    useServer,
    findItem,
    add,
    increase,
    decrease,
    remove,
    clear,
  };
};
