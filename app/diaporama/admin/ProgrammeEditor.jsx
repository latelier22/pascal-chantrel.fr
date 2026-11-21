"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./editor.module.css";

const modeLabels = { horizontal: "TV horizontale", vertical: "Vitrine verticale" };
const normalize = (text) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export default function ProgrammeEditor({ programmes, screens, catalogue, images, savedIds, onChange }) {
  const [currentId, setCurrentId] = useState("");
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("product");

  const programme = programmes.find(({ id }) => id === currentId) || programmes[0];
  const productMap = new Map(catalogue.map((product) => [product.reference, product]));
  const imageMap = new Map(images.map((image) => [image.id, image]));
  const categories = [...new Set(catalogue.map((product) => product.category))];
  const used = new Set(programme?.items.map(({ kind, ref }) => `${kind}:${ref}`));
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const matching = (source === "product" ? catalogue : images).filter((item) => {
    if (source === "product" && category && item.category !== category) return false;
    const haystack = normalize([item.title, item.reference, item.category].filter(Boolean).join(" "));
    return terms.every((term) => haystack.includes(term));
  });

  function create() {
    const title = name.trim();
    if (!title || programmes.length >= 30) return;
    const base = normalize(title).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 65).replace(/-$/, "") || "diaporama";
    const id = `${base}-${crypto.randomUUID().slice(0, 8)}`;
    onChange({ programmes: [...programmes, { id, title, theme: "standard", items: [] }] });
    setCurrentId(id);
    setName("");
  }

  function edit(changes) {
    onChange({ programmes: programmes.map((item) => item.id === programme.id ? { ...item, ...changes } : item) });
  }

  function move(index, step) {
    const items = [...programme.items];
    [items[index], items[index + step]] = [items[index + step], items[index]];
    edit({ items });
  }

  function removeProgramme() {
    if (!window.confirm(`Retirer le diaporama « ${programme.title} » ?`)) return;
    onChange({
      programmes: programmes.filter(({ id }) => id !== programme.id),
      screens: Object.fromEntries(Object.entries(screens).map(([mode, id]) => [mode, id === programme.id ? "auto" : id])),
    });
    setCurrentId("");
  }

  return (
    <>
      <section className={styles.programmeBar} aria-labelledby="screens-heading">
        <h2 id="screens-heading">Diaporama diffusé sur chaque écran</h2>
        <div className={styles.screenChoices}>
          {Object.entries(modeLabels).map(([mode, label]) => (
            <label key={mode}>{label}
              <select value={screens[mode]} onChange={(event) => onChange({ screens: { ...screens, [mode]: event.target.value } })}>
                <option value="auto">Automatique · visuels actifs ou Noël</option>
                <option value="catalogue">Sélection de Noël</option>
                {programmes.map(({ id, title }) => <option key={id} value={id}>{title}</option>)}
              </select>
            </label>
          ))}
        </div>
      </section>

      <section className={styles.programmeBar} aria-labelledby="programmes-heading">
        <h2 id="programmes-heading">Mes diaporamas</h2>
        <div className={styles.programmeControls}>
          <label>Nouveau diaporama
            <input value={name} maxLength={80} placeholder="Ex. Promos du mois"
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); create(); } }} />
          </label>
          <button type="button" onClick={create} disabled={!name.trim() || programmes.length >= 30}>Créer</button>
          {programme && <label>Diaporama à modifier
            <select value={programme.id} onChange={(event) => setCurrentId(event.target.value)}>
              {programmes.map(({ id, title }) => <option key={id} value={id}>{title}</option>)}
            </select>
          </label>}
        </div>
      </section>

      {programme && (
        <>
          <section className={styles.programmeBar} aria-label="Réglages du diaporama">
            <div className={styles.programmeControls}>
              <label>Nom <input value={programme.title} required maxLength={80} onChange={(event) => edit({ title: event.target.value })} /></label>
              <label>Thème des produits <select value={programme.theme} onChange={(event) => edit({ theme: event.target.value })}>
                <option value="standard">Bleu et or</option><option value="noel">Noël</option>
              </select></label>
              <button type="button" onClick={removeProgramme}>Retirer le diaporama</button>
            </div>
            {savedIds.has(programme.id) ? (
              <nav className={styles.links} aria-label="Adresses dédiées du diaporama">
                {Object.entries(modeLabels).map(([mode, label]) => (
                  <Link key={mode} href={`/diaporama/${mode}?diapo=${programme.id}`} target="_blank">{label} · lien dédié</Link>
                ))}
              </nav>
            ) : <p>Enregistre ce diaporama pour obtenir ses liens dédiés.</p>}
          </section>

          <div className={styles.programmeGrid}>
            <section className={styles.programmePanel} aria-labelledby="library-heading">
              <h2 id="library-heading">Ajouter au diaporama</h2>
              <div className={styles.tabs}>
                <button type="button" aria-pressed={source === "product"} onClick={() => setSource("product")}>Tous les produits ({catalogue.length})</button>
                <button type="button" aria-pressed={source === "image"} onClick={() => setSource("image")}>Mes images ({images.length})</button>
              </div>
              <label>Rechercher <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nom ou référence" /></label>
              {source === "product" && <label>Rayon <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="">Tous les rayons</option>
                {categories.map((label) => <option key={label}>{label}</option>)}
              </select></label>}
              <ul className={styles.library}>
                {matching.map((item) => {
                  const ref = source === "product" ? item.reference : item.id;
                  const present = used.has(`${source}:${ref}`);
                  const url = source === "product" ? item.url : `/api/diaporama/image/${item.id}`;
                  return (
                    <li key={ref}>
                      <Thumbnail url={url} />
                      <div><strong>{item.title}</strong>{source === "product" && <p>{ref} · {item.price}{!item.available && " · Stock à vérifier"}</p>}</div>
                      <button type="button" disabled={present || programme.items.length >= 120} aria-label={`Ajouter ${item.title}`}
                        onClick={() => edit({ items: [...programme.items, { kind: source, ref, duration: item.duration, active: true }] })}>
                        {present ? "Ajouté" : "Ajouter"}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {matching.length === 0 && <p>Aucun résultat.</p>}
            </section>

            <section className={styles.programmePanel} aria-labelledby="order-heading">
              <h2 id="order-heading">Ordre de diffusion ({programme.items.length})</h2>
              {programme.items.length === 0 && <p>Ajoute un produit ou une image pour commencer.</p>}
              <ol className={styles.programmeItems}>
                {programme.items.map((item, index) => {
                  const entry = item.kind === "product" ? productMap.get(item.ref) : imageMap.get(item.ref);
                  const title = entry?.title || `Produit retiré · ${item.ref}`;
                  const url = item.kind === "product" ? entry?.url : `/api/diaporama/image/${item.ref}`;
                  function change(values) {
                    edit({ items: programme.items.map((other, position) => position === index ? { ...other, ...values } : other) });
                  }
                  return (
                    <li key={`${item.kind}:${item.ref}`}>
                      <div className={styles.itemTitle}><Thumbnail url={url} /><strong>{title}</strong></div>
                      <div className={styles.itemSettings}>
                        <label>Durée (s) <input type="number" min="2" max="120" required value={item.duration} onChange={(event) => change({ duration: event.target.value })} /></label>
                        <label className={styles.switch}><input type="checkbox" checked={item.active} onChange={(event) => change({ active: event.target.checked })} /> Diffuser</label>
                      </div>
                      <div className={styles.order}>
                        <button type="button" disabled={index === 0} onClick={() => move(index, -1)}>Monter</button>
                        <button type="button" disabled={index === programme.items.length - 1} onClick={() => move(index, 1)}>Descendre</button>
                        <button type="button" onClick={() => edit({ items: programme.items.filter((_, position) => position !== index) })}>Retirer</button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>
        </>
      )}
    </>
  );
}

function Thumbnail({ url }) {
  return <div className={styles.thumbnail} aria-hidden="true" style={url ? { backgroundImage: `url("${url}")` } : undefined} />;
}
