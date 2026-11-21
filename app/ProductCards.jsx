import Link from "next/link";
import ProductCard from "./ProductCard";

export default function ProductCards({ products }) {
  return (
    <div className="container mx-auto py-2 md:px-4 md:py-6 animate-appear">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <Link key={product.id} href={`/produit/${encodeURIComponent(product.id)}`}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
}
