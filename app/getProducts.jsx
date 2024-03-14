import fs from 'fs';
import csv from 'csv-parser';
import data from "./products.json"

async function getProducts() {
  const rawData = data.data;

  const keys = rawData[0]; // Les clés sont les premières données du tableau

  const products = [];
  
  // Commencez à 1 car la première ligne contient les clés
  for (let i = 1; i < rawData.length; i++) {
    const data = rawData[i];
    const product = {};
  
    for (let j = 0; j < keys.length; j++) {
      product[keys[j]] = data[j];
    }
  
    products.push(product);
  }

console.log(products)
  
  // Lire le fichier CSV
  
  return products;
}

export default getProducts