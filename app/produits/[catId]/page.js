import styles from "../../home.module.css";
import { notFound } from "next/navigation";
import HeaderSimple from "../../headerSimple";
import getProducts from "../../getProducts";
import ProductCards from "../../ProductCards";
import ProductCategoriesList from "../../ProductCategoriesList";
import getCategories from "../../getCategories";

const applianceGroups = [
  { id: "froid", title: "Réfrigérateurs et congélateurs", types: ["Réfrigérateur", "Congélateur"] },
  { id: "linge", title: "Lave-linge et sèche-linge", types: ["Lave-linge", "Sèche-linge"] },
  { id: "vaisselle", title: "Lave-vaisselle", types: ["Lave-vaisselle"] },
  { id: "cuisson", title: "Fours, plaques et cuisinières", types: ["Four", "Plaque de cuisson", "Cuisinière", "Micro-ondes", "Cuisson"] },
  { id: "hottes", title: "Hottes", types: ["Hotte"] },
];

function ApplianceGroups({ products }) {
  const groups = applianceGroups.map((group) => ({ ...group, products: [] }));
  const other = { id: "autres", title: "Autres appareils", products: [] };
  for (const product of products) {
    const group = groups.find(({ types }) => types.includes(product.cat1)) ?? other;
    group.products.push(product);
  }
  const available = [...groups, other].filter((group) => group.products.length > 0);

  return (
    <>
      <nav aria-label="Types de gros électroménager" className={styles.subnav}>
        {available.map(({ id, title, products }) => (
          <a key={id} href={`#${id}`} className={styles.subnavLink}>
            {title} ({products.length})
          </a>
        ))}
      </nav>
      {available.map(({ id, title, products }) => (
        <section key={id} id={id} aria-labelledby={`${id}-titre`} className={styles.productSection}>
          <h2 id={`${id}-titre`} className={styles.sectionTitle}>{title}</h2>
          <ProductCards products={products} />
        </section>
      ))}
    </>
  );
}

export default async function Catalogue({ params }) {
  const { catId } = await params;
  const products = await getProducts();
  const category = getCategories({ products }).find(({ category_id }) => String(category_id) === catId);
  if (!category) notFound();

  const categoryProducts = products.filter((product) => product["Catégories"].trim() === category.category_name);

  return (
    <>

      <HeaderSimple title={category.category_name} />
      <main className={styles.container}>
        <aside>
          <ProductCategoriesList products={products} category_id={catId} />
        </aside>
        <div>
          {category.category_name === "Gros électroménager" ? (
            <ApplianceGroups products={categoryProducts} />
          ) : (
            <ProductCards products={categoryProducts} />
          )}
        </div>
      </main>

    </>
  );
}
