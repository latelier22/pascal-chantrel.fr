import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const directory = process.env.SLIDESHOW_STATE_DIR || join(process.cwd(), ".slideshow");
const manifest = join(directory, "playlist.json");
export const maxImageSize = 10 * 1024 * 1024;
export const validImageId = /^[0-9a-f-]{36}\.(jpg|png)$/;
export const programmeSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const screenDefaults = { horizontal: "auto", vertical: "auto" };

export const orientations = ["horizontal", "vertical", "both"];
let writes = Promise.resolve();

export async function readPlaylist() {
  const defaults = { revision: 0, slides: [], programmes: [], screens: screenDefaults };
  try {
    return { ...defaults, ...JSON.parse(await readFile(manifest, "utf8")) };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return defaults;
  }
}

function mutate(update) {
  const task = writes.then(async () => {
    const current = await readPlaylist();
    const changes = await update(current);
    const playlist = { ...current, ...changes, revision: current.revision + 1 };
    const temp = join(directory, randomUUID() + ".tmp");
    await mkdir(directory, { recursive: true, mode: 0o700 });
    try {
      await writeFile(temp, JSON.stringify(playlist), { mode: 0o600 });
      await rename(temp, manifest);
    } finally {
      await rm(temp, { force: true });
    }
    return playlist;
  });
  writes = task.catch(() => {});
  return task;
}

export class PlaylistError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export async function addImage(file) {
  if (!file || typeof file.arrayBuffer !== "function" || !file.size || file.size > maxImageSize) {
    throw new PlaylistError("Choisis une image JPG ou PNG de 10 Mo maximum.");
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const jpg = bytes.length > 8 && bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255])) &&
    bytes.subarray(-2).equals(Buffer.from([255, 217]));
  const png = bytes.length > 32 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
    bytes.subarray(12, 16).toString() === "IHDR";
  if (!jpg && !png) throw new PlaylistError("L’image doit être un fichier JPG ou PNG valide.");

  const id = `${randomUUID()}.${jpg ? "jpg" : "png"}`;
  const path = join(directory, id);
  let created = false;
  try {
    return await mutate(async ({ slides }) => {
      if (slides.length >= 80) throw new PlaylistError("La liste est limitée à 80 visuels.");
      await mkdir(directory, { recursive: true, mode: 0o700 });
      await writeFile(path, bytes, { flag: "wx", mode: 0o600 });
      created = true;
      return { slides: [...slides, { id, title: file.name.replace(/\.[^.]*$/, "").slice(0, 120), duration: 8, active: false, orientation: "both" }] };
    });
  } catch (error) {
    if (created) await rm(path, { force: true });
    throw error;
  }
}

export async function savePlaylist(revision, slides, programmes, screens, catalogue) {
  if (!Number.isInteger(revision) || !Array.isArray(slides)) throw new PlaylistError("Liste invalide.");
  let removed = [];
  const result = await mutate((current) => {
    if (revision !== current.revision) throw new PlaylistError("La liste a changé. Recharge-la avant d’enregistrer.", 409);
    const existing = new Set(current.slides.map(({ id }) => id));
    const seen = new Set();
    const next = slides.map((slide) => {
      if (!slide || typeof slide.id !== "string" || !existing.has(slide.id) || seen.has(slide.id) ||
        typeof slide.title !== "string" || slide.title.length > 120 || typeof slide.active !== "boolean" ||
        !orientations.includes(slide.orientation) || !Number.isInteger(slide.duration) || slide.duration < 2 || slide.duration > 120) {
        throw new PlaylistError("Vérifie les visuels et leur durée (2 à 120 secondes).");
      }
      const { id, title, duration, active, orientation } = slide;
      seen.add(id);
      return { id, title: title.trim(), duration, active, orientation };
    });
    removed = [...existing].filter((id) => !seen.has(id));
    const savedProgrammes = programmes === undefined
      ? current.programmes
      : validateProgrammes(programmes, current.programmes, existing, catalogue);
    if (savedProgrammes.some(({ items }) => items.some(({ kind, ref }) => kind === "image" && !seen.has(ref)))) {
      throw new PlaylistError("Une image retirée figure encore dans un diaporama. Retire-la d’abord de la liste qui l’utilise.");
    }
    return {
      slides: next,
      programmes: savedProgrammes,
      screens: validateScreens(screens ?? current.screens, savedProgrammes),
    };
  });
  await Promise.allSettled(removed.map((id) => rm(join(directory, id), { force: true })));
  return result;
}

function validateProgrammes(programmes, previous, imageIds, catalogue) {
  if (!Array.isArray(programmes) || programmes.length > 30) {
    throw new PlaylistError("Tu peux enregistrer jusqu’à 30 diaporamas.");
  }
  const slugs = new Set();
  const productRefs = new Set(catalogue.map(({ reference }) => reference));
  const saved = new Map(previous.map(({ id, items }) => [id, new Set(items
    .filter(({ kind }) => kind === "product").map(({ ref }) => ref))]));

  return programmes.map((programme) => {
    const { id, title, items, theme } = programme ?? {};
    if (typeof id !== "string" || id.length > 80 || !programmeSlug.test(id) || slugs.has(id) ||
      id === "auto" || id === "catalogue" || typeof title !== "string" || !title.trim() || title.length > 80 ||
      !["standard", "noel"].includes(theme) || !Array.isArray(items) || items.length > 120) {
      throw new PlaylistError("Vérifie le nom et le contenu de chaque diaporama.");
    }
    slugs.add(id);
    const used = new Set();
    const validated = items.map((item) => {
      const { kind, ref, duration, active } = item ?? {};
      const key = `${kind}:${ref}`;
      const exists = kind === "product" ? (productRefs.has(ref) || saved.get(id)?.has(ref)) :
        kind === "image" && imageIds.has(ref);
      if (typeof ref !== "string" || !exists || used.has(key) || typeof active !== "boolean" ||
        !Number.isInteger(duration) || duration < 2 || duration > 120) {
        throw new PlaylistError("Vérifie les éléments du diaporama et leur durée (2 à 120 secondes).");
      }
      used.add(key);
      return { kind, ref, duration, active };
    });
    return { id, title: title.trim(), theme, items: validated };
  });
}

function validateScreens(screens, programmes) {
  const choices = new Set(["auto", "catalogue", ...programmes.map(({ id }) => id)]);
  const { horizontal, vertical } = screens ?? {};
  if (!choices.has(horizontal) || !choices.has(vertical)) throw new PlaylistError("Choisis un diaporama valide pour chaque écran.");
  return { horizontal, vertical };
}

export async function readImage(id) {
  if (typeof id !== "string" || !validImageId.test(id)) return null;
  try {
    return await readFile(join(directory, id));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}
