const slides = document.querySelectorAll(".slide");
const interval = 5000;

let slideIndex = 0;
slides[slideIndex].classList.add("active");

setInterval(() => {
  slides[slideIndex].classList.remove("active");
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add("active");
}, interval);

