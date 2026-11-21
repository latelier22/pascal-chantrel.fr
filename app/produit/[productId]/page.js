import Link from "next/link";
import { notFound } from "next/navigation";
import getProducts from "../../getProducts";
import ProductCard from "../../ProductCard";
import getCategories from "../../getCategories";
import styles from "../../home.module.css";

export default async function ProductPage({ params }) {
  const { productId } = await params;
  const products = await getProducts();
  const product = products.find(({ id }) => String(id) === productId);
  if (!product) notFound();
  const category = getCategories({ products }).find(({ category_name }) => category_name === product["Catégories"].trim());

  return (
    <main className={`${styles.container} ${styles.detailPage}`}>
      <Link className={styles.textLink} href={category ? `/produits/${category.category_id}` : "/produits"}>
        {category ? `Retour à ${category.category_name}` : "Retour au catalogue"}
      </Link>
      <ProductCard product={product} detail />
      <Link href="/contact" className={styles.contactButton}>Demander un renseignement</Link>
    </main>
  );
}
