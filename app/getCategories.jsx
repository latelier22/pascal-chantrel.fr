const categoryIds = new Map([
  ["Maison - Entretien", 1],
  ["Gros électroménager", 2],
  ["Tv - Image - Son", 3],
  ["Informatique", 4],
  ["Petit-électroménager", 5],
  ["Chauffage", 6],
]);

export default function getCategories({ products }) {
  const categories = new Map();
  for (const product of products) {
    const name = product["Catégories"].trim();
    if (!name) continue;

    if (!categories.has(name)) {
      const id = categoryIds.get(name) ?? categoryIds.size + categories.size + 1;
      categories.set(name, { category_id: id, category_name: name, category_image: "" });
    }

    const category = categories.get(name);
    if (!category.category_image && product["image-1"]) {
      category.category_image = product["image-1"];
    }
  }

  return [...categories.values()].sort((a, b) => a.category_id - b.category_id);
}
