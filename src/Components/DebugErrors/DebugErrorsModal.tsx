import { useEffect, useState } from "react";
import { Copy, Bug, X } from "lucide-react";
import {
  debugEnabled,
  subscribeErrors,
  type DebugError,
} from "../../utilities/debugErrors";

const DebugErrorsModal = () => {
  const [enabled, setEnabled] = useState(false);
  const [errors, setErrors] = useState<DebugError[]>([]);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!debugEnabled()) return;
    setEnabled(true);
    return subscribeErrors((list) => {
      setErrors(list);
      if (list.length) setOpen(true);
    });
  }, []);

  if (!enabled || !open || errors.length === 0) return null;

  const text = errors
    .map((e) => `[${e.time}] ${e.method} ${e.url}\n  ${e.status} — ${e.message}`)
    .join("\n\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,.6)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onClick={() => setOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          maxHeight: "70vh",
          background: "#fff",
          borderRadius: "16px 16px 0 0",
          padding: 14,
          display: "flex",
          flexDirection: "column",
          direction: "ltr",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <strong style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Bug size={18} /> API Errors ({errors.length})
          </strong>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={copy}
              style={{
                display: "flex",
                gap: 4,
                alignItems: "center",
                border: "none",
                background: "#c9a35b",
                color: "#241a05",
                fontWeight: 700,
                fontSize: 13,
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              <Copy size={14} /> {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{
                border: "1px solid #ddd",
                background: "#fff",
                borderRadius: 8,
                width: 32,
                height: 32,
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div style={{ overflowY: "auto", fontSize: 12, fontFamily: "monospace" }}>
          {errors.map((e, i) => (
            <div
              key={i}
              style={{
                borderBottom: "1px solid #eee",
                padding: "8px 4px",
                wordBreak: "break-all",
              }}
            >
              <div style={{ color: "#888" }}>{e.time}</div>
              <div>
                <b>{e.method}</b> {e.url}
              </div>
              <div style={{ color: "#c0392b" }}>
                {e.status} — {e.message}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebugErrorsModal;
