import { useState } from "react";

const KEY = "v2-theme-mode";
export type V2ThemeMode = "v2" | "v2-light";

export const getV2ThemeMode = (): V2ThemeMode =>
  (localStorage.getItem(KEY) as V2ThemeMode) || "v2";

export const applyV2ThemeMode = (mode: V2ThemeMode) => {
  document.documentElement.dataset.theme = mode;
  localStorage.setItem(KEY, mode);
};

/* بيفرّج عن وضع الثيم الحالي + toggle بين dark/light — بيحفظ الاختيار في localStorage */
export const useV2Theme = () => {
  const [mode, setMode] = useState<V2ThemeMode>(getV2ThemeMode);

  const toggle = () => {
    const next: V2ThemeMode = mode === "v2" ? "v2-light" : "v2";
    applyV2ThemeMode(next);
    setMode(next);
  };

  return { mode, toggle };
};
