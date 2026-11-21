"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        observer.unobserve(target);
        if (!motion.matches) target.animate(
          [{ opacity: 0.25, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 500, easing: "cubic-bezier(.2,.7,.3,1)" },
        );
      }
    }, { threshold: 0.08 });

    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
