import axios from "axios";

export interface DebugError {
  time: string;
  method: string;
  url: string;
  status: string;
  message: string;
}

const KEY = "debug_errors_enabled";
const errors: DebugError[] = [];
const listeners = new Set<(e: DebugError[]) => void>();

export const debugEnabled = () => {
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.has("debug") || q.has("gebug"))
      sessionStorage.setItem(KEY, "1");
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

const notify = () =>
  listeners.forEach((cb) => cb([...errors]));

export const subscribeErrors = (cb: (e: DebugError[]) => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export const pushError = (e: Omit<DebugError, "time">) => {
  errors.push({ ...e, time: new Date().toISOString() });
  if (errors.length > 50) errors.shift();
  notify();
};

if (typeof window !== "undefined") {
  // كل axios calls (useFetch/usePost/الـ thunks) بتعدي من هنا
  axios.interceptors.response.use(
    (r) => r,
    (err) => {
      if (debugEnabled() && err?.config) {
        pushError({
          method: (err.config.method || "get").toUpperCase(),
          url: err.config.url || "",
          status: err.response ? String(err.response.status) : (err.code || "NETWORK"),
          message: err.message || String(err),
        });
      }
      return Promise.reject(err);
    }
  );

  window.addEventListener("unhandledrejection", (ev) => {
    if (!debugEnabled()) return;
    const r = ev.reason;
    pushError({ method: "JS", url: "", status: "rejection", message: String(r?.message || r) });
  });
}
