import { readImage } from "../../../../diaporama/store";

export async function GET(_request, { params }) {
  const { id } = await params;
  const image = await readImage(id);
  if (!image) return new Response(null, { status: 404 });
  return new Response(image, {
    headers: {
      "Content-Type": id.endsWith(".jpg") ? "image/jpeg" : "image/png",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
