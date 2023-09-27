import { renderAlertText } from "../components/error.js";

/**
 * Checks if characters is equal to or more than amountOfChar
 * @param {String} value
 * @param {Number} [amountOfChar]
 * @returns Boolean
 */
export const characterValidation = (value, amountOfChar = 1) => {
 return value && value.length >= amountOfChar;
};

/**
 * Sets up error message for validation
 * @param {HTMLElement} input
 * @param {Boolean} validated
 * @param {String} errorId - unique id to get error element later
 * @param {String} errorMessage
 */
export const validationError = (input, validated, errorId, errorMessage) => {
 const errorElem = document.getElementById(errorId);
 if (validated) {
  errorElem && errorElem.remove();
 } else if (!errorElem) {
  const alertText = renderAlertText("error", errorMessage, errorId);
  input.parentElement.appendChild(alertText);
 }
};

/**
 * Validates the email based on regex pattern
 * @param {String} email
 * @returns Boolean
 */
export const emailValidation = (email) => {
 const pattern = /\S+@\S+\.\S+/;
 return pattern.test(email && email.trim());
};

/**
 * Sets up event listeners for the email input element.
 * @param {HTMLElement} emailInput
 * @param {String} id - unique id to get error element later
 * @param {String} errorMessage
 */
export const setupEmailEventListener = (emailInput, id, errorMessage, formState = { isActive: false }) => {
 let timer;

 const validateInput = () => {
  const isValid = emailValidation(emailInput.value);
  validationError(emailInput, isValid, id, errorMessage);
 };

 emailInput.addEventListener("focusout", (e) => {
  if (formState.isActive) validateInput();
 });

 emailInput.addEventListener("input", (e) => {
  clearTimeout(timer);
  formState.isActive = true;
  timer = setTimeout(validateInput, 1000);
 });
};
