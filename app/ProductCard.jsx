import Image from "next/image";
import styles from "./home.module.css";

const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export default function ProductCard({ product, detail = false }) {
  const title = [product.cat1, product.nom_marque].filter(Boolean).join(" ");
  const price = euros.format(Number(product["Prix public 1"].replace(",", ".")));
  const stock = Number(product["Stock final des 12 mois"].replace(",", "."));
  const Heading = detail ? "h1" : "h3";

  return (
    <article className={detail ? styles.productDetail : styles.product} data-reveal>
      <div className={detail ? styles.detailPhoto : styles.productPhoto}>
        {product["image-1"] ? (
          <Image src={product["image-1"]} alt={detail ? `${title} ${product.ref_simple}` : ""}
            fill sizes={detail ? "(max-width: 640px) 100vw, 560px" : "(max-width: 640px) 50vw, 300px"} />
        ) : <span>Photo à venir</span>}
      </div>
      <div className={detail ? styles.detailCopy : styles.productCopy}>
        <Heading>{title}</Heading>
        <p>{product.ref_simple}</p>
        {detail && <p className={styles.description}>{product["Désignation"]}</p>}
        <strong>{price}</strong>
        {detail && <p className={styles.availability}>{stock > 0 ? `En stock · ${stock} disponible${stock > 1 ? "s" : ""}` : "Disponibilité sur demande"}</p>}
      </div>
    </article>
  );
}
