const ProductCard = ({ product }) => {
    return (
      <header>
        <div className="block md:mx-10 rounded-lg border-4 border-gold-700 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
          <a
            href="#!"
            className="block relative rounded-t-lg overflow-hidden w-full h-0"
            style={{ paddingTop: "100%" }}
          >
            <img
              className="absolute top-0 left-0 w-full h-full object-cover object-center"
              src={product['image-1']}
              alt={product['Désignation']}
            />
          </a>
  
          <div className="px-6 py-4 flex flex-col text-right">
            <div className="font-bold text-xl mb-2">{product['cat1']}</div>
            <div className="font-bold text-xl mb-2">{product['ref_simple']}</div>
            <div className="font-bold text-xl mb-2 whitespace-normal break-words">{product['Désignation']}</div>
            <p className="text-gray-700 text-base truncate">
              Prix: {product['Prix public 1']} €
            </p>
            <p className="text-gray-700 text-base truncate">
              Stock: {product['Stock final des 12 mois']}
            </p>
          </div>
        </div>
      </header>
    );
  };
  
  export default ProductCard;
