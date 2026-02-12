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

function showGrid(items, currentIndex) {
    for (let i = 0; i < items.length; i++) {
        if (i === currentIndex) {
            items[i].style.display = 'flex';
            items[i].style.gridColumn = 2
        } else if (i === currentIndex + 1) {
            items[i].style.display = 'flex';
            items[i].style.gridColumn = 3
        } else if (i === currentIndex - 1) {
            items[i].style.display = 'flex';
            items[i].style.gridColumn = 1
        } else {
            items[i].style.display = 'none';
        }
        }
    }

function showCarouselArrow(leftArrow, rightArrow, currentIndex) {
    if (currentIndex === 0) {
        leftArrow.style.opacity = '0';
        rightArrow.style.cursor = 'default';
    } else {
        leftArrow.style.opacity = '1';
        rightArrow.style.cursor = 'pointer';
    }
    if (currentIndex === carouselItems.length - 1) {
        rightArrow.style.opacity = '0';
        rightArrow.style.cursor = 'default';
    } else {
        rightArrow.style.opacity = '1';
        rightArrow.style.cursor = 'pointer';
    }
}
/// Gestion du theme
let themeToggle = document.querySelector('.theme-toggle input');

themeToggle.addEventListener('change', () => {
    // Vérifie si le navigateur supporte l'API (Chrome, Edge, Safari récent)
    toggleTheme();
});

if (true) {
    document.documentElement.classList.add('dark-mode');
    themeToggle.checked = true;
} else {
    document.documentElement.classList.remove('dark-mode');
    themeToggle.checked = false;
}

/// Carousel
const carousel = document.querySelector('.carousel');
const carouselItems = Array.from(carousel.querySelectorAll('.carousel-item'))
console.log(carouselItems)
let currentIndex = 0;

showGrid(carouselItems, currentIndex)

const leftArrow = document.getElementById('left_arrow');
leftArrow.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        showGrid(carouselItems, currentIndex)
        showCarouselArrow(leftArrow, rightArrow, currentIndex)
    }
})

const rightArrow = document.getElementById('right_arrow');
rightArrow.addEventListener('click', () => {
    if (currentIndex < carouselItems.length - 1) {
        currentIndex++;
        showGrid(carouselItems, currentIndex)
        showCarouselArrow(leftArrow, rightArrow, currentIndex)
    }
})

/// Top button
const topButton = document.getElementById('top-button');

window.addEventListener('scroll', async () => {
    if (window.scrollY > 500) {
        topButton.classList.add('show');
    } else {
        topButton.classList.remove('show');
    }
});