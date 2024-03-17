// getTaxonImage.js
import axios from "axios";
import {API_URL_BASE, API_URL_TAXON_IMAGE} from "./index"

async function GetTaxonImage(id, filter_size) {

    const API_URL = API_URL_BASE + API_URL_TAXON_IMAGE+ "/" + id + "?" + "filter=" + filter_size


  try {
    const response = await axios.get(API_URL);
    const imagePath = response.data.path
    const imageUrl = `${API_URL_BASE}/media/cache/resolve/${filter_size}/${imagePath}`;
    return imageUrl;
    } 
    catch (error) {
    console.error("Error getting taxon image:", error);
    throw error;
  }
}
export default GetTaxonImage;


export const GetLogo = "http://sylius.latelier22.fr/media/cache/sylius_medium/4f/17/dfdb1eb023d8dc9cf21101c6d9e5.png";