import { useCallback, useRef } from "react";

/**
 * Drag-to-scroll للـ rails الأفقية على الديسكتوب —
 * الـ touch بيتحرك native بس الماوس محتاج ده.
 * - scroll-snap بيتقفل أثناء السحب عشان ميكونش فيه مقاومة
 * - التحديث بيتم عن طريق requestAnimationFrame مش على كل pointermove
 * - momentum/inertia بعد ما تسيب — بيكمل انزلاق ويقل سرعته بالتدريج
 * - بيمنع الـ click اللي بيجي ورا الـ drag عشان الـ tiles ميتفتحش بالغلط
 */
export const useDragScroll = <T extends HTMLElement>() => {
  const state = useRef({
    down: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    rafId: 0,
    pendingX: 0,
  });
  const cleanupRef = useRef<(() => void) | null>(null);

  const ref = useCallback((node: T | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (!node) return;

    const cancelRaf = () => {
      if (state.current.rafId) {
        cancelAnimationFrame(state.current.rafId);
        state.current.rafId = 0;
      }
    };

    const down = (e: PointerEvent) => {
      // الـ touch والـ pen بيسكرولوا native — الماوس بس اللي محتاج drag
      if (e.pointerType !== "mouse") return;
      cancelRaf();
      state.current = {
        ...state.current,
        down: true,
        startX: e.clientX,
        lastX: e.clientX,
        lastT: performance.now(),
        scrollLeft: node.scrollLeft,
        moved: false,
        velocity: 0,
        pendingX: e.clientX,
      };
    };

    const move = (e: PointerEvent) => {
      const s = state.current;
      if (!s.down) return;
      s.pendingX = e.clientX;

      // velocity من آخر حركة — بتتحسب للـ momentum
      const now = performance.now();
      const dt = now - s.lastT;
      if (dt > 0) {
        // EMA خفيف عشان الـ velocity تبقى سموزه مش قافزة
        s.velocity = s.velocity * 0.7 + ((e.clientX - s.lastX) / dt) * 0.3;
        s.lastX = e.clientX;
        s.lastT = now;
      }

      if (s.rafId) return;
      s.rafId = requestAnimationFrame(() => {
        s.rafId = 0;
        const dx = s.pendingX - s.startX;
        if (Math.abs(dx) > 4) {
          s.moved = true;
          node.classList.add("v2-dragging");
        }
        node.scrollLeft = s.scrollLeft - dx;
      });
    };

    const up = () => {
      const s = state.current;
      if (!s.down) return;
      s.down = false;
      cancelRaf();
      node.classList.remove("v2-dragging");

      // momentum — نكمل انزلاق بالـ velocity اللي اتسابنا عليها
      if (s.moved && Math.abs(s.velocity) > 0.15) {
        let v = s.velocity * 18; // px/frame تقريبًا
        const glide = () => {
          v *= 0.94; // تقليل تدريجي للسرعة
          if (Math.abs(v) < 0.5) {
            setTimeout(() => (s.moved = false), 50);
            return;
          }
          node.scrollLeft -= v;
          s.rafId = requestAnimationFrame(glide);
        };
        s.rafId = requestAnimationFrame(glide);
        return;
      }

      // مفيش momentum — نصفر الـ moved بعد الـ click اللي جاي
      setTimeout(() => (s.moved = false), 50);
    };

    const clickCapture = (e: MouseEvent) => {
      if (state.current.moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    node.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    node.addEventListener("click", clickCapture, true);

    cleanupRef.current = () => {
      cancelRaf();
      node.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      node.removeEventListener("click", clickCapture, true);
    };
  }, []);

  return ref;
};
