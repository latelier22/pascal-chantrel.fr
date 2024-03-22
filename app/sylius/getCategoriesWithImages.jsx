import getAllTaxons from "./getAllTaxons";
import GetTaxonsImages from "./getAllTaxonsImages";
import getTaxonImage from "./getCategoryImage";
import { FILTER_SETS } from ".";

async function getTaxonsWithImages() {
  const getTaxons = await getAllTaxons();
  const taxonsImages = await GetTaxonsImages();

  // Mettre à jour chaque taxon avec la liste d'images correspondantes ou un tableau vide
  const updatedTaxons = await Promise.all(
    getTaxons.map(async (taxon) => {
      const matchingImages = taxonsImages.filter(
        (image) => image.owner === taxon["@id"]
      );

      const imagesUrl = await Promise.all(
        matchingImages.map(async (image) => {
          const imageUrl = await getTaxonImage(image.id, FILTER_SETS.sylius_large.filter_size);
          return imageUrl;
        })
      );

      // Créer un tableau d'URL de miniatures d'images
      const imagesThumbnails = imagesUrl.map(imageUrl =>
        imageUrl.replace("sylius_large", "sylius_shop_product_thumbnail")
      );

      return {
        ...taxon,
        images: matchingImages || [], // Tableau vide si aucune correspondance
        imagesUrl,
        imagesThumbnails, // Champ ajouté pour les miniatures
      };
    })
  );

  return updatedTaxons;
}

export default getTaxonsWithImages;
