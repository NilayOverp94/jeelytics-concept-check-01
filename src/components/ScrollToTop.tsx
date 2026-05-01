import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const unlockScroll = () => {
      for (const element of [document.documentElement, document.body]) {
        element.style.removeProperty("overflow");
        element.style.removeProperty("overflow-x");
        element.style.removeProperty("overflow-y");
        element.style.removeProperty("height");
        element.style.removeProperty("max-height");
        element.style.removeProperty("pointer-events");
        element.removeAttribute("data-scroll-locked");
      }
    };

    unlockScroll();
    window.scrollTo({ top: 0, left: 0 });

    const fastReset = window.setTimeout(unlockScroll, 50);
    const slowReset = window.setTimeout(unlockScroll, 250);

    return () => {
      window.clearTimeout(fastReset);
      window.clearTimeout(slowReset);
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop;
