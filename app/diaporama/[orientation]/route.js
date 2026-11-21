export async function GET(_request, { params }) {
  const { orientation } = await params;
  if (orientation !== "horizontal" && orientation !== "vertical") return new Response(null, { status: 404 });
  const ratio = orientation === "horizontal" ? "16:9" : "9:16";
  return new Response(`<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Diaporama Pascal Chantrel · ${ratio}</title>
<link rel="stylesheet" href="/diaporama/player.css?v=listes-1">
</head><body data-orientation="${orientation}">
<main id="screen" aria-label="Diaporama Pascal Chantrel">
<div id="empty"><img src="/images/logo-banniere.png" alt="Pascal Chantrel"><p>Diaporama du magasin</p></div>
</main>
<button id="fullscreen" type="button">Plein écran</button>
<script src="/diaporama/player.js?v=listes-1"></script>
</body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
