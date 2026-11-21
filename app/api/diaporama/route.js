import catalogueSlides from "../../diaporama/catalogueSlides";
import { readPlaylist } from "../../diaporama/store";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const orientation = new URL(request.url).searchParams.get("orientation");
  if (orientation !== "horizontal" && orientation !== "vertical") {
    return Response.json({ error: "Orientation invalide." }, { status: 400 });
  }
  const { revision, slides } = await readPlaylist();
  const active = slides.filter((slide) => slide.active && (slide.orientation === orientation || slide.orientation === "both"))
    .map(({ id, title, duration }) => ({ url: `/api/diaporama/image/${id}`, title, duration }));
  return Response.json({
    revision,
    slides: active.length ? active : await catalogueSlides(),
  }, { headers: { "Cache-Control": "no-store" } });
}
