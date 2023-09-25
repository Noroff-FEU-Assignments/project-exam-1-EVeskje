document.addEventListener("DOMContentLoaded", function () {
 const navToggle = document.getElementById("navToggle");
 const navLinks = document.querySelector(".nav-links");

 navToggle.addEventListener("click", function () {
  if (window.getComputedStyle(navLinks).display === "none") {
   navLinks.style.display = "flex";
  } else {
   navLinks.style.display = "none";
  }
 });
});
