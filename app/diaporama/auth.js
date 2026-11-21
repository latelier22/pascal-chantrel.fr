export async function isSlideshowAdmin(request) {
  const expected = process.env.SLIDESHOW_ADMIN_HASH;
  const auth = request.headers.get("authorization") || "";
  if (!expected || !/^[0-9a-f]{64}$/.test(expected) || !auth.startsWith("Basic ") || auth.length > 256) {
    return false;
  }
  try {
    const credentials = atob(auth.slice(6));
    if (!credentials.startsWith("magasin:")) return false;
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(credentials.slice(8)));
    const hex = Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
    let difference = 0;
    for (let index = 0; index < hex.length; index++) difference |= hex.charCodeAt(index) ^ expected.charCodeAt(index);
    return difference === 0;
  } catch {
    return false;
  }
}

export function slideshowAuthRequired() {
  return new Response("Accès réservé à la gestion du diaporama.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Diaporama Pascal Chantrel", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}
