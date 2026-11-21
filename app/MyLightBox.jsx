"use client";

import { useEffect } from "react";
import styles from "./home.module.css";

export default function MyLightBox({ photos }) {
  useEffect(() => {
    let mounted = true;
    import("tw-elements").then(({ Lightbox, initTE }) => {
      if (mounted) initTE({ Lightbox });
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div data-te-lightbox-init className={styles.serviceGallery}>
      {photos.map(({ url, alt }) => (
        <img key={url} src={`/images/${url}`} data-te-img={`/images/${url}`} alt={alt === "gallery" ? "" : alt}
          loading="lazy" />
      ))}
    </div>
  );
}
