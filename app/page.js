import React from "react";
import RootLayout from "../app/layout";
import Navbar from "./NavBar";
import HeaderSimple from "./headerSimple";
import Footer from "./Footer";
import Cards from "./Cards";
import Section from "./Section";
import {cards, sections} from "./site"

const Home = () => {
  // Dynamic metadata for the home page
  const pageTitle = "Accueil";
  const pageDescription = "Bienvenue sur le site de KER PROTEC";

  // DÃ©clarer les photos dans un tableau d&apos;objets
  const photos = [];

  const backgroundColor = "bg-teal-500";

  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <HeaderSimple photos={photos} title={pageTitle}/>
      {/* <Pictos /> */}
      <Section section={sections[0]} />


      <div className="bg-white dark:bg-neutral-900 dark:text-gold-500">
        <Cards cards={cards} buttonColor={backgroundColor} />
      </div>

      <Section section={sections[1]} />
      
      {/* <div className="bg-white dark:bg-neutral-900 dark:text-gold-500">
        <Cards cards={cards2} buttonColor={backgroundColor} />
      </div> */}


      <Footer />
    </RootLayout>
  );
};

export default Home;
