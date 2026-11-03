# الفروع + مناطق التوصيل — Frontend Integration

المستند ده بيشرح بالظبط إزاي الواجهة بتتعامل مع **اختيار الفرع تلقائيًا حسب لوكيشن اليوزر**،
**نطاق التغطية (out of range)**، و**مناطق التوصيل المخصصة لكل فرع**.
الفرونت التاني (موبايل/ويب) لازم يطبق نفس الفلو بنفس الشكل.

---

## 0. الأساسيات

- `GET /api/v1/config` بيرجع `branches[]` — كل فرع فيه:
  `id`, `name`, `latitude`, `longitude`, `coverage` (بالكيلومتر), `address`, `status`, ...
- الفرع المختار (`selectedBranch`) بيتخزن في الـ state وبيتحط في هيدر كل الطلبات:

  ```
  Branch-id: {selectedBranch}
  ```

- **ممنوع تثبت `branch_id = 1` على طول** — الفرع بيتحدد تلقائيًا من لوكيشن اليوزر (القسم 1).

---

## 1. اختيار الفرع تلقائيًا حسب لوكيشن اليوزر

### مصدر لوكيشن اليوزر

الإحداثيات بتيجي من **العنوان المختار** (`latitude` / `longitude`):

- عنوان محفوظ من `address/list`.
- أو عنوان مؤقت متبني من `navigator.geolocation` (لو مفيش عناوين محفوظة).

### الخوارزمية

1. أول تحميل: اختار `branches[0]` كـ fallback مؤقت (لحد ما اللوكيشن يوصل).
2. أول ما تتوفر إحداثيات اليوزر → احسب المسافة لكل فرع بـ **haversine** واختار **أقرب فرع**.
3. أي تغيير في لوكيشن اليوزر (اختيار عنوان تاني مثلًا) → أعد الحساب وحدّث الفرع.
4. بعد تغيير `selectedBranch` → اعمل refetch لأي داتا بتعتمد على الفرع
   (delivery-fee، البانرز، وقائمة العناوين — شوف القسم 3).

```ts
// المسافة بالكيلومتر بين نقطتين GPS (haversine)
const haversineKm = (lat1, lng1, lat2, lng2) => {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

// أقرب فرع لليوزر
const nearestBranch = (branches, userLat, userLng) => {
  let nearest = null;
  let nearestKm = Infinity;
  for (const b of branches) {
    const d = haversineKm(userLat, userLng, Number(b.latitude), Number(b.longitude));
    if (d < nearestKm) {
      nearestKm = d;
      nearest = b;
    }
  }
  return { nearest, distanceKm: nearestKm };
};

// الاستخدام
const { nearest, distanceKm } = nearestBranch(branches, userLat, userLng);
if (nearest && nearest.id !== selectedBranch) selectBranch(nearest.id);
const outOfRange = distanceKm > (nearest?.coverage ?? Infinity);
```

> لو إحداثيات العنوان مش موجودة أو (0,0) → متعملش الحساب وخلي الفرع زي ما هو.

---

## 2. نطاق التغطية — "Out of Range"

- لو `distanceKm > branch.coverage` → اليوزر بره نطاق أي فرع.
- **شكل العرض**: رسالة حمرا (alert) **مكان نص العنوان** في الـ address row بتاع الـ header —
  مش بانر منفصل:
  - أيقونة تحذير حمرا (⚠) بدل أيقونة الدبوس.
  - النص أحمر bold + خلفية الصف بيها تنت أحمر خفيف (`rgba(229,72,77,.12)`).
  - **ميظهرش** ليبل "التوصيل إلى" في حالة الـ alert.
  - الصف يفضل clickable → يفتح بوب-أب اختيار العنوان عشان اليوزر يغيّر مكانه.

### الترجمات (`out_of_range`)

| اللغة | النص |
|------|------|
| `en` | `You are out of our range` |
| `ar` | `أنت خارج نطاق التوصيل لدينا` |

---

## 3. مناطق التوصيل لكل فرع (Delivery Areas)

العناوين بتدعم `delivery_areas` = mapping بـ `branch_id => delivery_area_id` —
يعني نفس العنوان ممكن يكون ليه منطقة مختلفة لكل فرع.

### 3.1 مناطق الفرع

```
GET /api/v1/config/delivery-fee?branch_id={branchId}
```

```json
{
  "delivery_charge_setup": { "delivery_charge_type": "area" },
  "delivery_charge_by_area": [
    { "id": 3, "branch_id": 1, "area_name": "التجمع الأول", "delivery_charge": 15 },
    { "id": 4, "branch_id": 1, "area_name": "مدينتي",       "delivery_charge": 25 }
  ]
}
```

- `delivery_charge_type`:
  - `area` → **لازم** تختار منطقة من `delivery_charge_by_area` (ولازم تكون تابعة لنفس الفرع).
  - `distance` → رسوم بالكيلومتر.
  - `fixed` → رسوم ثابتة.
- اعمل refetch للنداء ده **كل ما الفرع يتغير**.

