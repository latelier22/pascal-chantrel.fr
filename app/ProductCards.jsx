import ProductCard from './ProductCard';

const ProductCards = ({ products }) => {
    return (
      <header>
        <div className="container mx-auto py-2 md:py-8 md:px-12 lg:px-20 lg:py-12 animate-appear">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </header>
    );
  };
  
  export default ProductCards;