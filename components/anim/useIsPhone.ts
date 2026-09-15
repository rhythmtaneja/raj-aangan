"use client";

/**
 * useIsPhone
 * ---------------------------------------------------------------------------
 * React-state mirror of `isPhoneViewport()` from anim.config.ts, for the few
 * places where the phone/desktop split cannot be expressed in CSS.
 *
 * WHEN TO USE THIS — and when NOT to.
 *
 *   Almost every phone difference on this site belongs in a `md:` Tailwind
 *   variant, or (where an inline style would beat the class) in the
 *   `@media (max-width: 1023px)` block at the bottom of globals.css. Reach for
 *   this hook ONLY when JavaScript itself has to branch: a GSAP timeline that
 *   should be built differently, or — as in the two collage sections — a
 *   layout whose per-element coordinates are COMPUTED, so no media query can
 *   reach them.
 *
 * SSR SAFETY. The first client render must match the server's HTML, so the
 * initial value is always `false` (desktop) and the real value lands in an
 * effect on mount. Consumers therefore see one desktop frame before the phone
 * layout applies. For the collages that is invisible — they are below the
 * fold and their GSAP setup re-runs on the state change — but do not use this
 * for anything in the first viewport without checking that flash.
 * ---------------------------------------------------------------------------
 */

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
