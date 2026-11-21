import Link from "next/link";
import { notFound } from "next/navigation";
import getProducts from "../../getProducts";
import ProductCard from "../../ProductCard";
import getCategories from "../../getCategories";
import productSpecifications from "../../product-specifications.json";
import styles from "../../home.module.css";

export default async function ProductPage({ params }) {
  const { productId } = await params;
  const products = await getProducts();
  const product = products.find(({ id }) => String(id) === productId);
  if (!product) notFound();
  const category = getCategories({ products }).find(({ category_name }) => category_name === product["Catégories"].trim());

  const specifications = productSpecifications[product.ref_simple];

  return (
    <main className={`${styles.container} ${styles.detailPage}`}>
      <Link className={styles.textLink} href={category ? `/produits/${category.category_id}` : "/produits"}>
        {category ? `Retour à ${category.category_name}` : "Retour au catalogue"}
      </Link>
      <ProductCard product={product} detail specifications={specifications} />
      <Link href="/contact" className={styles.contactButton}>Demander un renseignement</Link>
      {specifications && (
        <section className={styles.specifications} data-reveal aria-labelledby="specifications-title">
          <h2 id="specifications-title">Caractéristiques techniques</h2>
          <dl>
            {Object.entries(specifications.facts).map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
          {specifications.note && <p>{specifications.note}</p>}
          {specifications.sources.length > 0 && (
            <ul aria-label="Sources produit">
              {specifications.sources.map(({ label, url }) => (
                <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
