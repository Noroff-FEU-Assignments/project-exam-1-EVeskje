import { fetchApi } from "../utilities/api.js";
import { renderAlertDialog } from "../components/error.js";
import { decodeHTML } from "../utilities/htmlUtilities.js";

const carouselSection = document.querySelector(".carousel-container");
const carousel = carouselSection.querySelector("#carousel");
const carouselRightButton = carouselSection.querySelector("#carousel-right");
const carouselLeftButton = carouselSection.querySelector("#carousel-left");
const carouselDots = Array.from(carouselSection.querySelectorAll(".dots .dot"));

let carouselWidth = carousel.clientWidth;
let scrollX = 0;
let dotCount = 0;
let sliderIndex = 0;

// Carousel
carouselDots[sliderIndex].classList.add("active");

const renderCard = (post) => {
 const template = document.querySelector("#template_carousel-card");
 const card = template.content.cloneNode(true);
 const titleLink = card.querySelector("h3 a");
 const excerpt = decodeHTML(
  post.excerpt.rendered.replace("<p>", "").replace("</p>", "")
 );
 const image = card.querySelector("img");
 const featuredImage = post._embedded["wp:featuredmedia"][0];
 const categoryName = post._embedded["wp:term"][0][0].name;

 titleLink.innerText = decodeHTML(post.title.rendered);
 titleLink.setAttribute("href", `./article.html?id=${post.id}`);
 card.querySelector("p").innerText = excerpt;
 image.setAttribute("src", featuredImage.source_url);
 image.setAttribute("alt", featuredImage.alt_text);
 card.querySelector(".category-item").innerText = categoryName;

 return card;
};

const renderCarousel = async () => {
 try {
  const response = await fetchApi("/wp/v2/posts", "?per_page=12&_embed");

  for (const post of response.data) {
   const li = renderCard(post);
   carousel.appendChild(li);
  }

  carouselSection.querySelector(".loader").remove();
 } catch (error) {
  console.log(error);
  carouselSection.innerHTML = "";
  carouselSection.append(
   renderAlertDialog(
    "alert",
    "Oops, latest posts failed to load. Please try again later"
   )
  );
 }
};

const setDotCount = () => {
 if (!window.matchMedia("(max-width: 70em)").matches) {
  dotCount = 3;
 } else if (!window.matchMedia("(max-width: 55em)").matches) {
  dotCount = 4;
 } else {
  dotCount = carouselDots.length;
 }
};

const updateCarousel = (e) => {
 carouselWidth = carousel.clientWidth;
 carouselDots[sliderIndex].classList.remove("active");

 if (e.target === carouselLeftButton) {
  sliderIndex--;
  if (sliderIndex < 0) {
   sliderIndex = dotCount - 1;
  }

  if (scrollX <= 0) {
   scrollX = carousel.scrollWidth + window.padding;
  }

  scrollX -= carouselWidth + window.padding;
 } else if (e.target === carouselRightButton) {
  sliderIndex++;
  if (sliderIndex > dotCount - 1) {
   sliderIndex = 0;
  }

  if (scrollX >= carousel.scrollWidth - carouselWidth) {
   scrollX = 0 - carouselWidth - window.padding;
  }

  scrollX += carouselWidth + window.padding;
 } else {
  carouselDots[sliderIndex].classList.add("active");
  return;
 }

 e.target.disabled = true;
 setTimeout(() => {
  e.target.disabled = false;
 }, 150);

 carousel.scroll({
  left: scrollX,
  top: 0,
  behavior: "smooth",
 });

 carouselDots[sliderIndex].classList.add("active");
};

const setupCarousel = async () => {
 carousel.scrollLeft = scrollX;

 await renderCarousel();
 setDotCount();

 const cardWidth = carousel.querySelector("li").clientWidth;
 const cardsInView = Math.floor(carouselWidth / cardWidth);
 window.padding = (carouselWidth - cardWidth * cardsInView) / (cardsInView - 1);

 carouselLeftButton.addEventListener("click", updateCarousel);
 carouselRightButton.addEventListener("click", updateCarousel);

 let timeout;
 const resizeObserver = new ResizeObserver((entries) => {
  if (timeout) {
   clearTimeout(timeout);
   timeout = 0;
  }

  timeout = setTimeout(() => {
   let width = entries[0].contentRect.width;

   if (width !== carouselWidth) {
    setDotCount();
    carouselDots[sliderIndex].classList.remove("active");
    sliderIndex = 0;
    carouselDots[sliderIndex].classList.add("active");
    scrollX = 0;

    carousel.scroll({
     left: scrollX,
     top: 0,
     behavior: "smooth",
    });
   }
  }, 500);
 });

 resizeObserver.observe(carousel);
};

// Setup
export const setupIndex = () => {
 setupCarousel();
};

setupIndex();
