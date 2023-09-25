import {
 emailValidation,
 characterValidation,
} from "../utilities/validation.js";
import { renderAlertText } from "../components/error.js";

const form = document.querySelector("form");
const inputs = {
 name: form.querySelector("#name"),
 email: form.querySelector("#email"),
 subject: form.querySelector("#subject"),
 message: form.querySelector("#message"),
};

const errorInfo = {
 name: {
  id: "name-error",
  errorMessage: "Your name has to contain at least 5 characters",
 },
 email: {
  id: "email-error",
  errorMessage: "Enter a valid email",
 },
 subject: {
  id: "subject-error",
  errorMessage: "Your subject has to contain at least 15 characters",
 },
 message: {
  id: "message-error",
  errorMessage: "Your message has to contain at least 25 characters",
 },
};

const validateInput = (inputType, value) => {
 switch (inputType) {
  case "name":
   return characterValidation(value, 5);
  case "email":
   return emailValidation(value);
  case "subject":
   return characterValidation(value, 15);
  case "message":
   return characterValidation(value, 25);
  default:
   return false;
 }
};

const displayValidationError = (inputElement, errorMessage, errorId) => {
 // Remove any existing error message with the same ID
 const existingError = document.getElementById(errorId);
 if (existingError) {
  existingError.remove();
 }

 // Create a new error message using renderAlertText
 const errorElement = renderAlertText("error", errorMessage, errorId);
 inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
};

form.addEventListener("submit", function (e) {
 e.preventDefault();
 let allValid = true;

 for (let inputType in inputs) {
  const input = inputs[inputType];
  const isValid = validateInput(inputType, input.value.trim());

  if (!isValid) {
   allValid = false;
   displayValidationError(
    input,
    errorInfo[inputType].errorMessage,
    errorInfo[inputType].id
   );
  } else {
   const existingError = document.getElementById(errorInfo[inputType].id);
   if (existingError) {
    existingError.remove();
   }
  }
 }
});
