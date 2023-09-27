import { createHTML } from "../utilities/htmlUtilities.js";

const createAlertElement = (alertType, message, id, typeClass) => {
 const alert = createHTML("div", ["alert", alertType, typeClass, "flex"]);

 if (alertType === "error") {
  alert.appendChild(createHTML("i", "ri-error-warning-line"));
 }

 const messageElem = createHTML("span", "message", message);
 alert.appendChild(messageElem);

 if (id) {
  alert.id = id;
 }

 return alert;
};

/**
 * Creates a text alert element
 * @param {"error" | "alert" | "warning" | "success" | null | undefined} alertType
 * @param {String} message
 * @param {String} alertId - unique id to identify the element later on
 * @returns HTMLElement for text alerts
 */
export const renderAlertText = (alertType, message, alertId) => {
 return createAlertElement(alertType, message, alertId, "alert-type--text");
};

/**
 * Creates a dialog alert element
 * @param {"error" | "alert" | "warning" | "success" | null | undefined} alertType
 * @param {String} message
 * @param {String | null } id
 * @returns HTMLElement for dialog alerts
 */
export const renderAlertDialog = (alertType = "alert", message, id) => {
 return createAlertElement(alertType, message, id, "alert-type--dialog");
};
