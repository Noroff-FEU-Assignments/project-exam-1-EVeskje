import { createHTML } from "./utilities/htmlUtilities.js";

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
@param {"error" | "alert" | "warning" | "success" | null | undefined} alertType
@param {String} message
@param {String} alertId
@returns
 */
export const renderAlertText = (alertType, message, alertId) => {
 return createAlertElement(alertType, message, alertId, "alert-type--text");
};

/**
@param {"error" | "alert" | "warning" | "success" | null | undefined} alertType
@param {String} message
@param {String | null } id
@returns
 */
export const renderAlertDialog = (alertType = "alert", message, id) => {
 return createAlertElement(alertType, message, id, "alert-type--dialog");
};
