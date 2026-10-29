# Chat Meal Picker — "شيف زين الشام" 🎲💬

فيتشر تفاعلية بتحوّل اختيار الأكل لمحادثة شات بسيطة: أيقونة شات طايرة بتنادي اليوزر، ولما يفتحها بيسأل أسئلة عشوائية (بإحساس إنه بيكلم حد حقيقي — typing indicator وكل حاجة)، وفي الآخر بيختارله منتج عشوائي من الـ term المفتوح حاليًا على السيرفر.

---

## 1. الـ APIs المستخدمة

كل الـ endpoints تحت `GET /api/v1/terms/` — public بدون auth. الـ endpoint constants في `src/EndPoints/EndPoints.ts`:

| Endpoint | الاستخدام |
|---|---|
| `GET /api/v1/terms/categories` | بيتجاب **في الخلفية عند فتح الشات** — فئات منتجات الـ term المفتوح، بتتستخدم لبناء سؤال الفئات والـ chips. لو مفيش term مفتوح بيرجّع `categories: []` + `next_term`. |
| `GET /api/v1/terms/random-product` | بيتنادى عند كل "spin" (بعد الأسئلة أو زرار "جرّب تاني") — بيرجّع منتج عشوائي من الـ term المفتوح مع `filters` echo و`next_term` لو مفيش term. |

**لم يُستخدم** `GET /terms` (الـ schedule) ولا `GET /terms/{id}/products` — الـ MVP مبني على الـ random picker بس.

### طبقة الـ API — `src/utilities/termsApi.ts`

```ts
fetchRandomMeal(filters, { branchId, lang, servingType })
fetchTermCategories({ branchId, lang, servingType })
```

- **axios مباشر** مش `useFetch` — الـ random call لازم ينفّذ كل ضغطة بدون React Query cache.
- **Headers** (نفس نمط `useFetch`):
  - `Branch-id: <selectedBranch>`
  - `x-localization: <ar|en>`
- **Query params**:
  - `serving_type` (default `takeaway`)
  - `branch_id`
  - `is_diet`, `is_spicy`, `max_calories`, `category_id` — بيتبعتوا بس لو متعرّفين (`undefined` بيتشال).
- أدوات مساعدة: `serverClockOffset()` (فرق ساعة السيرفر عن الجهاز) و`minutesUntil()` للـ countdowns — بيشتغلوا على `server_time` مش ساعة الجهاز.

### الـ DTOs — `src/DTO/TermsDTO.ts`

`TermDTO` · `NextTermDTO` · `RandomMealFilters` · `RandomProductResponse` · `TermCategoryDTO` · `TermCategoriesResponse` · `TermsListResponse`

---

## 2. الملفات

```
src/
├─ DTO/TermsDTO.ts                    ← أنواع الـ Terms API
├─ utilities/termsApi.ts              ← axios calls + server-time helpers
├─ EndPoints/EndPoints.ts             ← termsUrl / termsRandomUrl / termsCategoriesUrl
├─ Components/ChatMeal/
│  ├─ ChatMealFab.tsx                 ← الزرار الطاير + فقاعة الترغيب
│  ├─ ChatMealPanel.tsx               ← محرك المحادثة كله (portal على body)
│  └─ ChatMeal.css                    ← الستايل (V1 فاتح + V2 غامق ذهبي)
└─ Components/layout/Mainlayout.tsx   ← بيركّب <ChatMealFab />
```

الـ panel بيترندر عبر `createPortal(document.body)` عشان ميتقصّش جوه أي stacking context (نفس مشكلة الـ sidebar اللي اتصلّحت قبل كده).

---

## 3. شكل الزرار (FAB) والانيميشن

### التصميم النهائي
- **دايرة زجاجية** `58px` — `border-radius: 50%` مع `backdrop-filter: blur(16px) saturate(150%)` فوق خلفية داكنة شبه شفافة `rgba(20,22,30,0.42)` — glassmorphism زي أزرار iOS.
- حافة شفافة رفيعة + ظل ناعم + إضاءة داخلية علوية (`inset highlight`).
- **الأيقونة**: `MessageCircleMore` من lucide — فقاعة شات بيضا فيها "···" (إحساس إن في حد بيكتب) بحجم 28px.

### انيميشن "الذرة" 🌀
قوسين بيلفوا حوالين الزرار زي إلكترونات حوالين النواة:
- `::before` — قوس داخلي (`inset: -7px`) أبيض ساطع بيلف كل **2.8 ثانية**.
- `::after` — قوس خارجي (`inset: -13px`) أنعم بيلف **بالعكس** كل **4.6 ثانية**.
- بتتعمل بـ `border-top-color`/`border-bottom-color` على حلقة شفافة + `transform: rotate(360deg)` — شكلها زي مذنب بيدور.
- `pointer-events: none` — ميتدخلوش مع الكليك.

