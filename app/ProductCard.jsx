const ProductCard = ({ product }) => {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
        <div className="aspect-w-1 aspect-h-1">
          <img
            className="object-cover object-center w-full h-full"
            src={product['image-1']}
            alt={product['Désignation']}
          />
        </div>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{product['Désignation']}</div>
          <p className="text-gray-700 text-base">
            Prix: {product['Prix public 1']} €
          </p>
          <p className="text-gray-700 text-base">
            Stock: {product['Stock final des 12 mois']}
          </p>
        </div>
      </div>
    );
  };
  
  export default ProductCard;