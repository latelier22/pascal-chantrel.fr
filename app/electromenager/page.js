import HeaderSimple from "../headerSimple";
import getProducts from "../getProducts";
import CategoriesCards from "../CategoriesCards";
import styles from "../home.module.css";

export default async function Catalogue() {
  const products = await getProducts();
  return (
    <main>
      <HeaderSimple title="Électroménager" description="Parcourez les appareils et équipements TV et son du catalogue." />
      <div className={styles.container}><CategoriesCards products={products} /></div>
    </main>
  );
}
