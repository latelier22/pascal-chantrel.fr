
// MyPage.js
import getAllTaxons from "../sylius/getAllTaxons";
import getTaxonsImages from "../sylius/getAllTaxonsImages";
import getTaxonImage from "../sylius/getCategoryImage";
import { FILTER_SETS } from "../sylius/index";
import RootLayout from "../layout";
import Navbar from "../NavBar";
import Footer from "../Footer";
import Title from "../Title";
import Cards from "../Cards";

const PLACEHOLDER_IMAGE_URL = "https://via.placeholder.com/150";


async function Categorie() {
  const getTaxons = await getAllTaxons();
  const taxonsImages = await getTaxonsImages();
ll
  console.log("getTaxons",getTaxons);
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

  console.log(updatedTaxons);

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

  console.log("cards", cards)

  const pageTitle = "Boutique Sylius";
  const pageDescription =
    "A venir, tous les jeux et jouets pour petits et grands disponibles à la vente en ligne, et toujours au repaire des p'tits loups";

  const backgroundColor = "bg-teal-500";

  return (
    
      <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
        <Navbar />
        <Title
          myTitle={pageTitle}
          mySubTitle={pageDescription}
          backgroundColor={backgroundColor}
        />

        <div className="bg-teal-200">
          <Cards cards={cards} buttonColor={backgroundColor} syliusCard={true} />
        </div>

        {/* <MyModal /> */}

        <Footer backgroundColor={backgroundColor} />
      </RootLayout>
    
  );
}

export default Categorie;
