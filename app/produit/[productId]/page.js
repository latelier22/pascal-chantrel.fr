import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../NavBar";
import Footer from "../../Footer";
import HeaderSimple from "../../headerSimple";
import getProducts from "../../getProducts";
import ProductCard from "../../ProductCard";
import ProductCategoriesList from "../../ProductCategoriesList";
import getCategories from "../../getCategories";

export default async function ProductPage({ params }) {
  const { productId } = await params;
  const products = await getProducts();
  const product = products.find(({ id }) => String(id) === productId);
  if (!product) notFound();

  const category = getCategories({ products }).find(({ category_name }) => category_name === product["Catégories"].trim());
  const categoryId = category?.category_id;

  return (
    <>
      <Navbar />
      <HeaderSimple title={`${product.cat1} ${product.ref_simple}`} />
      <main className="container mx-auto grid grid-cols-1 gap-4 px-3 md:grid-cols-12">
        <aside className="md:col-span-2">
          <ProductCategoriesList products={products} category_id={categoryId} />
        </aside>
        <div className="my-4 md:col-span-8">
          <Link href={categoryId ? `/produits/${categoryId}` : "/produits"} className="mb-4 inline-block font-semibold underline md:mx-10">
            {category ? `Retour à ${category.category_name}` : "Retour au catalogue"}
          </Link>
          <ProductCard product={product} />
        </div>
      </main>
      <Footer />
    </>
  );
}
