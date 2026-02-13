/// Fonctions
function getCookie(name) {
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=')
        if (key.trim() === name) {
            return value
        }
    }
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/// Theme toggle
function toggleTheme() {
    if (themeToggle.checked) {
        document.documentElement.classList.add('dark-mode');
        document.cookie = "theme=dark; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    } else {
        document.documentElement.classList.remove('dark-mode');
        document.cookie = "theme=light; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    }
}

function updateCarousel() {

    const slideWidth = slides[0].offsetWidth;
    const gap = 40;

    const offset = (slideWidth + gap) * currentIndex;

    track.style.transform = `translateX(-${offset}px)`;

    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentIndex);
    });

    leftArrow.style.opacity = currentIndex === 0 ? '0' : '1';
    leftArrow.style.cursor = currentIndex === 0 ? 'default' : 'pointer';
    rightArrow.style.opacity = currentIndex === slides.length - 1 ? '0' : '1';
    rightArrow.style.cursor = currentIndex === 0 ? 'default' : 'pointer';
}
/// Gestion du theme
let themeToggle = document.querySelector('.theme-toggle input');

themeToggle.addEventListener('change', () => {
    toggleTheme();
});

if (getCookie('theme') === 'dark') {
    document.documentElement.classList.add('dark-mode');
    themeToggle.checked = true;
} else {
    document.documentElement.classList.remove('dark-mode');
    themeToggle.checked = false;
}

/// Carousel
const track = document.querySelector('.carousel-track');
const slides = Array.from(document.querySelectorAll('.carousel-item'));
const leftArrow = document.getElementById('left_arrow');
const rightArrow = document.getElementById('right_arrow');

let currentIndex = 0;


rightArrow.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
        updateCarousel();
    }
});

leftArrow.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});

window.addEventListener('resize', updateCarousel);

updateCarousel();



/// Top button
const topButton = document.getElementById('top_button');

window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight/4) {
        topButton.style.opacity = '1';
        topButton.style.visibility = 'visible';
        topButton.style.transform = 'translateY(0)';
    } else {
        topButton.style.opacity = '0';
        topButton.style.visibility = 'hidden';
        topButton.style.transform = 'translateY(50px)';
    }
});