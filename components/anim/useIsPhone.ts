"use client";

import { useEffect, useState } from "react";
import { PHONE_MAX_WIDTH } from "./anim.config";

export default function useIsPhone(): boolean {
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${PHONE_MAX_WIDTH}px)`);
    const sync = () => setIsPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return isPhone;
}
