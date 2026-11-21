import HeaderSimple from "../headerSimple";
import getProducts from "../getProducts";
import ProductCards from "../ProductCards";
import ProductCategoriesList from "../ProductCategoriesList";
import styles from "../home.module.css";

export default async function Catalogue() {
  const products = await getProducts();
  return (
    <main>
      <HeaderSimple title="Tous les produits" />
      <div className={styles.container}>
        <ProductCategoriesList products={products} />
        <ProductCards products={products} />
      </div>
    </main>
  );
}
