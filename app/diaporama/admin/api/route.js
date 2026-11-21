import { isSlideshowAdmin, slideshowAuthRequired } from "../../auth";
import { addImage, maxImageSize, PlaylistError, readPlaylist, savePlaylist } from "../../store";

const headers = { "Cache-Control": "no-store" };

async function run(request, operation) {
  if (!(await isSlideshowAdmin(request))) return slideshowAuthRequired();
  try {
    const origin = request.headers.get("origin");
    if (request.headers.get("sec-fetch-site") === "cross-site" ||
      (origin && new URL(origin).host !== request.headers.get("host"))) {
      throw new PlaylistError("Origine non autorisée.", 403);
    }
    return Response.json(await operation(), { headers });
  } catch (error) {
    if (error instanceof PlaylistError) {
      return Response.json({ error: error.message }, { status: error.status, headers });
    }
    console.error("Échec de gestion du diaporama", error);
    return Response.json({ error: "Impossible d’accéder au diaporama." }, { status: 500, headers });
  }
}

export function GET(request) {
  return run(request, readPlaylist);
}

export function POST(request) {
  return run(request, async () => {
    if (Number(request.headers.get("content-length")) > maxImageSize + 65536) {
      throw new PlaylistError("L’image dépasse 10 Mo.", 413);
    }
    const data = await request.formData().catch(() => { throw new PlaylistError("Envoi d’image invalide."); });
    return addImage(data.get("image"));
  });
}

export function PUT(request) {
  return run(request, async () => {
    const { revision, slides } = await request.json().catch(() => { throw new PlaylistError("Liste invalide."); }) || {};
    return savePlaylist(revision, slides);
  });
}
