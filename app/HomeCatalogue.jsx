"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./home.module.css";

const categories = [
  ["", "Tous"],
  ["Gros électroménager", "Gros électroménager"],
  ["Tv - Image - Son", "TV et son"],
  ["Petit-électroménager", "Petit électroménager"],
  ["Maison - Entretien", "Maison et entretien"],
];

const normalize = (value) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export default function HomeCatalogue({ products }) {
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const matching = products.filter((product) => {
    if (category && product.category !== category) return false;
    const text = normalize([product.type, product.reference, product.brand, product.description, product.category].join(" "));
    return terms.every((term) => text.includes(term));
  });
  const visible = expanded || terms.length ? matching : matching.slice(0, 4);

  return (
    <section data-reveal className={styles.catalogue} id="catalogue" aria-labelledby="catalogue-title">
      <div className={styles.sectionHeading}>
        <h2 id="catalogue-title">Le catalogue</h2>
        <Link className={styles.textLink} href="/electromenager">Voir tous les rayons</Link>
      </div>
      <div className={styles.controls}>
        <div className={styles.filters} role="group" aria-label="Filtrer par rayon">
          {categories.map(([value, label]) => (
            <button key={label} type="button" aria-pressed={category === value} onClick={() => {
              setCategory(value);
              setExpanded(false);
            }}>
              {label}
            </button>
          ))}
        </div>
        <input className={styles.search} type="search" aria-label="Rechercher dans le catalogue"
          placeholder="Marque, référence, appareil…" value={query}
          onChange={(event) => { setQuery(event.target.value); setExpanded(false); }} />
      </div>

      {terms.length > 0 && <p className={styles.resultCount} role="status">{matching.length} résultat{matching.length !== 1 && "s"}</p>}
      {matching.length === 0 && <p>Aucun produit ne correspond à cette recherche.</p>}
      <div className={styles.productGrid}>
        {visible.map((product) => (
          <Link className={styles.product} key={product.id} href={`/produit/${encodeURIComponent(product.id)}`}>
            <div className={styles.productPhoto}>
              {product.image ? (
                <Image src={product.image} alt="" fill sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, 260px" />
              ) : <span>Photo à venir</span>}
            </div>
            <div className={styles.productCopy}>
              <h3>{product.type} {product.brand}</h3>
              <p>{product.reference}</p>
              <strong>{product.price}</strong>
            </div>
          </Link>
        ))}
      </div>
      {visible.length < matching.length && (
        <button className={styles.more} type="button" onClick={() => setExpanded(true)}>
          Afficher les {matching.length} produits
        </button>
      )}
    </section>
  );
}
