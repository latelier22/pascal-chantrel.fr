import Link from 'next/link';
import getCategories from "./getCategories";

const CategoryCard = ({ category }) => {
  return (
    <header>
      <div className="container mx-auto w-full md:w-1/2 lg:w-2/3 p-2">
        <div className="bg-bluechantrel-950 p-2 rounded-lg shadow-lg relative">
          {/* Image placeholder carrée */}
          <div
            className="w-full bg-black relative"
            style={{ paddingBottom: "100%" }}
          >
            <img
              src={category.category_image}
              alt={category.category_name}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>

          {/* Texte centré horizontalement et verticalement */}
          <div className=" w-full h-full flex justify-center items-center">
            <h2 className="text-gold-200 text-md text-center font-semibold">
              {category.category_name}
            </h2>
          </div>
        </div>
      </div>
    </header>
  );
};

const CategoriesCards = ({ products }) => {
  const categories = getCategories({ products });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.category_id} href={`/produits/${category.category_id}`}>
        <CategoryCard key={category.category_id} category={category} />
        </Link>
      ))}
    </div>
  );
};

export default CategoriesCards;
