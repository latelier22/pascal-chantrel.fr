const ProductList = ({ products }) => {
    return (
      <div>
        <h1>Product List</h1>
        <ul>
          {products.map(product => (
            <li key={product[0]}>
              <div>
                <p>Product ID: {product[0]}</p>
                <p>Reference: {product[1]}</p>
                <p>Designation: {product[2]}</p>
                <p>Brand: {product[3]}</p>
                <p>Categories: {product[4]}</p>
                <p>Price: {product[8]}</p>
                <p>Stock: {product[9]}</p>
                <p>Creation Date: {product[10]}</p>
                <p>Update Date: {product[11]}</p>
                <img src={product[12]} alt={`Product ${product[0]}`} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ProductList;