/**
@param {String} string
@returns
 */
export const decodeHTML = (string) => {
 if (string) {
  const elem = document.createElement("textarea");
  elem.innerHTML = string;
  return elem.textContent;
 } else {
  return null;
 }
};

/**
@param {string} tag
@param {string | String[] | null} [classes]
@param {string | null} [text]
@param {object} [attributes]
@returns
 */
export const createHTML = (tag, classes, text, attributes) => {
 const elem = document.createElement(tag);
 if (classes) {
  if (Array.isArray(classes)) {
   elem.classList.add(...classes);
  } else {
   elem.classList.add(classes);
  }
 }

 if (text) {
  text = decodeHTML(text);
  elem.innerText = text;
 }

 if (attributes) {
  const object = Object.entries(attributes);
  for (const [key, value] of object) {
   elem.setAttribute(key, value);
  }
 }

 return elem;
};

/**
@param {String} htmlString
@returns
 */
export const parseHTML = (htmlString) => {
 const parser = new DOMParser();
 const content = parser.parseFromString(htmlString, "text/html");

 return content.body;
};

/**
@param {Array} array
@param {HTMLElement} parent
 */
export const appendArray = (array, parent) => {
 for (const element of array) {
  parent.append(element);
 }
};
