"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./home.module.css";

const slides = [
  { title: "Électroménager", href: "/electromenager" },
  { title: "Antennes TV", href: "/antennes-tv", image: "/images/antennestv-2.jpg" },
  { title: "Ramonage", href: "/ramonage", image: "/images/ramonage-1.png" },
];

export default function HomeHeroVisual() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (paused || hovered || focused || reduced) return;
    const timer = window.setInterval(() => setIndex((previous) => (previous + 1) % slides.length), 5600);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, reduced]);

  const slide = slides[index];
  return (
    <div className={styles.heroVisual} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <Link href={slide.href} className={styles.slideLink} aria-label={`Découvrir ${slide.title}`}>
        <div key={index} className={styles.slideImage} data-slide={index} aria-hidden="true">
          {slide.image ? <Image src={slide.image} fill sizes="(max-width: 640px) 100vw, 580px" alt="" /> : (
            <>
              <div className={styles.heroOrbit} />
              <Image className={styles.fridge} src="/images/stock/b12ba25ad45da7f74acf0205.jpg" width={350} height={600} alt="" priority />
              <Image className={styles.washer} src="/images/stock/6207e6b302a2b4e997e3d37d.jpg" width={360} height={440} alt="" priority />
            </>
          )}
        </div>
        <span className={styles.slideCaption}>{slide.title}</span>
      </Link>
      <div className={styles.slideControls} aria-label="Visuels d’accueil">
        {slides.map(({ title }, position) => (
          <button key={title} type="button" aria-label={title} aria-pressed={position === index}
            onClick={() => { setIndex(position); setPaused(true); }} />
        ))}
        {!reduced && <button type="button" className={styles.pause} onClick={() => setPaused(!paused)}>
          {paused ? "Reprendre" : "Pause"}
        </button>}
      </div>
    </div>
  );
}
