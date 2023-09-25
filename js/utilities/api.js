const baseUrl = "https://www.eirikveskje.com/wp-json";

/**
 * Fetches from the api based on arguments
 * @param {String} endpoint - Endpoint starting with / (default: '')
 * @param {String} query - Query starting with ? (default: '')
 * @param {Object} init - fetch RequestInit (default: {})
 * @returns Object with data property for response body and parsedHeader property for headers
 */
export const fetchApi = async (endpoint = "", query, init = {}) => {
 const url = `${baseUrl}${endpoint}${query || ""}`;
 const response = await fetch(url, init);
 const headers = Object.fromEntries(response.headers.entries());

 return {
  ...response,
  parsedHeader: headers,
  data: await response.json(),
 };
};
