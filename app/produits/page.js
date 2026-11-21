import React from "react";
import Navbar from "../NavBar";
import Footer from "../Footer";
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
  const pageTitle = 'Produits';
  // const page = Pages["catalogue"];
  const products = await getProducts();
  return (
    <>
      <Navbar />
      <HeaderSimple title={pageTitle}/>
      <ProductCategoriesList products = {products}/>
      <ProductCards products = {products}/>
      <Footer />
    </>
  );
};

export default Catalogue;