### 3.2 قائمة العناوين — مفلترة بالفرع

```
GET /api/v1/customer/address/list?branch_id={branchId}
```

- ابعت `branch_id` دايمًا → `delivery_area` بيرجع منطقة العنوان **للفرع المختار بالذات**
  (`null` لو العنوان ملوش منطقة للفرع ده).
- `delivery_areas: {"1": 3, "2": 8}` → الـ mapping الكامل لكل الفروع.
- لو `delivery_area == null` والفرع نوعه `area` → اعرض تحذير على كارت العنوان
  وخليه clickable → يفتح فورم التعديل يختار منطقة.

### 3.3 حفظ / تعديل العنوان

```
POST /api/v1/customer/address/store        (إضافة)
PUT  /api/v1/customer/address/update/{id}  (تعديل)
```

ابعت `delivery_area_id` **ومعه** `branch_id`:

```json
{
  "contact_person_name": "أحمد",
  "address_type": "home",
  "contact_person_number": "01012345678",
  "address": "شارع التسعين، التجمع الأول",
  "road": "90 st", "house": "12", "floor": "3",
  "longitude": 31.4, "latitude": 30.0,
  "branch_id": 1,
  "delivery_area_id": 3,
  "is_default": 1
}
```

(في طريقة تانية بـ `delivery_areas: {"1": 3, "2": 8}` — الاحتياج الحالي بيغطيه `delivery_area_id` + `branch_id`.)

#### قواعد الـ select في الفورم

- الـ options بتتملى من `delivery_charge_by_area` الخاصة **بالفرع الحالي بس**.
- عند فتح التعديل، القيمة المبدئية:
  1. `delivery_area.id` (المفلترة بالفرع من الـ list) لو موجودة.
  2. وإلا `delivery_area_id` الخام **بشرط** يكون موجود جوا مناطق الفرع الحالي —
     ممكن يكون بتاع فرع تاني، فلازم تتفلتر.
  3. وإلا فاضي.

### 3.4 الطلب — `POST /api/v1/customer/order/place`

```json
{
  "delivery_address_id": 12,
  "branch_id": 1,
  "order_type": "delivery",
  "selected_delivery_area": 3
}
```

- ابعت `selected_delivery_area` **بس لما `order_type === "delivery"`** —
  لـ `take_away`/`dine_in` ابعت `null` (متبعتش منطقة فرع تاني بالغلط).
- قبل الإرسال: لو الفرع `area` والعنوان مفيهوش منطقة صالحة → افتح بيكر اختيار المنطقة
  وبلاش تبعت الأوردر أصلاً.
- اعتمد على `delivery_area.id` (المفلترة بالفرع) — والـ raw `delivery_area_id`
  بس بعد التأكد إنه موجود في مناطق الفرع.

#### سيناريوهات الرد (لو الفرع `area`):

| الحالة | الرد |
|--------|------|
| `selected_delivery_area` صالحة وتابعة للفرع | الأوردر بيتم + الباك **بيحفظ المنطقة على العنوان تلقائيًا للفرع ده** |
| `selected_delivery_area` مش تابعة للفرع | `403` بـ `code: "delivery_area"` — "the selected delivery area is not valid for this branch" |
| العنوان ملوش منطقة للفرع ومفيش `selected_delivery_area` | `403` بـ `code: "delivery_area"` — "please select a delivery area suitable for this branch" |

#### التعامل مع الـ 403

```ts
catch (err) {
  const areaErr = err?.errors?.find((e) => e?.code === "delivery_area");
  if (areaErr) {
    // اعرض رسالة السيرفر + افتح بيكر/فورم يختار منطقة مناسبة للفرع
    showToast(areaErr.message);
    openAddressAreaPicker();
  } else {
    showToast(genericError);
  }
}
```

- بعد نجاح الأوردر: اعمل **refetch لـ `address/list?branch_id=`** —
  الباك حفظ المنطقة على العنوان والـ mapping اتغير.

---

## 4. ملخص الـ Flow

```
settings (config)
   │
   ▼
branches[] + user coords (selectedAdress / geolocation)
   │
   ▼
haversine ──► أقرب فرع ──► selectedBranch ──► Branch-id header لكل الطلبات
   │                            │
   │                            ├─► delivery-fee?branch_id  (refetch)
   │                            ├─► address/list?branch_id  (refetch)
   │                            └─► بانرز/منتجات الفرع       (refetch)
   │
   ▼
distance > coverage ?
   ├─ نعم ─► alert أحمر في الـ address row ("out_of_range")
   └─ لا  ─► كمّل عادي
   │
   ▼
checkout:
   branch type = area ?
   ├─ العنوان عنده delivery_area للفرع ─► ابعت selected_delivery_area = delivery_area.id
   ├─ العنوان ملوش منطقة ─► افتح بيكر المنطقة → ابعت selected_delivery_area = المختارة
   └─ 403 delivery_area ─► نفس البيكر برسالة السيرفر
```
