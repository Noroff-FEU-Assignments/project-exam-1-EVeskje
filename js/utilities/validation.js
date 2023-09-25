import { renderAlertText } from "../components/error.js";

/**
 * Checks if characters is equal to or more than amountOfChar
 * @param {String} value
 * @param {Number} [amountOfChar]
 * @returns Boolean
 */
export const characterValidation = (value, amountOfChar = 1) =>
 value.length >= amountOfChar;

/**
 * Sets up error message for validation
 * @param {HTMLElement} input
 * @param {Boolean} validated
 * @param {String} errorId - unique id to get error element later
 * @param {String} errorMessage
 */
export const validationError = (input, validated, errorId, errorMessage) => {
 const errorElement = document.querySelector(`#${errorId}`);
 if (!validated && !errorElement) {
  input.parentElement.append(renderAlertText("error", errorMessage, errorId));
 } else if (validated && errorElement) {
  errorElement.remove();
 }
};

/**
 * Validates the email based on regex pattern
 * @param {String} email
 * @returns Boolean
 */
export const emailValidation = (email) => /\S+@\S+\.\S+/.test(email.trim());

/**
 * Sets up event listeners for the email input element.
 * @param {HTMLElement} emailInput
 * @param {String} id - unique id to get error element later
 * @param {String} errorMessage
 */
export const setupEmailEventListener = (
 emailInput,
 id,
 errorMessage,
 formObj = { isActive: false }
) => {
 let timeout;

 const handleValidation = () => {
  const validated = emailValidation(emailInput.value);
  validationError(emailInput, validated, id, errorMessage);
 };

 emailInput.addEventListener("focusout", function (e) {
  if (formObj.isActive) handleValidation();
 });

 emailInput.addEventListener("input", function (e) {
  clearTimeout(timeout);
  if (!formObj.isActive) formObj.isActive = true;

  timeout = setTimeout(handleValidation, 1000);
 });
};
