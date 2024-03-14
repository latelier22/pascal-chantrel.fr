import Link from 'next/link';
import getCategories from './getCategories';

const ProductCategoriesList = ({ products }) => {
  const categoriesList = getCategories({ products });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Catégories</h2>
      <ul>
        {categoriesList.map((category) => (
          <li key={category.category_id} className="text-lg">
            <Link href={`/produits/${category.category_id}`}>
              {category.category_name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCategoriesList;
