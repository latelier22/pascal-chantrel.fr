"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./editor.module.css";

const api = "/diaporama/admin/api";
const orientations = { both: "Les deux formats", horizontal: "Horizontal", vertical: "Vertical" };

async function request(options) {
  const response = await fetch(api, { cache: "no-store", ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Impossible de joindre le diaporama.");
  return data;
}

export default function SlideshowEditor() {
  const [playlist, setPlaylist] = useState(null);
  const [slides, setSlides] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function apply(data) {
    setPlaylist(data);
    setSlides(data.slides);
    setDirty(false);
  }

  async function run(job, success) {
    setBusy(true);
    setFeedback(null);
    try {
      apply(await job());
      if (success) setFeedback({ text: success });
    } catch (error) {
      setFeedback({ text: error.message, error: true });
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { run(() => request()); }, []);
  useEffect(() => {
    if (!dirty) return;
    const protect = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", protect);
    return () => window.removeEventListener("beforeunload", protect);
  }, [dirty]);

  function edit(index, changes) {
    setSlides(slides.map((slide, position) => position === index ? { ...slide, ...changes } : slide));
    setDirty(true);
  }

  function move(index, step) {
    const next = [...slides];
    const [slide] = next.splice(index, 1);
    next.splice(index + step, 0, slide);
    setSlides(next);
    setDirty(true);
  }

  async function upload(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const file = new FormData(form).get("image");
    if (!file?.size || file.size > 10 * 1024 * 1024) {
      setFeedback({ text: "Choisis une image JPG ou PNG de 10 Mo maximum.", error: true });
      return;
    }
    const data = new FormData();
    data.set("image", file);
    await run(async () => {
      const result = await request({ method: "POST", body: data });
      form.reset();
      return result;
    }, "Image ajoutée. Active-la, puis enregistre pour la diffuser.");
  }

  function save(event) {
    event.preventDefault();
    run(() => request({
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revision: playlist.revision, slides: slides.map((slide) => ({ ...slide, duration: Number(slide.duration) })) }),
    }), "Diaporama enregistré. Les écrans se mettent à jour automatiquement.");
  }

  return (
    <main className={styles.main}>
      <h1>Diaporama du magasin</h1>
      <nav className={styles.links} aria-label="Adresses des écrans">
        <Link href="/diaporama/horizontal" target="_blank">Écran horizontal (16:9)</Link>
        <Link href="/diaporama/vertical" target="_blank">Écran vertical (9:16)</Link>
      </nav>
      {feedback && <p className={styles.feedback} role={feedback.error ? "alert" : "status"}>{feedback.text}</p>}
      {!playlist ? (
        busy ? <p>Chargement…</p> : <button type="button" onClick={() => run(() => request())}>Réessayer</button>
      ) : (
        <>
          <form className={styles.upload} onSubmit={upload}>
            <label>Ajouter un visuel <input type="file" name="image" accept="image/jpeg,image/png" required disabled={busy || dirty} /></label>
            <button type="submit" disabled={busy || dirty}>Ajouter</button>
            {dirty ? <p>Enregistre tes modifications avant d’ajouter une image.</p> : <p>Format JPG ou PNG, 10 Mo maximum.</p>}
          </form>
          <form onSubmit={save}>
            <fieldset disabled={busy}>
              {slides.length === 0 && <p>Aucun visuel ajouté.</p>}
              <ol className={styles.list}>
                {slides.map((slide, index) => (
                  <li className={styles.slide} key={slide.id}>
                    <div className={styles.preview} style={{ backgroundImage: `url("/api/diaporama/image/${slide.id}")` }} aria-hidden="true" />
                    <div className={styles.fields}>
                      <label>Nom <input maxLength={120} value={slide.title} onChange={(event) => edit(index, { title: event.target.value })} /></label>
                      <label>Écran <select value={slide.orientation} onChange={(event) => edit(index, { orientation: event.target.value })}>
                        {Object.entries(orientations).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select></label>
                      <label>Durée (s) <input type="number" min="2" max="120" required value={slide.duration} onChange={(event) => edit(index, { duration: event.target.value })} /></label>
                      <label className={styles.switch}><input type="checkbox" checked={slide.active} onChange={(event) => edit(index, { active: event.target.checked })} /> Diffuser</label>
                    </div>
                    <div className={styles.order}>
                      <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Monter le visuel">Monter</button>
                      <button type="button" disabled={index === slides.length - 1} onClick={() => move(index, 1)} aria-label="Descendre le visuel">Descendre</button>
                      <button type="button" onClick={() => { if (window.confirm("Retirer ce visuel du diaporama ?")) { setSlides(slides.filter((_, i) => i !== index)); setDirty(true); } }}>Retirer</button>
                    </div>
                  </li>
                ))}
              </ol>
              <div className={styles.actions}>
                <button className={styles.primary} type="submit" disabled={!dirty || busy}>Enregistrer le diaporama</button>
                {dirty && <button type="button" onClick={() => run(() => request())}>Annuler les modifications</button>}
              </div>
            </fieldset>
          </form>
        </>
      )}
    </main>
  );
}
