"use strict";

const modal = document.querySelector(".modal");
const header = document.querySelector(".header");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const sections = document.querySelectorAll(".section");
const footer = document.querySelector(".footer");
const links = document.querySelectorAll(".nav__link");
const navBar = document.querySelector(".nav");
const tabConteiner = document.querySelector(".operations__tab-container");
const lazyImigas = document.querySelectorAll(".lazy-img");
const hiddenSections = [...sections, footer];
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const slideBtnLeft = document.querySelector(".slider__btn--left");
const slideBtnRight = document.querySelector(".slider__btn--right");

const headerObserver = new IntersectionObserver(stinky, {
  root: null,
  rootMargin:
    "-" + Number.parseFloat(window.getComputedStyle(navBar).height) + "px",
  threshold: 0,
});

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

const imageObsorver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 1,
});

const btnOperations = document
  .querySelector(".operations")
  .querySelectorAll(".btn");

let activeBtnOper = document
  .querySelector(".operations__tab-container")
  .querySelector(".btn");

let activeInfo = document
  .querySelector(".operations")
  .querySelector(".operations__content");

let currentSlide = 0;
let slideCurPos = new Array();
let slideStartPos = new Array();
let slideEndPos = new Array();

function InitSlides() {
  slides.forEach((slide, i) => {
    slideStartPos.push(i * 100);
    slide.style.transform = `translateX(${slideStartPos[i]}%)`;
    //create dots
    document
      .querySelector(".dots")
      .insertAdjacentHTML("afterbegin", "<div class='dots__dot'></div>");
  });
  slideCurPos = [...slideStartPos];
  slideEndPos = [...slideStartPos];
  slideEndPos = slideEndPos.reverse().map((el) => el * -1);
}

function loadImg(entrie, observer) {
  if (!entrie[0].isIntersecting) return;
  entrie[0].target.src = entrie[0].target.getAttribute("data-src");
  entrie[0].target.classList.remove("lazy-img");
  observer.unobserve(entrie[0].target);
}

function revealSection(entries, observer) {
  if (!entries[0].isIntersecting) return;
  entries[0].target.classList.remove("section--hidden");
  observer.unobserve(entries[0].target);
}

function stinky(entry) {
  if (!entry[0].isIntersecting && !navBar.classList.contains("sticky"))
    navBar.classList.add("sticky");
  if (entry[0].isIntersecting && navBar.classList.contains("sticky"))
    navBar.classList.remove("sticky");
}

function loadInfo(num) {
  activeInfo.classList.remove("operations__content--active");
  activeInfo = document
    .querySelector(".operations")
    .querySelector(`.operations__content--${num}`);
  activeInfo.classList.add("operations__content--active");
}

function changingTabs(event) {
  const targett = event.target.closest(".operations__tab");
  if (targett && targett.classList.contains("btn")) {
    activeBtnOper.classList.remove("operations__tab--active");
    activeBtnOper = targett;
    activeBtnOper.classList.add("operations__tab--active");
    const tabNum = activeBtnOper.getAttribute("data-tab");
    loadInfo(tabNum);
  }
}

function navFadeOut(event, opacity) {
  const targett = event.target;
  if (targett.classList.contains("nav__link")) {
    const siblings = targett.closest(".nav").querySelectorAll(".nav__link");
    const logo = targett.closest(".nav").querySelector("img");

    for (const link of siblings.values()) {
      if (link !== targett) {
        link.style.opacity = opacity;
        logo.style.opacity = opacity;
      }
    }
  }
}

function translateX(slide, x) {
  slide.style.transform = `translateX(${x}%)`;
}

function reloadDots(i, prev) {
  document
    .querySelector(".dots")
    .querySelectorAll(".dots__dot")
    [prev].classList.remove("dots__dot--active");
  document
    .querySelector(".dots")
    .querySelectorAll(".dots__dot")
    [i].classList.add("dots__dot--active");
}

function slideLeft() {
  let prev;
  if (currentSlide === 0) {
    prev = currentSlide;
    currentSlide = slides.length - 1;
    slideCurPos = [...slideEndPos];
    slides.forEach((slide, i) => {
      translateX(slide, slideEndPos[i]);
    });
  } else {
    slides.forEach((slide, i) => {
      translateX(slide, (slideCurPos[i] += 100));
    });
    prev = currentSlide;
    currentSlide--;
  }
  reloadDots(currentSlide, prev);
}

function slideRight() {
  let prev;
  if (currentSlide === slides.length - 1) {
    prev = currentSlide;
    currentSlide = 0;
    slideCurPos = [...slideStartPos];
    slides.forEach((slide, i) => {
      translateX(slide, slideStartPos[i]);
    });
  } else {
    slides.forEach((slide, i) => {
      translateX(slide, (slideCurPos[i] -= 100));
    });
    prev = currentSlide;
    currentSlide++;
  }
  reloadDots(currentSlide, prev);
}

function scroolTo(element) {
  element.scrollIntoView({ behavior: "smooth" });
}

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

function deleteCookie() {
  cookieModal.remove();
}

function keyDetektion(e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
}

//adding anoying shit
const cookieModal = document.createElement("div");
cookieModal.classList.add("cookie-message");
cookieModal.innerHTML =
  "Fuck you!<button class='btn btn--close-cookie'>Got it!</button>";
header.prepend(cookieModal);
cookieModal.style.backgroundColor = "#37383d";
cookieModal.style.width = "120%";

cookieModal.style.height =
  Number.parseFloat(getComputedStyle(cookieModal).height) + 40 + "px";

cookieModal.classList.toggle("asgashg");

//initialization
InitSlides();
document
  .querySelector(".dots")
  .querySelectorAll(".dots__dot")[0]
  .classList.add("dots__dot--active");

//Obsorvers
hiddenSections.forEach(function (section) {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});

lazyImigas.forEach(function (img) {
  imageObsorver.observe(img);
});

headerObserver.observe(header);

//event listeners
for (const button of btnsOpenModal.values())
  button.addEventListener("click", openModal);

//NavBar scrolling
navBar.addEventListener("click", (event) => {
  event.preventDefault();
  const eTarget = event.target;
  const ref = eTarget.getAttribute("href");
  if (ref && ref !== "#") scroolTo(document.querySelector(ref));
});

navBar.addEventListener("mouseover", (event) => {
  navFadeOut(event, 0.5);
});
navBar.addEventListener("mouseout", (event) => {
  navFadeOut(event, 1);
});

slideBtnLeft.addEventListener("click", slideLeft);
slideBtnRight.addEventListener("click", slideRight);
tabConteiner.addEventListener("click", changingTabs);
btnCloseModal.addEventListener("click", closeModal);
cookieModal.querySelector("button").addEventListener("click", deleteCookie);
overlay.addEventListener("click", closeModal);
btnScrollTo.addEventListener("click", function (event) {
  scroolTo(section1);
});
document.addEventListener("keydown", keyDetektion);

window.addEventListener("beforeunload", (event) => {
  event.preventDefault();
  event.returnValue = "";
});
