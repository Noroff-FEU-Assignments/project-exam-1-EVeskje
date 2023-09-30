const baseUrl = "https://www.eirikveskje.com/wp-json";

/**
@param {String} endpoint
@param {String} query
@param {Object} init
@returns
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
