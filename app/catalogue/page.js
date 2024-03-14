

import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";

const Catalogue = () => {
  const pageTitle = 'Catalogue';
  const pageDescription = 'Catalogue des produits électroménager TV son image Frigo Four...';
  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />

      <h1>{pageTitle}</h1>

      <Footer />
    </RootLayout>
  );
};

export default Contact;
