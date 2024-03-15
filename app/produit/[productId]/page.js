import React from "react";
import Navbar from "../../NavBar";
import Footer from "../../Footer";
import RootLayout from "../../layout";
import HeaderSimple from "../../headerSimple";
import { Pages } from "../../site";
import getProducts from "../../getProducts";
import ProductCard from "../../ProductCard";
import ProductCategoriesList from "../../ProductCategoriesList";
import getCategories from "../../getCategories";

const getCategoryNameFromId = (categories, categoryId) => {
  let category = null; // Initialisation de la variable category à null

  categories.map((categorie) => {
    if (categoryId == categorie.category_id) {
      console.log(categoryId, " =>", categorie.category_name);
      category = categorie.category_name;
    }
  });

  return category;
};

const filterProductsByCategoryId = (products, categories, categoryId) => {
  const categoryName = getCategoryNameFromId(categories, categoryId);
  console.log("categoryName", categoryName);
  if (!categoryName) {
    console.error(`No category found with ID: ${categoryId}`);
    return [];
  }
  return products.filter((product) =>
    product["Catégories"].includes(categoryName)
  );
};

async function Catalogue({ params }) {
  const productId = params.productId;

  
  const pageDescription =
    "Catalogue des produits électroménager TV son image Frigo Four...";
  const page = Pages["catalogue"];
  const products = await getProducts();
  const categories = getCategories({ products });
  // const filterProducts = filterProductsByCategoryId(
  //   products,
  //   categories,
  //   categoryId
  // );

  // Recherche du produit par ID
  const product = products.find(product => product.id === productId);

  // "id",
  // "ref_simple",
  // "Désignation",
  // "nom_marque",
  // "Catégories",
  // "cat1",
  // "cat2",
  // "cat3",
  // "Prix public 1",
  // "Stock final des 12 mois",
  // "Date de création",
  // "Date de mise à jour",
  // "image-1"

  const pageTitle = product['cat1'] + " " + product['ref_simple']
  // console.log("filter", filterProducts, "id=", categoryId);

  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <HeaderSimple  title={pageTitle} />

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Colonne de gauche pour la liste des catégories */}
        <div className="md:col-span-2">
          <ProductCategoriesList products={products} />
        </div>

        {/* Colonne centrale vide pour l'espace */}
        <div className="hidden md:block md:col-span-1"></div>

        {/* Colonne de droite pour les cartes de catégories */}
        <div className="md:col-span-8 m-4">
          <ProductCard product={product} />
        </div>

         {/* Colonne centrale vide pour l'espace */}
         <div className="hidden md:block md:col-span-1"></div>

      </div>

      <Footer />
    </RootLayout>
  );
}

export default Catalogue;
