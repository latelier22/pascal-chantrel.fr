
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
      
      <ProductCategoriesList products = {products}/>
      
      <ProductCards products = {products}/>


      <Footer />
    </RootLayout>
  );
};

export default Catalogue;
