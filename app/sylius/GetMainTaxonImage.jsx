import axios from "axios";
import {API_URL_BASE, API_URL_CHANNELS, CHANNEL_CODE} from "./index"
import GetChannel from "./GetChannel";
import GetTaxonsImages from "./GetTaxonsImages";

const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/150';

async function getMainTaxonImage() {
      try {

const channelData = await GetChannel();

const taxonImagesData = await GetTaxonsImages();

console.log("channelData",channelData.menuTaxon);

//  //Find the image corresponding to the main taxon name
//       const mainTaxonImage = taxonImagesData.data['hydra:member'].find(
//         (image) => image.owner === mainTaxonUrl && image.type === mainTaxonName
//       );

return channelData.menuTaxon;

      }

 catch (error) {
      console.error('Error fetching main taxon image:', error);
      return PLACEHOLDER_IMAGE_URL;
    }
  }

//   export default getMainTaxonImage;

// async function getMainTaxonImage(channelCode) {
//     try {
//       // Fetch the channel data to get the main taxon URL
//       const channelData = await GetChannel;
//       console.log("channelData",channelData)
//       const mainTaxonUrl = channelData.data.menuTaxon;
  
//       // Fetch the main taxon data to get its name
//       const mainTaxonData = await axios.get(`${API_URL_BASE}${mainTaxonUrl}`);
//       const mainTaxonName = mainTaxonData.data.name;
  
//       // Fetch the taxon images
//       const taxonImagesData = await axios.get(`${API_URL_BASE}/api/v2/shop/taxon-images?_channel_code=${channelCode}`);
  
//       // Find the image corresponding to the main taxon name
//       const mainTaxonImage = taxonImagesData.data['hydra:member'].find(
//         (image) => image.owner === mainTaxonUrl && image.type === mainTaxonName
//       );
  
//       // Return the image URL if found, otherwise return the placeholder image URL
//       return mainTaxonImage ? `${API_URL_BASE}/api/v2/shop/media/cache/resolve/sylius_large/${mainTaxonImage.path}` : PLACEHOLDER_IMAGE_URL;
//     } catch (error) {
//       console.error('Error fetching main taxon image:', error);
//       return PLACEHOLDER_IMAGE_URL;
//     }
//   }

   export default getMainTaxonImage;