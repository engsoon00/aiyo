import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Footer links like "/#pricing" arrive as a route change, not a same-page
 * anchor jump, so the browser won't scroll on its own. This closes that gap.
 */
export function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash, pathname]);

  return null;
}
