// getAllTaxons.js
import axios from "axios";

import {API_URL_BASE, API_URL_PRODUCTS, API_URL_TAXONS, SYLIUS_CHANNEL} from "./index"

// const API_URL_CHANNEL = API_URL_BASE + API_URL_TAXONS

async function GetProductVariant(variant) {
  try {
    const API_URL = API_URL_BASE + variant  + SYLIUS_CHANNEL
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching taxons:", error);
    throw error;
  }
}

export default GetProductVariant;