### انيميشنات تانية
- `chat-fab-in` — scale من 0 عند الظهور (cubic-bezier بارتداد خفيف).
- `chat-fab-float` — طفو هادي ±5px كل 3.5 ثانية.
- `hover` — `translateY(-3px) scale(1.08)` + زجاج أغمق وظل أعمق.

### المكان
- `left: 1rem` (شمال دايمًا) — `bottom: 4.9rem` موبايل / `1.5rem` ديسكتوب.
- **`raised` state**: لما الـ `v2-cart-bar` بتكون ظاهرة (V2 home + السلة مش فاضية) الزرار بيترفع فوقها — `9.8rem` موبايل / `5.8rem` ديسكتوب — بـ transition ناعم. (`ChatMealFab` بيحسب `raised` من `designVersion` + `pathname` + `CartData`.)

### فقاعة الترغيب (invite)
- بتطلع **فوق الزرار مباشرة** (`left: 1.2rem`, `bottom: 9.4rem` — وبتترفع معاه لما يكون raised).
- **أول رسالة بعد ثانيتين** من تحميل الصفحة، وبعدين **كل ~9 ثواني** برسالة عشوائية من `chatMeal.fabHints` ("محتار؟ 🤔" / "نساعدك تختار؟" / "جعان ومش عارف تطلب إيه؟").
- animation `chat-invite-pop` — pop-in 4.5 ثانية وبعدين pop-out، والـ JS بيشيلها بعد 4.5 ثانية.
- سهم صغير تحتها بيشاور على الزرار.
- بتتوقف لما الشات مفتوح.

---

## 4. شكل الشات (Panel)

- `position: fixed` تحت شمال — عرض `min(370px, 100vw - 2rem)` وارتفاع `min(72vh, 580px)`، `border-radius: 20px`، انيميشن `chat-panel-up` (slide + scale) عند الفتح.
- **Header**: gradient من `--MainColor` — avatar دايرة (`ChefHat` icon) مع نقطة خضرا "أونلاين" + عنوان "شيف زين الشام" / "Zain's Chef" + subtitle + زرار X بخلفية شفافة.
- **Body**: scroll داخلي بـ scrollbar رفيع، auto-scroll لآخر رسالة على أي تغيير.

### الرسائل
- `bot`: bubble أبيض بزاوية مقصوصة من تحت الشمال، `align-self: flex-start`.
- `user`: bubble بلون `--MainColor` بزاوية مقصوصة من تحت اليمين، `align-self: flex-end`.
- كل رسالة بتحصل `chat-msg-in` (fade + slide up).

### Typing indicator
3 نقط بتنبض (`chat-dot` — translateY متتابع بدلايلات) قبل كل رسالة bot بتأخير عشوائي **0.7–1.5 ثانية** — يدي إحساس حد بيكتب فعلًا.

### كارت المنتج جوه الشات
- صورة `78×78` بـ `border-radius: 14px` + fallback placeholder.
- اسم bold + وصف (line-clamp 2) + **سعر final زي ما بيرجع من الـ API** — ممنوع recompute (لو `price = 0` يعرض "السعر حسب الاختيار").

### الـ Chips (quick replies)
- أزرار pill بحدود `--MainColor` — الـ `.solid` بخلفية مليانة + shadow.
- بتظهر `align-self: flex-end` تحت الرسائل.

### الـ Countdown
- لما مفيش term مفتوح — badge في نص الشات "عشا يفتح بعد X ساعة Y دقيقة" محسوبة من `opens_at`.

---

## 5. تدفق المحادثة (State Machine)

```
open → typing → greet (صياغة عشوائية)
     → queue: [diet, spicy] بترتيب عشوائي + category بينضاف لما الـ fetch يرد
     → كل إجابة = user msg → typing → سؤال تالي
     → آخر سؤال → typing طويل (1.4–2.2 ث) → fetchRandomMeal(filters)
     → product card + chips: [أضف للسلة | شوف التفاصيل | جرب تاني | نبدأ من الأول]
```

### الأسئلة
| السؤال | الفلتر | ملاحظة |
|---|---|---|
| **دايت؟** — "عامل دايت ولا لأ؟ 🥗" | `is_diet` | "عامل دايت" → `is_diet=1` **+ بيضيف سؤال السعرات فورًا بعده**. "لأ، عادي" → مفيش فلتر وسؤال السعرات بيتسكّب خالص. |
| **سبايسي؟** — "سبايسي ولا عادي؟ 🌶️" | `is_spicy` | "سبايسي" → 1 · "عادي" → 0 · "أي حاجة" → skip. |
| **السعرات** — "حاسب كام سعرة؟ 🥗" | `max_calories` | بيظهر **بس** لو اليوزر قال إنه عامل دايت. خفيف → 400 · وسط → 700 · جعان اوي → مفيش حد. |
| **الفئات** — "نفسك رايحه لإيه — X، Y ولا Z؟" | `category_id` | مبني على `terms/categories` الحقيقية (شوف تحت). |

