import Link from "next/link";
import getCategories from "./getCategories";
import styles from "./home.module.css";

export default function ProductCategoriesList({ products, category_id }) {
  return (
    <nav aria-label="Rayons du catalogue" className={styles.rayons}>
      <Link href="/electromenager" className={styles.textLink}>Tous les rayons</Link>
      <ul>
        {getCategories({ products }).map((category) => (
          <li key={category.category_id}>
            <Link aria-current={String(category.category_id) === String(category_id) ? "page" : undefined}
              href={`/produits/${category.category_id}`}>{category.category_name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
