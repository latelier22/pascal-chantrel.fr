import Link from "next/link";
import ProductCard from "./ProductCard";
import styles from "./home.module.css";

export default function ProductCards({ products }) {
  return (
    <div className={styles.productList}>
      <div className={styles.productGrid}>
        {products.map((product) => (
          <Link key={product.id} href={`/produit/${encodeURIComponent(product.id)}`}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
}
