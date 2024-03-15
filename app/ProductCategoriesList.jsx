import Link from 'next/link';
import getCategories from './getCategories';

const ProductCategoriesList = ({ products, category_id }) => {
  const categoriesList = getCategories({ products });

  return (
    <div>
      <Link href={`/electromenager`}>
        <h2 className="text-2xl font-bold mb-4">Catégories</h2>
      </Link>
      <ul>
        {categoriesList.map((category) => (
          // ${category.category_id === category_id ? 'border-orange' : ''}
          <li key={category.category_id} className={`text-lg text-bluechantrel-950 border-2 rounded-lg hover:bg-orange hover:border-white hover:text-orange-400 my-2 px-4 py-2 ${category.category_id == category_id ? 'border-orange-400' : ''} `}>
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
