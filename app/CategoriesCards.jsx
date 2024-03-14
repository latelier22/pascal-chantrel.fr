import getCategories from "./getCategories";

const CategoryCard = ({ category }) => {
  return (
    <header>
      <div className="container mx-auto w-full sm:w-1/2 lg:w-1/2 p-2">
        <div className="bg-gray-200 rounded-lg shadow-lg relative">
          {/* Image placeholder carrée */}
          <div
            className="w-full bg-gray-400 relative"
            style={{ paddingBottom: "100%" }}
          >
            <img
              src="https://via.placeholder.com/400"
              alt="Placeholder"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>

          {/* Texte centré horizontalement et verticalement */}
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <h2 className="text-xl font-semibold">{category.category_name}</h2>
          </div>
        </div>
      </div>
    </header>
  );
};

const CategoriesCards = ({ products }) => {
  const categories = getCategories(products);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <CategoryCard key={category.category_id} category={category} />
      ))}
    </div>
  );
};

export default CategoriesCards;
