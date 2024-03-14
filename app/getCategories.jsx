const getCategories = ({ products }) => {
    // Créer un objet pour stocker les catégories uniques avec leur category_id
    const categoriesMap = {};
  
    // Itérer sur chaque produit pour ajouter ses valeurs de 'Catégories' à l'objet
    products.forEach(product => {
        const category = product['Catégories'].trim();
        // Vérifier si la catégorie n'est pas vide
        if (category !== '') {
            // Si la catégorie n'existe pas déjà dans l'objet, l'ajouter avec un nouvel id
            if (!categoriesMap.hasOwnProperty(category)) {
                categoriesMap[category] = {
                    category_id: Object.keys(categoriesMap).length + 1,
                    category_name: category,
                };
            }
        }
    });
  
    // Convertir l'objet en tableau et le trier par category_id
    const categoriesList = Object.values(categoriesMap).sort((a, b) => a.category_id - b.category_id);
  
    console.log(categoriesList)
    return categoriesList;
};

  export default getCategories;