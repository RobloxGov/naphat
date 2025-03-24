let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function updateSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.opacity = i === index ? '1' : '0';
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function moveSlide(step) {
    currentIndex += step;
    if (currentIndex < 0) {
        currentIndex = slides.length - 1;
    } else if (currentIndex >= slides.length) {
        currentIndex = 0;
    }
    updateSlide(currentIndex);
}

function setSlide(index) {
    currentIndex = index;
    updateSlide(currentIndex);
}

// เริ่มต้นแสดง Slide แรก
updateSlide(currentIndex);
