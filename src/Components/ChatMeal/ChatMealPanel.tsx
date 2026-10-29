import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { X, ChefHat } from "lucide-react";
import { useAppSelector } from "../../Hooks/hooks";
import { useCart } from "../../Hooks/useCart";
import { fetchRandomMeal, fetchTermCategories } from "../../utilities/termsApi";
import { ImageUrl } from "../../EndPoints/EndPoints";
import PlaceHolderImage from "../../assets/WhatsApp Image 2025-10-08 at 16.02.14.jpeg";
import { ProductModal } from "../ProductsDetails/ProductModal";
import FeedbackToast from "../FeedbackToast/FeedbackToast";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import type {
  NextTermDTO,
  RandomMealFilters,
  TermCategoryDTO,
} from "../../DTO/TermsDTO";

interface Props {
  onClose: () => void;
}

interface Msg {
  id: number;
  role: "bot" | "user";
  kind: "text" | "product";
  text?: string;
  product?: ProductDTO;
}

interface Chip {
  label: string;
  solid?: boolean;
  action: () => void;
}

type Step = "diet" | "spicy" | "hungry" | "category";

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// فئات الدايت مش بتتعرض في سؤال الفئات — ليها سؤالها الخاص
const isDietCategory = (name: string): boolean =>
  /ريجيم|دايت|diet/i.test(name);

