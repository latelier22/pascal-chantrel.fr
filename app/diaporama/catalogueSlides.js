import getProducts from "../getProducts";
import specifications from "../product-specifications.json";

const euros = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default async function catalogueSlides(includeAll = false) {
  const products = await getProducts();
  return products.flatMap((product) => {
    const price = Number(product["Prix public 1"].replace(",", "."));
    const stock = Number(product["Stock final des 12 mois"].replace(",", "."));
    if (!includeAll && (!product["image-1"] || !(stock > 0) || !(price > 0))) return [];
    const details = specifications[product.ref_simple];
    const title = details?.title || [product.cat1, product.nom_marque].filter(Boolean).join(" ");
    const facts = details?.facts ?? {};
    const feature = facts["Capacité"] || facts["Volume total"] || facts["Volume utile"] || facts["Volume"] || facts["Écran"] || facts["Puissance"];
    const energy = details?.energy;
    return [{
      kind: "product",
      url: product["image-1"],
      title,
      reference: product.ref_simple,
      category: product["Catégories"] === "Tv - Image - Son" ? "TV, image et son" : product["Catégories"],
      price: price > 0 ? euros.format(price) : "Prix sur demande",
      feature,
      energy: energy ? `Classe ${energy.class}${energy.mode ? ` · ${energy.mode}` : ""}` : undefined,
      duration: 7,
      available: stock > 0,
    }];
  });
}
