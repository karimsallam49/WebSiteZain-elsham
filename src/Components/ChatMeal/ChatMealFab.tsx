import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircleMore } from "lucide-react";
import ChatMealPanel from "./ChatMealPanel";
import "./ChatMeal.css";

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const ChatMealFab = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [invite, setInvite] = useState<string | null>(null);
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

      {open && <ChatMealPanel onClose={() => setOpen(false)} />}
    </>
  );
};

export default ChatMealFab;
