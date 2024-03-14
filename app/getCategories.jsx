// Fonction pour associer une image aléatoire à chaque catégorie à partir des produits
const associateRandomImageWithCategory = (products, category) => {
    // Filtrer les produits par catégorie
    const categoryProducts = products.filter(product => product['Catégories'].trim() === category.trim());
    
    // Extraire toutes les images des produits de cette catégorie
    const categoryImages = categoryProducts.map(product => product['image-1']).filter(image => image); // Filtrer les images vides
    
    // Choisir une image au hasard parmi celles extraites
    const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)];
    
    // Retourner l'image choisie au hasard
    return randomImage;
  };
  
  const getCategories = ({ products }) => {
    // Créer un objet pour stocker les catégories uniques avec leur category_id et category_image
    const categoriesMap = {};
    
    // Itérer sur chaque produit pour ajouter ses valeurs de 'Catégories' à l'objet
    products.forEach(product => {
      const category = product['Catégories'].trim();
      
      // Vérifier si la catégorie n'est pas vide
      if (category !== '') {
        // Si la catégorie n'existe pas déjà dans l'objet, l'ajouter avec un nouvel id et une image aléatoire
        if (!categoriesMap.hasOwnProperty(category)) {
          const category_id = Object.keys(categoriesMap).length + 1;
          const category_image = associateRandomImageWithCategory(products, category);
          categoriesMap[category] = { category_id, category_name: category, category_image };
        }
      }
    });
    
    // Convertir l'objet en tableau et le trier par category_id
    const categoriesList = Object.values(categoriesMap).sort((a, b) => a.category_id - b.category_id);
    console.log(categoriesList)
    return categoriesList;
  };
  
  export default getCategories;
  