import React from "react";
import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";
import HeaderSimple from "../headerSimple";
import Section from "../Section";
import Cards from "../Cards";
import MyLightBox from "../MyLightBox"
import { Pages } from "../site";
import getProducts from "../getProducts"
import ProductList from "../ProductsList"
import ProductCards from "../ProductCards"
import ProductCategoriesList from "../ProductCategoriesList"
import CategoriesCards from "../CategoriesCards"

async function Catalogue() {
  const pageTitle = 'Catalogue';
  const pageDescription = 'Catalogue des produits électroménager TV son image Frigo Four...';
  const page = Pages["catalogue"];
  const products = await getProducts();

  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <HeaderSimple photos={page.photos} title={page.title}/>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Colonne de gauche pour la liste des catégories */}
        <div className="md:col-span-2">
          <ProductCategoriesList products={products} />
        </div>
        
        {/* Colonne centrale vide pour l'espace */}
        <div className="hidden md:block md:col-span-1"></div>

        {/* Colonne de droite pour les cartes de catégories */}
        <div className="md:col-span-9">
          <CategoriesCards products={products} />
        </div>
      </div>

      <Footer />
    </RootLayout>
  );
};

export default Catalogue;