- كل سؤال ليه **3 صياغات عشوائية** + ترتيب الأسئلة متعشش — كل فتحة محادثة مختلفة.
- فيه دايمًا chip **"اختارلي على طول 🎲"** بيسكّب باقي الأسئلة ويعمل spin فورًا.

### سؤال الفئات — التفاصيل
- الفئات بتتجاب في الخلفية عند الفتح، والسؤال بينضاف للـ queue في موضع عشوائي.
- **أول 3 فئات** (مرتبة بـ `products_count`) بيدخلوا في نص السؤال نفسه: "نفسك رايحه لإيه — الشاورما، السندويشات ولا كاليزوني؟" + chips ليهم.
- لو فيه أكتر من 3 → chip **"نفسك رايحه لحاجة تانية؟"** بيعرض باقي الفئات (لحد 9).
- **فئات الدايت بتتستبعد** (`isDietCategory` — regex على ريجيم/دايت/diet) عشان ليها سؤالها الخاص.
- لو مفيش فئات بعد الفلترة → السؤال بيتسكّب.

### الـ Spin والنتيجة
- `fetchRandomMeal` بـ axios جديد كل مرة — مفيش كاش، كل "جرّب تاني" بيرجّع منتج مختلف (سيرفر-side).
- **3 حالات**:
  1. `term + product` → "إيه رأيك في ده؟ 🤩" + الكارت + الـ actions.
  2. `term, !product` → اعتذار "مفيش حاجة بالفلاتر دي" + chip "امسح الفلاتر" بيعيد الـ spin فورًا بفلاتر فاضية.
  3. `!term` → رسالة المطبخ مقفل + **countdown** لـ `next_term` + chip "نبدأ من الأول".
- **أضف للسلة**: لو `price = 0` أو فيه `variations` → يفتح `ProductModal`، غير كده `addToCart` بالسعر final + `FeedbackToast`.

### Restart
بيمسح الفلاتر، يعيد بناء الـ queue (مع فئات لو موجودة)، ويبدأ بـ greet جديد.

---

## 6. الـ i18n — `chatMeal.*`

كل النصوص في `en.json` / `ar.json` — عربي عامية مصرية وإنجليزي casual:

- `fabHints[]` · `greet[]` · `q_diet[]` · `q_spicy[]` · `q_hungry[]` · `q_cat[]` · `result_intro[]` · `result_ask[]` · `no_match[]` · `closed[]` — كلها arrays بيتختار منها عشوائي (`returnObjects: true`).
- `opts.*` — أسماء الإجابات · `actions.*` — أسماء الـ chips · `opensIn` / `hours` / `minutes` / `or` / `moreCats` / `priceOnSelection` / `error`.

---

## 7. الثيم (V1 / V2)

| العنصر | V1 | V2 (`html[data-theme="v2"]`) |
|---|---|---|
| FAB | زجاج غامق شفاف | زجاج كحلي غامق + حافة ذهبية |
| المدارات | أبيض | ذهبي (`--v2-gold-bright`/`--v2-gold`) |
| Panel body | `#f5f4f2` | `--v2-ink-deep` |
| Header | gradient من `--MainColor` | gradient navy/ink + serif title |
| Bot bubble | أبيض | `--v2-navy` + حدود ذهبية خفيفة |
| User bubble | `--MainColor` | `--v2-gold` نص غامق |
| Chips | حدود `--MainColor` | حدود hairline + hover ذهبي |
| Typing dots | رمادي | ذهبي |

---

## 8. Bugs اتصلّحت أثناء التطوير

1. **سؤال الفئات مبيتسألش** — الـ queue كان بيتبني جوه `setTimeout` بعد الـ fetch بيرد → الشرط `length > 0` بيفشل. **الحل**: بناء الـ queue متزامن في أول الـ effect.
2. **chips الفئات بتظهر فاضية** — stale closure: الـ chip action بتقفل على نسخة قديمة من `askQuestion` بـ `categories` فاضية. **الحل**: `categoriesRef` بدل state.
3. **الزرار بيبان مربع في V2** — `html[data-theme="v2"] button { border-radius: 0 !important }`. **الحل**: `button:not([class*="chat-"])` — ده كمان صلّح الـ chips المستديرة.
4. **الزرار بيغطي الـ cart bar** — الحل: `raised` positioning حسب حالة السلة.
5. **فقاعة الترغيب بتختفي للأبد** — كان cap `shownRef >= 4`. اتشال.

---

## 9. ملاحظات تشغيلية

- مفيش API call على تحميل الصفحة — أول request بيحصل عند فتح الشات (`categories` فورًا + `random-product` عند الـ spin).
- السعر والخصم بيرجعوا **final من السيرفر** — الـ frontend بيعرض بس.
- السيرفر بيعيد check الـ window على `placeOrder` — مفيش حاجة إضافية للـ checkout.
- مفيش تسريب فلاتر — الـ filters بتتبعت بس لـ `random-product`.
- TypeScript `tsc -b` نضيف — الصفر أخطاء.
