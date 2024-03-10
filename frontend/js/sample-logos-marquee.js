const marqueeContent = document.querySelector('.marquee-content');
const marqueeContainer = document.querySelector('.marquee');
const marqueeItems = [...marqueeContent.children];

let isAnimating = true;
let currentPosition = 0;

function animateMarquee() {
  if (!isAnimating) return;

  currentPosition -= 1;
  marqueeContent.style.transform = `translateX(${currentPosition}px)`;

  const containerWidth = marqueeContainer.offsetWidth;
  const contentWidth = marqueeContent.offsetWidth;

  if (Math.abs(currentPosition) >= contentWidth - containerWidth) {
    currentPosition = 0;
  }

  requestAnimationFrame(animateMarquee);
}

function startAnimation() {
  isAnimating = true;
  animateMarquee();
}

function stopAnimation() {
  isAnimating = false;
}

/* marqueeContainer.addEventListener('mouseover', stopAnimation);
marqueeContainer.addEventListener('mouseout', startAnimation); */

startAnimation();