// GetTaxons.js
import axios from "axios";
import {API_URL_BASE, API_URL_BANNERS} from "./index"

const API_URL = API_URL_BASE + API_URL_BANNERS


async function GetBanners() {
  try {
    const response = await axios.get(API_URL);
    return response.data['hydra:member'];
  } catch (error) {
    console.error("Error fetching BANNERS:", error);
    throw error;
  }
}

export default GetBanners;


// {
//   "hydra:member": [
//     {
//       "@id": "string",
//       "@type": "string",
//       "@context": "string",
//       "id": 0,
//       "type": "string",
//       "path": "string",
//       "owner": "string"
//     }
//   ],
//   "hydra:totalItems": 0,
//   "hydra:view": {
//     "@id": "string",
//     "type": "string",
//     "hydra:first": "string",
//     "hydra:last": "string",
//     "hydra:previous": "string",
//     "hydra:next": "string"
//   },
//   "hydra:search": {
//     "@type": "string",
//     "hydra:template": "string",
//     "hydra:variableRepresentation": "string",
//     "hydra:mapping": [
//       {
//         "@type": "string",
//         "variable": "string",
//         "property": "string",
//         "required": true
//       }
//     ]
//   }
// }