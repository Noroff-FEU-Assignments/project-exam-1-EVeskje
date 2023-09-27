import { fetchApi } from "../utilities/api.js";
import { renderAlertDialog, renderAlertText } from "../components/error.js";
import {
 createHTML,
 decodeHTML,
 parseHTML,
 appendArray,
} from "../utilities/htmlUtilities.js";
import {
 emailValidation,
 characterValidation,
 setupEmailEventListener,
 validationError,
} from "../utilities/validation.js";

// DOM References
const body = document.body;
const main = document.querySelector("#main-content");
const modal = document.querySelector("#img-modal");
const commentSection = document.querySelector("#comments-section");
const commentCount = commentSection.querySelector("#comment-count");
const commentListWrapper = commentSection.querySelector("#comments-container");
const commentList = commentListWrapper.querySelector("#comments-ul");
const commentsLoader = commentListWrapper.querySelector(".loader");
const commentForm = commentSection.querySelector("#comment-form");
const {
 name: nameInput,
 email: emailInput,
 comment: commentInput,
} = commentForm.elements;
const articleId = new URLSearchParams(window.location.search).get("id");
const submitButton = commentForm.querySelector(".button");
const firstFormElem = commentForm.querySelector(":first-child");

// Constants
const commentsPerPage = 15;
const errorInfo = {
 name: { id: "name-error", errorMessage: "Name is required" },
 email: { id: "email-error", errorMessage: "Enter a valid email" },
 comment: {
  id: "comment-error",
  errorMessage: "Your comment has to contain at least 15 characters",
 },
};
const months = [
 "January",
 "February",
 "March",
 "April",
 "May",
 "June",
 "July",
 "August",
 "September",
 "October",
 "November",
 "December",
];

// State
let commentOffset = commentsPerPage;
let commentPage = 1;
let commentAmount = 0;

const setDate = (createdDate) => {
 const date = new Date();
 createdDate = new Date(`${createdDate}+0000`);

 const dateObj = {
  day: createdDate.getDate(),
  month: createdDate.getMonth(),
  year: createdDate.getFullYear(),
  hour: createdDate.getHours(),
  minute: createdDate.getMinutes(),
  second: createdDate.getSeconds(),
 };

 if (dateObj.year != date.getFullYear()) {
  return `${months[dateObj.month]} ${dateObj.day}, ${dateObj.year}`;
 } else if (dateObj.month != date.getMonth() || dateObj.day != date.getDate()) {
  return `${months[dateObj.month]} ${dateObj.day}`;
 } else {
  if (date.getHours() - Number(dateObj.hour) > 0) {
   return `${date.getHours() - Number(dateObj.hour)}h ago`;
  } else if (date.getMinutes() - Number(dateObj.minute) > 0) {
   return `${date.getMinutes() - Number(dateObj.minute)}min ago`;
  } else {
   return "Just now";
  }
 }
};

const setupImageModalFocus = (e) => {
 setupModalTrapFocus(modal, "button", closeModal, e);
};

const openModal = (e) => {
 if (e.type === "click" || e.key === "Enter") {
  e.target.setAttribute("id", "modal-open");

  const img = createHTML("img", null, null, {
   tabindex: "-1",
   src: e.target.getAttribute("src"),
   alt: e.target.getAttribute("alt"),
  });

  modal.querySelector(".container").prepend(img);
  body.classList.add("no-scroll");
  modal.classList.remove("hidden");
  modal.classList.add("open");

  modal.focus();

  document.addEventListener("keydown", setupImageModalFocus);
 }
};

const closeModal = () => {
 modal.classList.add("hidden");
 modal.classList.remove("open");
 modal.querySelector("img").remove();
 body.classList.remove("no-scroll");
 document.removeEventListener("keydown", setupImageModalFocus);
 const openedElement = document.querySelector("#modal-open");
 openedElement.focus();
 openedElement.removeAttribute("id");
};

const setupModal = (images) => {
 for (const image of images) {
  image.setAttribute("tabindex", 0);
  image.addEventListener("click", openModal);
  image.addEventListener("keydown", openModal);
 }

 modal.addEventListener("click", (e) => {
  if (e.target === modal) {
   closeModal();
  }
 });
};

const renderArticle = async () => {
 try {
  const response = await fetchApi(`/wp/v2/posts/${articleId}`, "?_embed");
  const post = response.data;
  const title = decodeHTML(post.title.rendered);
  document.title = `${title} | Urban Traveller`;

  const excerpt = decodeHTML(
   post.excerpt.rendered.replace("<p>", "").replace("</p>", "")
  );
  document
   .querySelector("meta[name='description']")
   .setAttribute("content", excerpt);

  const template = document.querySelector("#template_article");
  const article = template.content.cloneNode(true);

  const featuredImage = article.querySelector("header img");
  const category = article.querySelector("#category");
  const imageInfo = post._embedded["wp:featuredmedia"][0];

  const postContent = parseHTML(post.content.rendered);
  const images = Array.from(postContent.querySelectorAll("img"));
  images.push(article.querySelector("header img"));

  category.innerText = post._embedded["wp:term"][0][0].name;
  featuredImage.setAttribute("src", imageInfo.source_url);
  featuredImage.setAttribute("alt", imageInfo.alt_text);
  article.querySelector("header h1").innerText = title;

  appendArray(
   postContent.childNodes,
   article.querySelector(".article-content")
  );

  article.querySelector("#date").innerText = setDate(post.date);

  setupModal(images);

  main.querySelector(".loader").remove();
  main.prepend(article);
 } catch (error) {
  console.log(error);
  main.innerHTML = "";
  main.append(
   renderAlertDialog(
    "alert",
    "Oops, content failed to load. Please try again later"
   )
  );
 }
};

