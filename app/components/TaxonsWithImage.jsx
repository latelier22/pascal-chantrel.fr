import GetTaxons from "../API/GetTaxons";
import GetTaxonsImages from "../API/GetTaxonsImages";
import getTaxonImage from "../API/GetTaxonImage";
import { FILTER_SETS } from "../API";

const PLACEHOLDER_IMAGE_URL = "https://via.placeholder.com/150";
const API_URL_BASE = "http://sylius.latelier22.fr";


async function GetTaxonsWithImage() {
  const getTaxons = await GetTaxons();
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

      return {
        ...taxon,
        images: matchingImages || [], // Tableau vide si aucune correspondance
        imagesUrl,
      };
    })
  );
  return (
    <>
      {updatedTaxons.map((taxon) => (
        // Assuming "images" is an array and you want to access the URL of the first image.
        // If "images" is an object, you may need to adjust this accordingly.
        <div key={taxon.id}>
          <img src={taxon.imagesUrl} alt={`Taxon ${taxon.id}`} />
          <div>{taxon["@id"]}</div>
        </div>
      ))}
    </>
  );
      }
export default GetTaxonsWithImage;