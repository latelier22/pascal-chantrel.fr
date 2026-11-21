import catalogueSlides from "../../diaporama/catalogueSlides";
import { programmeSlug, readPlaylist } from "../../diaporama/store";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };

function personalised({ id, title, duration }) {
  return { url: `/api/diaporama/image/${id}`, title, duration };
}

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const orientation = params.get("orientation");
  const requested = params.get("diapo");
  if ((orientation !== "horizontal" && orientation !== "vertical") ||
    (requested !== null && (requested.length > 80 || !programmeSlug.test(requested)))) {
    return Response.json({ error: "Adresse de diaporama invalide." }, { status: 400, headers });
  }
  const state = await readPlaylist();
  const { revision, programmes, screens } = state;
  const selected = requested || screens[orientation];
  const programme = programmes.find(({ id }) => id === selected);

  if (programme) {
    const products = new Map((await catalogueSlides(true)).map((product) => [product.reference, product]));
    const images = new Map(state.slides.map((image) => [image.id, image]));
    const slides = programme.items.flatMap(({ kind, ref, duration, active }) => {
      if (!active) return [];
      if (kind === "image") {
        const image = images.get(ref);
        return image ? [personalised({ ...image, duration })] : [];
      }
      const product = products.get(ref);
      return product ? [{ ...product, duration, heading: programme.title, theme: programme.theme }] : [];
    });
    return Response.json({ revision, slides, message: `${programme.title} · Aucun élément à diffuser` }, { headers });
  }
  if (requested) {
    return Response.json({ revision, slides: [], message: "Ce diaporama n’est plus disponible." }, { headers });
  }
  const active = selected === "auto" ? state.slides.filter((slide) =>
    slide.active && (slide.orientation === orientation || slide.orientation === "both")).map(personalised) : [];
  return Response.json({ revision, slides: active.length ? active : await catalogueSlides() }, { headers });
}
