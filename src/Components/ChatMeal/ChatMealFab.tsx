import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircleMore } from "lucide-react";
import ChatMealPanel from "./ChatMealPanel";
import { ProductModal } from "../ProductsDetails/ProductModal";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { useFetch } from "../../Hooks/useFetch";
import { termsStatusUrl } from "../../EndPoints/EndPoints";
import "./ChatMeal.css";

interface TermStatus {
  is_active_now: boolean;
  active_term: { id: number; name: string; start_time: string; end_time: string } | null;
  next_term: { id: number; name: string; start_time: string; end_time: string; opens_at: string } | null;
  server_time: string;
}

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const ChatMealFab = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";

  // الشات بيظهر بس وقت الـ term النشط — لو مقفول مخفي خالص
  const { data: termStatus } = useFetch<TermStatus>(lang, termsStatusUrl);
  const [open, setOpen] = useState(false);
  const [invite, setInvite] = useState<string | null>(null);
  // مودال المنتج هنا عشان يفضل شغال بعد ما الـ panel تقفل
  const [modalProduct, setModalProduct] = useState<ProductDTO | null>(null);
  const timerRef = useRef<number | null>(null);

  // يطلع رسالة ترغيب كل ~5 ثواني (أول 4 مرات بس عشان متبقاش مزعجة)
  useEffect(() => {
    if (open) {
      setInvite(null);
      return;
    }
    const hints = t("chatMeal.fabHints", { returnObjects: true }) as string[];
    const tick = () => {
      setInvite(pick(hints));
      timerRef.current = window.setTimeout(() => setInvite(null), 4500);
    };
    // أول رسالة بعد ثانيتين من التحميل، وبعدين كل ~9 ثواني
    timerRef.current = window.setTimeout(tick, 2000);
    const interval = window.setInterval(tick, 9000);
    return () => {
      window.clearInterval(interval);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (termStatus && !termStatus.is_active_now) return null;

  return (
    <>
      {!open && invite && <div className="chat-invite">{invite}</div>}

      {!open && (
        <button
          type="button"
          className="chat-fab"
          onClick={() => setOpen(true)}
          aria-label={t("chatMeal.title")}
          title={t("chatMeal.title")}
        >
          <MessageCircleMore size={28} strokeWidth={2.2} color="#fff" />
        </button>
      )}

      {open && (
        <ChatMealPanel
          onClose={() => setOpen(false)}
          onShowProduct={(p) => {
            setOpen(false);
            setModalProduct(p);
          }}
        />
      )}

      {modalProduct && (
        <ProductModal
          show
          handleClose={() => setModalProduct(null)}
          product={modalProduct}
        />
      )}
    </>
  );
};

export default ChatMealFab;
