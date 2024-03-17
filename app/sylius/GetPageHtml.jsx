

import axios from 'axios';

import {API_URL_BASE} from "./index"

// const API_URL = API_URL_BASE + "/admin"
const API_URL = API_URL_BASE + "/fr_FR/accueil?ajax=true"

async function GetPageHtml () {
      try {
        const response = await axios.get(API_URL);
        //console.log(response.data)
        const decodedData = response.data.content;
        return (<div dangerouslySetInnerHTML={{ __html: decodedData }} />);

        
      } catch (error) {
        console.error('Erreur lors de la récupération du contenu HTML :', error);
      }
      

    }
export default GetPageHtml;

