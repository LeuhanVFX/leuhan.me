/// Fonctions
function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
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

/// Gestion du theme
let themeToggle = document.querySelector('.theme-toggle input');

themeToggle.addEventListener('change', () => {
    // Vérifie si le navigateur supporte l'API (Chrome, Edge, Safari récent)
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
const carousel = document.querySelector('.carousel');

/// Scroll horizontal avec la molette
carousel.addEventListener('mouseenter', () => {
    carousel.addEventListener('wheel', (e) => {
    const isScrollingRight = e.deltaY > 0;
    const isScrollingLeft = e.deltaY < 0;

    const canScrollRight = carousel.scrollLeft < (carousel.scrollWidth - carousel.clientWidth);
    const canScrollLeft = carousel.scrollLeft > 0;

    if ((isScrollingRight && canScrollRight) || (isScrollingLeft && canScrollLeft)) {
        e.preventDefault();
        carousel.scrollLeft += (2 * e.deltaY);
    }
});
});

carousel.addEventListener('mouseleave', () => {
    carousel.removeEventListener('wheel', (e) => {
    const isScrollingRight = e.deltaY > 0;
    const isScrollingLeft = e.deltaY < 0;

    const canScrollRight = carousel.scrollLeft < (carousel.scrollWidth - carousel.clientWidth);
    const canScrollLeft = carousel.scrollLeft > 0;

    if ((isScrollingRight && canScrollRight) || (isScrollingLeft && canScrollLeft)) {
        e.preventDefault();
        carousel.scrollLeft += (2 * e.deltaY);
    }
});
});


/// Top button
const topButton = document.getElementById('top-button');

window.addEventListener('scroll', async () => {
    if (window.scrollY > 500) {
        topButton.classList.add('show');
    } else {
        topButton.classList.remove('show');
    }
});