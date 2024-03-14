import ProductCard from './ProductCard';

const ProductCards = ({ products }) => {
  return (
    <div className="flex flex-wrap justify-center">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

export default ProductCards;