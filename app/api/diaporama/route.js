import { readPlaylist } from "../../diaporama/store";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const orientation = new URL(request.url).searchParams.get("orientation");
  if (orientation !== "horizontal" && orientation !== "vertical") {
    return Response.json({ error: "Orientation invalide." }, { status: 400 });
  }
  const { revision, slides } = await readPlaylist();
  return Response.json({
    revision,
    slides: slides.filter((slide) => slide.active && (slide.orientation === orientation || slide.orientation === "both"))
      .map(({ id, title, duration }) => ({ url: `/api/diaporama/image/${id}`, title, duration })),
  }, { headers: { "Cache-Control": "no-store" } });
}
