import { useEffect, useState } from "react";

const INTRO_DURATION = 1500;

const useBrandIntro = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("brand_intro_seen");
  });

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem("brand_intro_seen", "true");
    const timer = setTimeout(() => {
      setShow(false);
    }, INTRO_DURATION);

    return () => clearTimeout(timer);
  }, [show]);

  return show;
};

export default useBrandIntro;
