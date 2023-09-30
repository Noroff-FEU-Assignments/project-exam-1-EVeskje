import { renderAlertText } from "../error.js";

/**
@param {String} value
@param {Number} [amountOfChar]
@returns
 */
export const characterValidation = (value, amountOfChar = 1) => {
 return value && value.length >= amountOfChar;
};

/**
@param {HTMLElement} input
@param {Boolean} validated
@param {String} errorId
@param {String} errorMessage
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
@param {String} email
@returns
 */
export const emailValidation = (email) => {
 const pattern = /\S+@\S+\.\S+/;
 return pattern.test(email && email.trim());
};

/**
@param {HTMLElement} emailInput
@param {String} id
@param {String} errorMessage
 */
export const setupEmailEventListener = (
 emailInput,
 id,
 errorMessage,
 formState = { isActive: false }
) => {
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
