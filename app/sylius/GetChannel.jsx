// getAllTaxons.js
import axios from "axios";
import {API_URL_BASE, API_URL_CHANNELS, CHANNEL_CODE} from "./index"





async function GetChannel() {
  try {
    const API_URL = API_URL_BASE + API_URL_CHANNELS + "/" + CHANNEL_CODE;
    const response = await axios.get(API_URL);
    const channel = response.data;
    return channel;
  } catch (error) {
    console.error("Error fetching Channel:", error);
    throw error;
  }
}

export default GetChannel;
