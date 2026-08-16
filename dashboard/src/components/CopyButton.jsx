import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";

function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (non-secure context) — nothing to do.
    }
  }

  return (
    <button
      className="btn btn-ghost btn-icon"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
    >
      {copied ? <Check size={14} color="var(--ok-text)" /> : <Copy size={14} />}
    </button>
  );
}

export default CopyButton;
