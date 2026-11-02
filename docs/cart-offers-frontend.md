# Cart & Offers — Frontend Contract

مرجع الفرونت لسلوك الكارت والعروض والجوايز. **كل القيم server-computed — الفرونت يعرض فقط وميعملش حسابات.**

---

## 1) `GET /cart` — فلاجات الصف وسلوك الفرونت

كل صف في `items[]` بيرجع بالفلاجات دي:

| الفلاج | المعنى | إجراء الفرونت |
|---|---|---|
| `is_prize_item` | الصف جايزة مش منتج عادي | اعرض بادج 🎁 |
| `locked` | الصف ممنوع تعديل/حذف من الباك إند | متستدعيش `cart/update` أو `cart/remove` عليه — هيرجع 403 `"prize items can not be modified/removed"` |
| `free` | الجايزة اتفعلّت — الصف مجاني | اعرض "مجاني" + سعر أصلي مشطوب لو موجود |
| `display_only` | الصف للعرض فقط | مش بيتشحن وميتبعتش في الأوردر — متعتبرهوش جزء من الحساب |

### `prize{}` — كل حقوله

```json
{
  "id": 14,
  "prize_type": "free_product",
  "label": "منتج مجاني",
  "status": "pending",
  "expires_at": "...",
  "eligible": false,
  "reason": "requires a minimum order of 400",
  "remaining_to_unlock": 110,
  "hint": "add 110 EGP to unlock"
}
```

| الحقل | الاستخدام |
|---|---|
| `eligible` | `true` = القواعد اتحققت (بيبقى `free: true`)، `false` = لسه معلّقة |
| `reason` | ليه مش مستحقة — حد أدنى / نوع أوردر / منتهي / ملغي — **تظهره للعميل** |
| `remaining_to_unlock` | كام فاضل عشان تتفعل |
| `hint` | رسالة توضيحية من السيرفر |
| `status` / `expires_at` | حالة الجايزة وتاريخ انتهائها |

> **القفل من الباك إند مش فلاج بس**: `cart/update` على صف جايزة → 403، `cart/remove` → 403، `cart/clear` بيمسح العادي بس — صف الجايزة بيفضل لحد ما تنتهي صلاحيته، أو يتفعّل لوحده (`free:true` + `eligible:true`)، أو العميل يشيل الـ pick عبر `offers/select`.

---

## 2) `applied_offers` — العروض الشغالة فعلًا

قائمة العروض المطبّقة على الكارت فعليًا. فيها فلاج `auto`:
- `auto: true` → العرض اتطبّق تلقائيًا من السيستم (العميل مش هو اللي اختاره)
- `auto: false` → العميل اختاره بنفسه عبر `offers/select`

---

## 3) `dropped_offers` / `offer_conflicts` / `offer_choice`

| الحقل | المعنى |
|---|---|
| `dropped_offers` | عروض كانت مطبّقة واتشالت — لأن الشروط بقت مش متحققة أو بسبب تعارض مع اختيار جديد |
| `offer_conflicts` | عروض اتمنعت — معاها `blocked_by` (أسماء العروض المختارة اللي بتمنعها) و`message` توضيحي |
| `offer_choice` | لما لازم العميل يختار — `required: true` + `options[][]` كل خيار مجموعة picks — اعرضها كأزرار اختيار |

---

## 4) جدول التوتال — حقول `discounts`

```json
{
  "coupon": 0, "coupon_type": null, "coupon_error": null,
  "referral": 0, "first_order": 0,
  "loyalty": 0, "loyalty_error": null,
  "spin_prize": 0, "spin_free_product": 0, "spin_free_delivery": false,
  "total": 0
}
```

| الحقل | المعنى |
|---|---|
| `coupon` / `coupon_type` | خصم الكوبون ونوعه |
| `coupon_error` | رسالة فشل الكوبون (كود غلط، مش متحقق...) — اعرضها للعميل |
| `referral` | خصم الإحالة |
| `first_order` | خصم أول طلب |
| `loyalty` / `loyalty_error` | خصم نقاط الولاء / سبب الرفض |
| `spin_prize` | خصم جايزة عجلة الحظ |
| `spin_free_product` | قيمة منتج عجلة الحظ المجاني |
| `spin_free_delivery` | توصيل مجاني من العجلة (boolean — مش مبلغ) |
| `total` | إجمالي الخصومات |

**ملاحظة التقريب**: التوتال النهائي (`payable_total`) بيتقرّب **لأقرب 5** من الباك إند — مترجعش تحسب قيم من عندك هتطلع غلط.

---

## 5) `offers/available` + `offers/select`

### `GET customer/offers/available?order_type={delivery|take_away}`

```json
{
  "offers": [...],            // متاحة للاختيار
  "unavailable_offers": [     // مش متاحة — معاها سبب
    { "key": "...", "type": "free_product", "label": "منتج مجاني",
      "detail": "...", "reason": "requires a minimum order of 500.00 EGP — Your cart is 0.00" }
  ],
  "selected_offers": [...]    // المختارة حاليًا — تتعبّي الـ UI
}
```

### `POST customer/offers/select`

بيبعت مجموعة الـ picks المختارة. **`[]` فاضية = بيمسح الـ selection كلها + صفوف الجوايز من الكارت.**

| الخطأ | المعنى |
|---|---|
| 403 conflict | الـ pick بيتعارض مع عرض تاني مختار — `offer_conflicts` بتحدّد مين بيمنع مين |
| offer not available | العرض بقى مش متاح (انتهى / الشروط اتغيّرت) |

بعد أي select → **اعمل `GET /cart` تاني** عشان تحدّث الصفوف والتوتال.

---

## 6) الكوبون — سلوك التعارض مع الـ picks

تطبيق كوبون ممكن يشيل عروض مختارة (`dropped_offers`) لو الاتنين متعارضين — السيرفر بيحكم، والـ `offer_conflicts`/`dropped_offers` بتوضّح إيه اللي اتشال وليه. اعرض السبب للعميل زي ما هو.

---

## 7) قواعد للفرونت

1. **متعملش حسابات** — الأسعار والخصومات والتقريب كلها server-computed.
2. **`locked` ممنوع تعديل** — `cart/update`/`cart/remove` على الصف هيرجعوا 403، متعرّضش الـ action أصلًا (أو هاندل الـ error).
3. **`display_only` مش بيتشحن** — صف عرضي فقط، متحسبوش في المجموع وميتبعتش في الأوردر.
4. **refetch بعد أي cart mutation** — أي add/update/remove/select/coupon → `GET /cart` تاني عشان الفلاجات والعروض والتوتال يتحدّثوا.
5. **اعرض `reason`/`hint`/`message` زي ما هي** — الباك إند بيشرح ليه عرض مش متاح أو جايزة معلّقة.