const ChatMealPanel = ({ onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { add: addToCartUnified } = useCart();
  const { selectedBranch } = useAppSelector(
    (state) => state.restaurantSettingsSlice
  );
  const lang = (i18n.language?.startsWith("ar") ? "ar" : "en") as "ar" | "en";

  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [chips, setChips] = useState<Chip[]>([]);
  const categoriesRef = useRef<TermCategoryDTO[]>([]);
  const [nextTerm, setNextTerm] = useState<NextTermDTO | null>(null);
  const [modalProduct, setModalProduct] = useState<ProductDTO | null>(null);
  const [showToast, setShowToast] = useState(false);

  const filtersRef = useRef<RandomMealFilters>({});
  const queueRef = useRef<Step[]>([]);
  const timersRef = useRef<number[]>([]);
  const idRef = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  const arr = (key: string): string[] => {
    const v = t(key, { returnObjects: true });
    return Array.isArray(v) ? (v as string[]) : [];
  };

  const later = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages, typing, chips, nextTerm]);

  const say = useCallback((msg: Omit<Msg, "id">) => {
    setMessages((m) => [...m, { ...msg, id: ++idRef.current }]);
  }, []);

  // رسالة من الـ bot بعد typing عشوائي
  const botSay = useCallback(
    (text: string, after?: () => void) => {
      setChips([]);
      setTyping(true);
      later(() => {
        setTyping(false);
        say({ role: "bot", kind: "text", text });
        after?.();
      }, 700 + Math.random() * 800);
    },
    [later, say]
  );

  const askQuestion = useCallback(
    (step: Step) => {
      if (step === "diet") {
        botSay(pick(arr("chatMeal.q_diet")), () =>
          setChips([
            {
              label: t("chatMeal.opts.dietYes"),
              action: () =>
                answer(t("chatMeal.opts.dietYes"), () => {
                  filtersRef.current.is_diet = 1;
                  // السعرات بس للي عامل دايت
                  queueRef.current.unshift("hungry");
                }),
            },
            {
              label: t("chatMeal.opts.dietNo"),
              action: () => answer(t("chatMeal.opts.dietNo")),
            },
            surpriseChip(),
          ])
        );
      } else if (step === "spicy") {
        botSay(pick(arr("chatMeal.q_spicy")), () =>
          setChips([
            {
              label: t("chatMeal.opts.spicy"),
              action: () => answer(t("chatMeal.opts.spicy"), () => { filtersRef.current.is_spicy = 1; }),
            },
            {
              label: t("chatMeal.opts.mild"),
              action: () => answer(t("chatMeal.opts.mild"), () => { filtersRef.current.is_spicy = 0; }),
            },
            {
              label: t("chatMeal.opts.any"),
              action: () => answer(t("chatMeal.opts.any")),
            },
            surpriseChip(),
          ])
        );
      } else if (step === "hungry") {
        botSay(pick(arr("chatMeal.q_hungry")), () =>
          setChips([
            {
              label: t("chatMeal.opts.light"),
              action: () => answer(t("chatMeal.opts.light"), () => { filtersRef.current.max_calories = 400; }),
            },
            {
              label: t("chatMeal.opts.medium"),
              action: () => answer(t("chatMeal.opts.medium"), () => { filtersRef.current.max_calories = 700; }),
            },
            {
              label: t("chatMeal.opts.heavy"),
              action: () => answer(t("chatMeal.opts.heavy")),
            },
            surpriseChip(),
          ])
        );
      } else if (step === "category") {
        // السؤال مبني على الفئات الحقيقية بتاعة الـ term المفتوح
        const cats = [...categoriesRef.current]
          .filter((c) => !isDietCategory(c.name))
          .sort((a, b) => b.products_count - a.products_count)
          .slice(0, 9);
        if (cats.length === 0) {
          const next = queueRef.current.shift();
          if (next) askQuestion(next);
          else spin();
          return;
        }
        const first = cats.slice(0, 3);
        const rest = cats.slice(3);
        const catChip = (c: TermCategoryDTO): Chip => ({
          label: c.name,
          action: () =>
            answer(c.name, () => {
              filtersRef.current.category_id = c.id;
            }),
        });
        const names = first.map((c) => c.name);
        const or = t("chatMeal.or");
        const list =
          names.length > 1
            ? `${names.slice(0, -1).join("، ")} ${or} ${names[names.length - 1]}`
            : names.join("");
        botSay(`${pick(arr("chatMeal.q_cat"))} ${list}؟`, () =>
          setChips([
            ...first.map(catChip),
            ...(rest.length > 0
              ? [
                  {
                    label: t("chatMeal.opts.somethingElse"),
                    action: () => {
                      say({
                        role: "user",
                        kind: "text",
                        text: t("chatMeal.opts.somethingElse"),
                      });
                      botSay(t("chatMeal.moreCats"), () =>
                        setChips([
                          ...rest.map(catChip),
                          {
                            label: t("chatMeal.opts.any"),
                            action: () => answer(t("chatMeal.opts.any")),
                          },
                          surpriseChip(),
                        ])
                      );
                    },
                  } as Chip,
                ]
              : []),
            {
              label: t("chatMeal.opts.any"),
              action: () => answer(t("chatMeal.opts.any")),
            },
            surpriseChip(),
          ])
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [botSay, t, i18n.language]
  );

  const surpriseChip = (): Chip => ({
    label: t("chatMeal.opts.surprise"),
    solid: true,
    action: () => answer(t("chatMeal.opts.surprise"), () => { queueRef.current = []; }, spin),
  });

  const answer = useCallback(
    (label: string, apply?: () => void, override?: () => void) => {
      setChips([]);
      apply?.();
      say({ role: "user", kind: "text", text: label });
      if (override) {
        override();
        return;
      }
      const next = queueRef.current.shift();
      if (next) {
        askQuestion(next);
      } else {
        spin();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [say, askQuestion]
  );

  const pushResultActions = useCallback(
    (product: ProductDTO) => {
      setChips([
        {
          label: t("chatMeal.actions.add"),
          solid: true,
          action: () => {
            if (Number(product.price) === 0 || product.variations?.length) {
              setModalProduct(product);
              return;
            }
            addToCartUnified({ ...product, price: Number(product.price) }, 1);
            setShowToast(true);
          },
        },
        {
          label: t("chatMeal.actions.details"),
          action: () => setModalProduct(product),
        },
        {
          label: t("chatMeal.actions.retry"),
          action: () => {
            say({ role: "user", kind: "text", text: t("chatMeal.actions.retry") });
            spin();
          },
        },
        {
          label: t("chatMeal.actions.restart"),
          action: () => restart(),
        },
      ]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, say, t]
  );

  const spin = useCallback(() => {
    setChips([]);
    setTyping(true);
    later(async () => {
      try {
        const data = await fetchRandomMeal(filtersRef.current, {
          branchId: selectedBranch,
          lang,
        });
        setTyping(false);

        if (data.term && data.product) {
          say({ role: "bot", kind: "text", text: pick(arr("chatMeal.result_intro")) });
          say({ role: "bot", kind: "product", product: data.product });
          later(() => {
            say({ role: "bot", kind: "text", text: pick(arr("chatMeal.result_ask")) });
            pushResultActions(data.product!);
          }, 500);
          return;
        }

        if (data.term) {
          // مفيش منتج مطابق للفلاتر
          say({ role: "bot", kind: "text", text: pick(arr("chatMeal.no_match")) });
          setChips([
            {
              label: t("chatMeal.actions.resetFilters"),
              solid: true,
              action: () => {
                filtersRef.current = {};
                say({ role: "user", kind: "text", text: t("chatMeal.actions.resetFilters") });
                spin();
              },
            },
            { label: t("chatMeal.actions.restart"), action: () => restart() },
          ]);
          return;
        }

        // مفيش term مفتوح
        setNextTerm(data.next_term);
        say({ role: "bot", kind: "text", text: pick(arr("chatMeal.closed")) });
        setChips([
          { label: t("chatMeal.actions.close"), solid: true, action: onClose },
          { label: t("chatMeal.actions.restart"), action: () => restart() },
        ]);
      } catch {
        setTyping(false);
        say({ role: "bot", kind: "text", text: t("chatMeal.error") });
        setChips([
          { label: t("chatMeal.actions.retry"), solid: true, action: spin },
          { label: t("chatMeal.actions.close"), action: onClose },
        ]);
      }
    }, 1400 + Math.random() * 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [later, say, pushResultActions, selectedBranch, lang, t, onClose]);

  const restart = useCallback(() => {
    filtersRef.current = {};
    setNextTerm(null);
    const steps: Step[] = (["diet", "spicy"] as Step[]).sort(
      () => Math.random() - 0.5
    );
    if (categoriesRef.current.some((c) => !isDietCategory(c.name)))
      steps.splice(Math.floor(Math.random() * (steps.length + 1)), 0, "category");
    queueRef.current = steps;
    say({ role: "user", kind: "text", text: t("chatMeal.actions.restart") });
    botSay(pick(arr("chatMeal.greet")), () => {
      const next = queueRef.current.shift();
      if (next) askQuestion(next);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botSay, askQuestion, say, t]);

  // بداية المحادثة — الـ cleanup بيلغي timers أي إعادة mount بترجع من الأول
  useEffect(() => {
    // ابني الـ queue فورًا عشان الـ categories يلحقوا يتضافوا عليها
    queueRef.current = (["diet", "spicy"] as Step[]).sort(
      () => Math.random() - 0.5
    );

    // هات الأقسام في الخلفية — لو فيه term مفتوح نضيف سؤال القسم على الـ queue
    fetchTermCategories({ branchId: selectedBranch, lang })
      .then((d) => {
        const cats = d.categories ?? [];
        categoriesRef.current = cats;
        if (
          cats.some((c) => !isDietCategory(c.name)) &&
          queueRef.current.length > 0 &&
          !queueRef.current.includes("category")
        ) {
          queueRef.current.splice(
            Math.floor(Math.random() * (queueRef.current.length + 1)),
            0,
            "category"
          );
        }
      })
      .catch(() => {});

    setTyping(true);
    later(() => {
      setTyping(false);
      say({ role: "bot", kind: "text", text: pick(arr("chatMeal.greet")) });
      const first = queueRef.current.shift();
      if (first) askQuestion(first);
    }, 900 + Math.random() * 700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const opensInText = (nt: NextTermDTO): string => {
    const opens = new Date(nt.opens_at.replace(" ", "T")).getTime();
    const mins = Math.max(0, Math.round((opens - Date.now()) / 60000));
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const time =
      h > 0 ? `${h} ${t("chatMeal.hours")} ${m} ${t("chatMeal.minutes")}` : `${m} ${t("chatMeal.minutes")}`;
    return t("chatMeal.opensIn", { term: nt.name, time });
  };

  return createPortal(
    <>
      <div className="chat-panel" role="dialog" aria-label={t("chatMeal.title")}>
        <div className="chat-head">
          <span className="chat-avatar">
            <ChefHat size={18} />
          </span>
          <div>
            <div className="chat-title">{t("chatMeal.title")}</div>
            <div className="chat-sub">{t("chatMeal.subtitle")}</div>
          </div>
          <button type="button" className="chat-close" onClick={onClose} aria-label="close">
            <X size={18} />
          </button>
        </div>

        <div className="chat-body" ref={bodyRef}>
          {messages.map((m) =>
            m.kind === "product" && m.product ? (
              <div key={m.id} className="chat-msg bot product-card">
                <div className="chat-product">
                  <img
                    src={m.product.image ? `${ImageUrl}/${m.product.image}` : PlaceHolderImage}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PlaceHolderImage;
                    }}
                    alt={m.product.name}
                  />
                  <div className="cp-body">
                    <span className="cp-name">{m.product.name}</span>
                    {m.product.description && (
                      <span className="cp-desc">{m.product.description}</span>
                    )}
                    <span className="cp-price">
                      {Number(m.product.price) > 0
                        ? `${Number(m.product.price).toFixed(2)} ${t("currency")}`
                        : t("chatMeal.priceOnSelection")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div key={m.id} className={`chat-msg ${m.role}`}>
                {m.text}
              </div>
            )
          )}

          {typing && (
            <div className="chat-typing" aria-label="typing">
              <span />
              <span />
              <span />
            </div>
          )}

          {nextTerm && (
            <div className="chat-countdown">{opensInText(nextTerm)}</div>
          )}

          {chips.length > 0 && (
            <div className="chat-chips">
              {chips.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  className={`chat-chip${c.solid ? " solid" : ""}`}
                  onClick={c.action}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalProduct && (
        <ProductModal
          show={!!modalProduct}
          handleClose={() => setModalProduct(null)}
          product={modalProduct}
        />
      )}

      <FeedbackToast
        message={t("item_added_successfully")}
        show={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />
    </>,
    document.body
  );
};

export default ChatMealPanel;
