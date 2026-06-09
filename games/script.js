function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCookie(name) {
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=')
        if (key.trim() === name) {
            return value
        }
    }
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

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
    toggleTheme();
});

if (getCookie('theme') === 'dark') {
    document.documentElement.classList.add('dark-mode');
    themeToggle.checked = true;
} else {
    document.documentElement.classList.remove('dark-mode');
    themeToggle.checked = false;
}