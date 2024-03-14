import React from "react";
import Navbar from "../../NavBar";
import Footer from "../../Footer";
import RootLayout from "../../layout";
import HeaderSimple from "../../headerSimple";
import { Pages } from "../../site";
import getProducts from "../../getProducts";
import ProductCards from "../../ProductCards";
import ProductCategoriesList from "../../ProductCategoriesList";
import getCategories from "../../getCategories";

const getCategoryNameFromId = (categories, categoryId) => {

  let category = null; // Initialisation de la variable category à null

  categories.map(categorie => {
    if (categoryId == categorie.category_id) {
      console.log(categoryId," =>",categorie.category_name)
      category = categorie.category_name;
    }
  });

  return category;
};

const filterProductsByCategoryId = (products, categories, categoryId) => {
  const categoryName = getCategoryNameFromId(categories, categoryId);
  console.log("categoryName",categoryName)
  if (!categoryName) {
    console.error(`No category found with ID: ${categoryId}`);
    return [];
  }
  return products.filter((product) =>
    product['Catégories'].includes(categoryName)
  );
};

async function Catalogue({ params }) {
  const categoryId = params.catId;

  const pageTitle = "Catalogue";
  const pageDescription =
    "Catalogue des produits électroménager TV son image Frigo Four...";
  const page = Pages["catalogue"];
  const products = await getProducts();
  const categories = getCategories({products});
  const filterProducts = filterProductsByCategoryId (products, categories, categoryId)
console.log ("filter", filterProducts, "id=", categoryId);

  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <HeaderSimple photos={page.photos} title={page.title} />

      <h1>Paramètre : {categoryId}</h1>

      <ProductCategoriesList products={products} />

      <ProductCards products={filterProducts} />

      <Footer />
    </RootLayout>
  );
}

export default Catalogue;
