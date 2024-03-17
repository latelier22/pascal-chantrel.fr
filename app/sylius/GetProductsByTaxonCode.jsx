// GetTaxons.js
import axios from "axios";
import {API_URL_BASE, API_URL_PRODUCTS, SYLIUS_CHANNEL} from "./index"

const API_URL_CHANNEL = API_URL_BASE + API_URL_PRODUCTS + SYLIUS_CHANNEL

async function GetProductsBytaxonCode(taxonCode) {
  try {
    const API_URL = API_URL_CHANNEL + "&productTaxons.taxon.code=" + taxonCode
    const response = await axios.get(API_URL);
    return response.data['hydra:member'];
  } catch (error) {
    console.error("Error fetching taxons:", error);
    throw error;
  }
}

export default GetProductsBytaxonCode;
