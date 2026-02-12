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
const carouselItems = carousel.querySelectorAll('.carousel-item');
let currentIndex = 0;
function showGrid(items, grid) {
    items.forEach((item, index) => {
        if (items.indexOf(item) === currentIndex) {
            item.style.display = 'flex';
            item.style.gridColumn = 2
        } else if (items.indexOf(item) === currentIndex + 1) {
            item.style.display = 'flex';
            item.style.gridColumn = 1
        } else if (items.indexOf(item) === currentIndex - 1) {
            item.style.display = 'flex';
            item.style.gridColumn = 3
        } else {
            item.style.display = 'none';
        }
    })
}

/// Top button
const topButton = document.getElementById('top-button');

window.addEventListener('scroll', async () => {
    if (window.scrollY > 500) {
        topButton.classList.add('show');
    } else {
        topButton.classList.remove('show');
    }
});