const loadComments = async (e) => {
 try {
  commentsLoader.classList.remove("hidden");
  commentPage++;

  const response = await fetchApi("/wp/v2/comments", null, fetchInit);

  commentsLoader.classList.add("hidden");

  renderComments(response.data);

  if (commentPage == response.parsedHeader["x-wp-totalpages"]) {
   e.target.remove();
  } else {
   commentOffset += commentsPerPage;
  }
 } catch (error) {
  console.log(error);
  e.target.remove();
  commentList.append(
   renderAlertDialog(
    "alert",
    "Oops, content failed to load. Please try again later"
   )
  );
 }
};

const renderComment = (comment) => {
 const template = document.querySelector("#template_comment");
 const commentElem = template.content.cloneNode(true);
 const content = parseHTML(comment.content.rendered);

 commentElem.querySelector("h3").innerText = decodeHTML(comment.author_name);
 commentElem.querySelector("#time").innerText = setDate(comment.date);
 appendArray(content.childNodes, commentElem.querySelector("#content"));

 return commentElem;
};

const renderComments = async (comments, parent) => {
 if (comments.length === 0) {
  parent.append(
   renderAlertDialog("alert", "There are no comments on this post...")
  );
 } else {
  for (const comment of comments) {
   commentList.append(renderComment(comment));
  }
 }
};

const fetchComments = async () => {
 try {
  const response = await fetchApi(
   "/wp/v2/comments",
   `?post=${articleId}&page=${commentPage}&_embed`
  );

  commentAmount = response.parsedHeader["x-wp-total"];
  commentsLoader.classList.add("hidden");

  renderComments(response.data, commentListWrapper);

  if (commentAmount > 15) {
   const button = createHTML(
    "button",
    ["button", "button--primary"],
    "See more"
   );
   button.addEventListener("click", loadComments);
   commentListWrapper.append(button);
  }
  document.querySelector("#comment-count").innerText = `( ${commentAmount} )`;
 } catch (error) {
  console.log(error);
  commentSection.innerHTML = "";
  commentSection.append(
   renderAlertDialog(
    "alert",
    "Oops, comments failed to load. Please try again later..."
   )
  );
 }
};

const submitComment = async () => {
 const reqBody = JSON.stringify({
  post: articleId,
  author_name: nameInput.value.trim(),
  author_email: emailInput.value.trim(),
  content: commentInput.value.trim(),
 });

 const fetchInit = {
  method: "POST",
  headers: {
   "Content-Type": "application/json",
  },
  body: reqBody,
 };

 try {
  const response = await fetchApi("/wp/v2/comments", null, fetchInit);

  if (response.ok) {
   const alert = commentListWrapper.querySelector(".alert");

   commentForm.reset();
   commentOffset++;
   commentAmount++;

   firstFormElem.after(
    renderAlertDialog("success", "Comment sent", "comment-alert")
   );
   commentList.prepend(renderComment(response.data));
   commentCount.innerText = `( ${commentAmount} )`;

   if (alert) {
    alert.remove();
   }
  } else {
   console.log("error", response.data.message);

   if (!response.data.message) {
    response.message =
     "Comment did not send, something happened! Please try again later...";
   }

   firstFormElem.after(
    renderAlertDialog("error", response.data.message, "comment-alert")
   );
  }
 } catch (error) {
  console.log(error);
  firstFormElem.after(
   renderAlertDialog("error", error.message, "comment-alert")
  );
 }
};

const validateComment = (e) => {
 e.preventDefault();

 if (document.querySelector("#comment-alert")) {
  document.querySelector("#comment-alert").remove();
 }

 const validation = {
  name: characterValidation(nameInput.value),
  email: emailValidation(emailInput.value),
  comment: characterValidation(commentInput.value, 15),
 };

 if (validation.name && validation.email && validation.comment) {
  submitComment();
 } else {
  const nameAlert = document.querySelector(`#${errorInfo.name.id}`);
  const emailAlert = document.querySelector(`#${errorInfo.email.id}`);
  const messageAlert = document.querySelector(`#${errorInfo.comment.id}`);

  if (!validation.name && !nameAlert) {
   nameInput.parentElement.append(
    renderAlertText("error", errorInfo.name.errorMessage, errorInfo.name.id)
   );
  }

  if (!validation.email && !emailAlert) {
   emailInput.parentElement.append(
    renderAlertText("error", errorInfo.email.errorMessage, errorInfo.email.id)
   );
  }

  if (!validation.comment && !messageAlert) {
   commentInput.parentElement.append(
    renderAlertText(
     "error",
     errorInfo.comment.errorMessage,
     errorInfo.comment.id
    )
   );
  }
 }
};

const setupCommentForm = () => {
 commentForm.reset();

 nameInput.addEventListener("focusout", function (e) {
  const validated = characterValidation(nameInput.value.trim());
  validationError(
   this,
   validated,
   errorInfo.name.id,
   errorInfo.name.errorMessage
  );
 });

 nameInput.addEventListener("input", function (e) {
  const validated = characterValidation(nameInput.value.trim());
  const alert = document.querySelector(`#${errorInfo.name.id}`);

  if (validated && alert) {
   alert.remove();
  }
 });

 setupEmailEventListener(
  emailInput,
  errorInfo.email.id,
  errorInfo.email.errorMessage
 );

 commentInput.addEventListener("input", function (e) {
  const validated = characterValidation(commentInput.value.trim(), 15);
  const alert = document.querySelector(`#${errorInfo.comment.id}`);

  if (validated && alert) {
   alert.remove();
  }
 });

 submitButton.addEventListener("click", validateComment);
};

export const setupArticle = () => {
 renderArticle();
 fetchComments();
 setupCommentForm();
};
setupArticle();
