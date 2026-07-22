import { useEffect, useState } from "react";

const INTRO_DURATION = 2500;

const useBrandIntro = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, INTRO_DURATION);

    return () => clearTimeout(timer);
  }, []);

  return show;
};

export default useBrandIntro;