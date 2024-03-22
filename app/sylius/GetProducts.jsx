// getAllTaxons.js
import axios from "axios";
import {API_URL_BASE, API_URL_PRODUCTS, SYLIUS_CHANNEL} from "./index"

const API_URL = API_URL_BASE + API_URL_PRODUCTS + SYLIUS_CHANNEL

async function GetProducts() {
  try {
    const response = await axios.get(API_URL);
    return response.data['hydra:member'];
  } catch (error) {
    console.error("Error fetching taxons:", error);
    throw error;
  }
}

export default GetProducts;
