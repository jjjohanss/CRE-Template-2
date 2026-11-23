import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function CountUp({ target, duration = 2000, prefix = "", suffix = "", useComma = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = null;
    let rafId;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target, duration]);

  const formatted = useComma ? count.toLocaleString() : count.toString();
  return (
    <span ref={ref}>
      {prefix}{formatted}{suffix}
    </span>
  );
}