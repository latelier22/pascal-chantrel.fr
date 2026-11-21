export const dynamic = "force-dynamic";


// MyPage.js
import getAllTaxons from "../sylius/getAllTaxons";
import getTaxonsImages from "../sylius/getAllTaxonsImages";
import getTaxonImage from "../sylius/getCategoryImage";
import { FILTER_SETS } from "../sylius/index";
import HeaderSimple from "../headerSimple";
import { redirect } from "next/navigation";
import styles from "../home.module.css";
import Cards from "../Cards";

const PLACEHOLDER_IMAGE_URL = "https://via.placeholder.com/150";


async function Categorie() {
  const [getTaxons, taxonsImages] = await Promise.all([getAllTaxons(), getTaxonsImages()])
    .catch(() => redirect("/electromenager"));
  // console.log("taxonsImages",taxonsImages);
  

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


  const cards = updatedTaxons.map((taxon) => {
    const link = `/${taxon.slug}`;
    const url = taxon.imagesUrl[0]
      ? `${taxon.imagesUrl[0]}`
      : PLACEHOLDER_IMAGE_URL;

    return {
      title: taxon.name,
      text: taxon.description, // Ajoutez la propriété appropriée du taxon ici
      button: "COMMANDEZ !",
      buttonColor: "bg-sky-500", // Changez la couleur du bouton selon vos besoins
      link,
      url,
      alt: taxon.name,
    };
  });


  return (
    <main>
      <HeaderSimple title="Boutique" />
      <div className={styles.container} data-reveal>
        <Cards cards={cards} syliusCard={true} />
      </div>
    </main>
  );
}

export default Categorie;
