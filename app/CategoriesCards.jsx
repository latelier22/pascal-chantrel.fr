import Image from "next/image";
import Link from "next/link";
import getCategories from "./getCategories";
import styles from "./home.module.css";

export default function CategoriesCards({ products }) {
  return (
    <div className={styles.categoryGrid}>
      {getCategories({ products }).map((category) => (
        <Link className={styles.product} data-reveal key={category.category_id} href={`/produits/${category.category_id}`}>
          <div className={styles.productPhoto}>
            {category.category_image ? (
              <Image src={category.category_image} alt="" fill sizes="(max-width: 640px) 50vw, 270px" />
            ) : <span>Photo à venir</span>}
          </div>
          <div className={styles.productCopy}><h3>{category.category_name}</h3></div>
        </Link>
      ))}
    </div>
  );
}
