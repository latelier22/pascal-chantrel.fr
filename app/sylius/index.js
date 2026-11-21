// export const API_URL_BASE = "http://localhost:8000";
// export const API_URL_BASE = "http://sylius.latelier22.fr";
export const API_URL_BASE = "http://shop.pascal-chantrel.fr";

export const API_URL_PRODUCTS = "/api/v2/shop/products?page=1&itemsPerPage=30";

export const API_URL_CHANNELS = "/api/v2/shop/channels";

export const API_URL_TAXONS = "/api/v2/shop/taxons";

export const API_URL_TAXON_IMAGE = "/api/v2/shop/taxon-images";

export const API_URL_BANNERS ="/api/v2/shop/banners"

//export const CHANNEL_CODE = "PRO-COUV"
//  export const CHANNEL_CODE = "ARMOR"
// export const CHANNEL_CODE = "KERPROTEC"
export const CHANNEL_CODE = "PASCAL"

export const SYLIUS_CHANNEL ="?_channel_code=" + CHANNEL_CODE 


export const FILTER_SETS = {
    sylius_small: { filter_size: "sylius_small", size: [120, 90] },
    sylius_medium: { filter_size: "sylius_medium", size: [240, 180] },
    sylius_large: { filter_size: "sylius_large", size: [640, 480] },
  };