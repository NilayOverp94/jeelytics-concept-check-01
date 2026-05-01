import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Clear any leftover scroll lock from a previously-open Radix dialog
    // (only runs on route change, doesn't interfere with currently-open modals)
    for (const element of [document.documentElement, document.body]) {
      element.style.removeProperty("overflow");
      element.style.removeProperty("pointer-events");
      element.removeAttribute("data-scroll-locked");
    }
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
