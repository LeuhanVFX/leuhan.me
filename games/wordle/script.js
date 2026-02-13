///// Functions /////
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

function getName(variable) {
    return Object.keys(variable)[0]
}

function afficherPremereLettre(mot) {
    /**
     * Affiche la première lettre du mot
     * 
     * @param {mot} string - Le mot dont la première lettre doit être afiché
     */
    let first_letter = mot.charAt(0).toUpperCase()
    let first_cell = ligne_active[0]
    first_cell.innerHTML = first_letter
    first_cell.setAttribute('used', 'true')
    active_cell.style.borderColor = 'rgb(196, 186, 174)'
    active_cell.style.boxShadow = 'none'
    active_cell = ligne_active[1]
    active_cell.style.borderColor = 'rgb(249, 176, 252)'
    active_cell.style.boxShadow = '0px 0px 10px 1px rgb(252, 158, 255)'
}

async function hideLetters() {
    let invalid_letters = []
    keys.forEach((key) => {
        if (!mot.includes(key.innerHTML.toLowerCase()) && (key.id != 'Backspace' && key.id != 'Enter')) {
            invalid_letters.push(key)
        }
    })
    for (let i = 0; i < 6; i++) {
        let key = invalid_letters[Math.floor(Math.random() * invalid_letters.length)]
        key.style.backgroundColor = 'rgb(80, 80, 80)'
        invalid_letters.splice(invalid_letters.indexOf(key), 1)
    }
}

function reset() {
    /**
     * Réinitialise la grille
     */
    for (let i = 0; i < cells_list.length; i++) {
        let cell = cells_list[i]
        cell.innerHTML = ''
        cell.style.backgroundColor = 'var(--secondary)'
        cell.removeAttribute('used')
        cell.removeAttribute('state')
    }
    mot = liste_mots[Math.floor(Math.random() * liste_mots.length)]
    document.cookie = 'mot=' + mot + '; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT'
    mot_l = Array.from(mot.toLowerCase())
    ligne_active = lignes[0]
    active_cell.style.borderColor = 'rgb(196, 186, 174)'
    active_cell.style.boxShadow = 'none'
    active_cell = ligne_active[0]
    active_cell.style.borderColor = 'rgb(249, 176, 252)'
    active_cell.style.boxShadow = '0px 0px 10px 1px rgb(252, 158, 255)'
    mots_utilises = []
    deleteCookie('mots_utilises')
    keys.forEach((key) => {
        key.style.backgroundColor = 'rgb(196, 186, 174)'
        key.removeAttribute('state')
    })
    if (dif == 'easy') {
        afficherPremereLettre(mot)
        hideLetters()
    }
    if (document.cookie.includes('ligne1')) {
        deleteCookie('ligne1')
    }
    if (document.cookie.includes('ligne2')) {
        deleteCookie('ligne2')
    }
    if (document.cookie.includes('ligne3')) {
        deleteCookie('ligne3')
    }
    if (document.cookie.includes('ligne4')) {
        deleteCookie('ligne4')
    }
    if (document.cookie.includes('ligne5')) {
        deleteCookie('ligne5')
    }
    if (document.cookie.includes('ligne6')) {
        deleteCookie('ligne6')
    }
};

function blurexcept(itemid) {
    let item = document.getElementById(itemid)
    blurbox = document.createElement('div')
    document.body.appendChild(blurbox)
    blurbox.style.width = '100vw'
    blurbox.style.height = '100vh'
    blurbox.style.position = 'fixed'
    blurbox.style.top = '0'
    blurbox.style.left = '0'
    blurbox.style.zIndex = '10'
    blurbox.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'
    blurbox.style.backdropFilter = 'blur(10px)'
    item.style.zIndex = '11'
    blurbox.addEventListener("click", (event) => {
        item.style.display = 'none';
        unblur()
    });
    keyboard = false
}

function unblur() {
    document.body.removeChild(blurbox)
    keyboard = true
}

function summonBanner(bannerid, text) {
    let banner = document.getElementById(bannerid)
    let close_button = banner.getElementsByClassName('close_button')[0]
    close_button.addEventListener("click", (event) => {
        banner.style.display = 'none';
        unblur()
    });
    let replay_button = banner.getElementsByClassName('button')[0]
    replay_button.addEventListener("click", (event) => {
        banner.style.display = 'none';
        reset()
        unblur()
    });
    banner.getElementsByClassName('banner_text')[0].innerHTML = text
    banner.style.display = 'block';
    blurexcept(bannerid)

}

async function summonTempBanner(bannerid, text, duration) {
    let banner = document.getElementById(bannerid)
    banner.getElementsByClassName('banner_text')[0].innerHTML = text
    banner.style.display = 'block';
    blurexcept(bannerid)
    await sleep(duration)
    banner.style.display = 'none';
    unblur()
}

async function summonSimpleBanner(text, duration) {
    let banner = document.createElement('div')
    banner.setAttribute('class', 'simple_banner')
    banner.innerHTML = text
    banner.style.position = 'fixed'
    banner.style.top = '50%'
    banner.style.left = '50%'
    banner.style.transform = 'translate(-50%, -50%)'
    banner.style.zIndex = '100'
    document.body.appendChild(banner)
    banner.animate([
        { opacity: 0 },
        { opacity: 1 },
        { opacity: 1 },
        { opacity: 1 },
        { opacity: 0 }
    ], duration)
    await sleep(duration)
    document.body.removeChild(banner)
}

async function verification() {
    let ligne_complete = true
    let juste = 0
    let dico_mot = {}
    keyboard = false
    for (let i = 0; i < mot_l.length; i++) { // Création du dictionnaire de lettres du mot
        let lettre = mot_l[i]
        if (!(lettre in dico_mot)) {
            dico_mot[lettre.toLowerCase()] = 1
        } else {
            dico_mot[lettre.toLowerCase()] += 1
        }
    }
    for (let j = 0; j < ligne_active.length; j++) { // Test si la ligne est complète
        let cell = ligne_active[j]
        if (!(cell.hasAttribute('used'))) {
            ligne_complete = false
            break
        }
    } if (ligne_complete == true) {
        let guess = ligne_active[0].innerHTML.toLowerCase() + ligne_active[1].innerHTML.toLowerCase() + ligne_active[2].innerHTML.toLowerCase() + ligne_active[3].innerHTML.toLowerCase() + ligne_active[4].innerHTML.toLowerCase()
        if (motsTestables.includes(guess)) { // Test si le mot est dans le dictionnaire
            if (!(mots_utilises.includes(guess.toUpperCase()))) { // Test si le mot a déjà été utilisé
                for (let k = 0; k < ligne_active.length; k++) { // Test si les lettres sont bien placées
                    let cell = ligne_active[k]
                    if (cell.innerHTML.toLowerCase() == mot[k].toLowerCase()) {
                        cell.setAttribute('state', 'correct')
                        dico_mot[cell.innerHTML.toLowerCase()] -= 1
                        juste++
                    }
                } ligne_active.forEach((cell) => { // Test si les lettres sont présentes dans le mot
                    if (mot.toLowerCase().includes(cell.innerHTML.toLowerCase()) && dico_mot[cell.innerHTML.toLowerCase()] > 0 && !(cell.hasAttribute('state'))) {
                        cell.setAttribute('state', 'present')
                        dico_mot[cell.innerHTML.toLowerCase()] -= 1
                    }
                });
                for (let n = 0; n < ligne_active.length; n++) { // Test si les lettres ne sont pas dans le mot
                    let cell = ligne_active[n]
                    if ((dico_mot[cell.innerHTML.toLowerCase()] == 0 && !(cell.hasAttribute('state'))) || !(mot.toLowerCase().includes(cell.innerHTML.toLowerCase()))) {
                        cell.setAttribute('state', 'absent')
                    }
                }
                let colorsheme = {
                    correct: 'rgba(15, 129, 0, 1)',
                    present: 'rgba(221, 133, 0, 1)',
                    absent: 'rgba(80, 80, 80, 1)'
                }
                for (let m = 0; m < ligne_active.length; m++) { // Changement de couleur des cases
                    let cell = ligne_active[m]
                    if (cell.getAttribute('state') == 'correct') {
                        cell.animate([
                            { transform: 'rotateX(0deg)', backgroundColor: 'rgb(121, 121, 121)' },
                            { transform: 'rotateX(90deg)', backgroundColor: colorsheme['correct'] },
                            { transform: 'rotateX(0deg)', backgroundColor: colorsheme['correct'] },
                        ], 300)
                        cell.style.backgroundColor = colorsheme[cell.getAttribute('state')]
                        keys.forEach((key) => {
                            if (key.innerHTML.toUpperCase() == cell.innerHTML.toUpperCase()) {
                                key.style.backgroundColor = colorsheme['correct']
                                key.setAttribute('state', 'correct')
                            }
                        })
                    } else if (cell.getAttribute('state') == 'present') {
                        cell.animate([
                            { transform: 'rotateX(0deg)', backgroundColor: 'rgb(121, 121, 121)' },
                            { transform: 'rotateX(90deg)', backgroundColor: colorsheme['present'] },
                            { transform: 'rotateX(0deg)', backgroundColor: colorsheme['present'] },
                        ], 300)
                        cell.style.backgroundColor = colorsheme[cell.getAttribute('state')]
                        keys.forEach((key) => {
                            if (key.innerHTML.toUpperCase() == cell.innerHTML.toUpperCase()) {
                                if (!key.hasAttribute('state')) {
                                    key.style.backgroundColor = colorsheme['present']
                                    key.setAttribute('state', 'present')
                                }
                            }
                        })
                    } else if (cell.getAttribute('state') == 'absent') {
                        cell.animate([
                            { transform: 'rotateX(0deg)', backgroundColor: 'rgb(121, 121, 121)' },
                            { transform: 'rotateX(90deg)', backgroundColor: colorsheme['absent'] },
                            { transform: 'rotateX(0deg)', backgroundColor: colorsheme['absent'] },
                        ], 300)
                        cell.style.backgroundColor = colorsheme[cell.getAttribute('state')]
                        keys.forEach((key) => {
                            if (key.innerHTML.toUpperCase() == cell.innerHTML.toUpperCase()) {
                                if (!key.hasAttribute('state')) {
                                    key.style.backgroundColor = colorsheme['absent']
                                }
                            }
                        })
                    }
                    // Pause pour que l'animation soit visible
                    await sleep(300);
                }
                document.cookie = "ligne" + (lignes.indexOf(ligne_active) + 1) + "=" + guess + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/"; // stockage des lignes
                if (juste == 5) {
                    summonBanner('win_banner', `<b>Vous avez trouvé le mot !</b>`);
                    deleteCookie('mot')
                    deleteCookie('mots_utilises')
                    ligne_active = []
                    if (document.cookie.includes('ligne1')) {
                        deleteCookie('ligne1')
                    }
                    if (document.cookie.includes('ligne2')) {
                        deleteCookie('ligne2')
                    }
                    if (document.cookie.includes('ligne3')) {
                        deleteCookie('ligne3')
                    }
                    if (document.cookie.includes('ligne4')) {
                        deleteCookie('ligne4')
                    }
                    if (document.cookie.includes('ligne5')) {
                        deleteCookie('ligne5')
                    }
                    if (document.cookie.includes('ligne6')) {
                        deleteCookie('ligne6')
                    }
                } else {
                    if (lignes.indexOf(ligne_active) < 5) {
                        mots_utilises.push(ligne_active[0].innerHTML + ligne_active[1].innerHTML + ligne_active[2].innerHTML + ligne_active[3].innerHTML + ligne_active[4].innerHTML)
                        document.cookie = "mots_utilises=" + mots_utilises.toString() + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/"; // stockage des mots utilisés
                        ligne_active = lignes[lignes.indexOf(ligne_active) + 1]
                        active_cell.style.borderColor = 'rgb(196, 186, 174)'
                        active_cell.style.boxShadow = 'none'
                        active_cell = ligne_active[0]
                        active_cell.style.borderColor = 'rgb(249, 176, 252)'
                        active_cell.style.boxShadow = '0px 0px 10px 1px rgb(252, 158, 255)'
                        if (dif == 'easy') {
                            afficherPremereLettre(mot)
                            active_cell.style.borderColor = 'rgb(196, 186, 174)'
                            active_cell.style.boxShadow = 'none'
                            active_cell = ligne_active[1]
                            active_cell.style.borderColor = 'rgb(249, 176, 252)'
                            active_cell.style.boxShadow = '0px 0px 10px 1px rgb(252, 158, 255)'
                        }
                    } else {
                        summonBanner('lose_banner', `<b>Perdu ! Le mot était : <br>${mot.toUpperCase()}</b>`);
                        ligne_active = []
                        deleteCookie('mot')
                        deleteCookie('mots_utilises')
                        if (document.cookie.includes('ligne1')) {
                            deleteCookie('ligne1')
                        }
                        if (document.cookie.includes('ligne2')) {
                            deleteCookie('ligne2')
                        }
                        if (document.cookie.includes('ligne3')) {
                            deleteCookie('ligne3')
                        }
                        if (document.cookie.includes('ligne4')) {
                            deleteCookie('ligne4')
                        }
                        if (document.cookie.includes('ligne5')) {
                            deleteCookie('ligne5')
                        }
                        if (document.cookie.includes('ligne6')) {
                            deleteCookie('ligne6')
                        }
                    }
                }
            } else {
                summonSimpleBanner('Mot déjà essayé', 1000)
                let ligne = document.getElementById('ligne' + (lignes.indexOf(ligne_active) + 1))

                ligne.animate([
                    { transform: 'translateX(0px)' },
                    { transform: 'translateX(5px)' },
                    { transform: 'translateX(-10px)' },
                    { transform: 'translateX(10px)' },
                    { transform: 'translateX(-10px)' },
                    { transform: 'translateX(0px)' },

                ], 300)
            }
        } else {
            summonSimpleBanner("Le mot n'est pas dans le dictionnaire", 1000)
            let ligne = document.getElementById('ligne' + (lignes.indexOf(ligne_active) + 1))

            ligne.animate([
                { transform: 'translateX(0px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(0px)' },

            ], 300)
        }
    } else {
        summonSimpleBanner('Veuillez rentrer un mot de 5 lettres', 1000)
        let ligne = document.getElementById('ligne' + (lignes.indexOf(ligne_active) + 1))

        ligne.animate([
            { transform: 'translateX(0px)', scale: 1 },
            { transform: 'translateX(5px)', scale: 1 },
            { transform: 'translateX(-10px)', scale: 1 },
            { transform: 'translateX(10px)', scale: 1 },
            { transform: 'translateX(-10px)', scale: 1 },
            { transform: 'translateX(0px)', scale: 1 },

        ], 300)
    }
    keyboard = true
};

async function verifRapide() {
    let ligne_complete = true
    let juste = 0
    let dico_mot = {}
    for (let i = 0; i < mot_l.length; i++) { // Création du dictionnaire de lettres du mot
        let lettre = mot_l[i]
        if (!(lettre in dico_mot)) {
            dico_mot[lettre.toLowerCase()] = 1
        } else {
            dico_mot[lettre.toLowerCase()] += 1
        }
    }
    for (let j = 0; j < ligne_active.length; j++) { // Test si la ligne est complète
        let cell = ligne_active[j]
        if (!(cell.hasAttribute('used'))) {
            ligne_complete = false
            break
        }
    } if (ligne_complete == true) {
        for (let k = 0; k < ligne_active.length; k++) { // Test si les lettres sont bien placées
            let cell = ligne_active[k]
            if (cell.innerHTML.toLowerCase() == mot[k].toLowerCase()) {
                cell.setAttribute('state', 'correct')
                dico_mot[cell.innerHTML.toLowerCase()] -= 1
                juste++
            }
        } ligne_active.forEach((cell) => { // Test si les lettres sont présentes dans le mot
            if (mot.toLowerCase().includes(cell.innerHTML.toLowerCase()) && dico_mot[cell.innerHTML.toLowerCase()] > 0 && !(cell.hasAttribute('state'))) {
                cell.setAttribute('state', 'present')
                dico_mot[cell.innerHTML.toLowerCase()] -= 1
            }
        });
        for (let n = 0; n < ligne_active.length; n++) { // Test si les lettres ne sont pas dans le mot
            let cell = ligne_active[n]
            if ((dico_mot[cell.innerHTML.toLowerCase()] == 0 && !(cell.hasAttribute('state'))) || !(mot.toLowerCase().includes(cell.innerHTML.toLowerCase()))) {
                cell.setAttribute('state', 'absent')
            }
        }
        let colorsheme = {
            correct: 'rgba(15, 129, 0, 1)',
            present: 'rgba(221, 133, 0, 1)',
            absent: 'rgba(80, 80, 80, 1)'
        }
        for (let m = 0; m < ligne_active.length; m++) { // Changement de couleur des cases
            let cell = ligne_active[m]
            if (cell.getAttribute('state') == 'correct') {
                cell.animate([
                    { transform: 'rotateX(0deg)', backgroundColor: 'rgb(121, 121, 121)' },
                    { transform: 'rotateX(90deg)', backgroundColor: colorsheme['correct'] },
                    { transform: 'rotateX(0deg)', backgroundColor: colorsheme['correct'] },
                ], 300)
                cell.style.backgroundColor = colorsheme[cell.getAttribute('state')]
                keys.forEach((key) => {
                    if (key.innerHTML.toUpperCase() == cell.innerHTML.toUpperCase()) {
                        key.style.backgroundColor = colorsheme['correct']
                        key.setAttribute('state', 'correct')
                    }
                })
            } else if (cell.getAttribute('state') == 'present') {
                cell.animate([
                    { transform: 'rotateX(0deg)', backgroundColor: 'rgb(121, 121, 121)' },
                    { transform: 'rotateX(90deg)', backgroundColor: colorsheme['present'] },
                    { transform: 'rotateX(0deg)', backgroundColor: colorsheme['present'] },
                ], 300)
                cell.style.backgroundColor = colorsheme[cell.getAttribute('state')]
                keys.forEach((key) => {
                    if (key.innerHTML.toUpperCase() == cell.innerHTML.toUpperCase()) {
                        if (!key.hasAttribute('state')) {
                            key.style.backgroundColor = colorsheme['present']
                            key.setAttribute('state', 'present')
                        }
                    }
                })
            } else if (cell.getAttribute('state') == 'absent') {
                cell.animate([
                    { transform: 'rotateX(0deg)', backgroundColor: 'rgb(121, 121, 121)' },
                    { transform: 'rotateX(90deg)', backgroundColor: colorsheme['absent'] },
                    { transform: 'rotateX(0deg)', backgroundColor: colorsheme['absent'] },
                ], 300)
                cell.style.backgroundColor = colorsheme[cell.getAttribute('state')]
                keys.forEach((key) => {
                    if (key.innerHTML.toUpperCase() == cell.innerHTML.toUpperCase()) {
                        if (!key.hasAttribute('state')) {
                            key.style.backgroundColor = colorsheme['absent']
                        }
                    }
                })
            }
        }
    }
};

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

///// Rules Button /////
let button = document.getElementById('rules')
let rules_chart = document.getElementById('rules_chart')
let close_button = document.getElementById('close_button')
let win_banner = document.getElementById('win_banner')

button.addEventListener("click", (event) => {
    rules_chart.style.display = 'block';
    blurexcept(rules_chart.id)
});

close_button.addEventListener("click", (event) => {
    rules_chart.style.display = 'none';
    unblur()
});
///// Difficulty /////
let dif_button = document.getElementById('dif_button')
let but_dot = document.getElementById('button_dot')

if (!document.cookie.includes('difficulty=')) {
    document.cookie = 'difficulty=hard; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT'
    dif = 'hard'
} else {
    dif = getCookie('difficulty')
}
if (dif == 'easy') {
    but_dot.style.left = '0%'
} else {
    but_dot.style.left = '50%'
}
dif_button.addEventListener("click", (event) => {
    if (dif == 'easy') {
        dif = 'hard'
        but_dot.style.left = '50%'
        but_dot.style.transition = '0.2s ease-out'
        document.cookie = 'difficulty=hard; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT'
        reset()
    } else {
        dif = 'easy'
        but_dot.style.left = '0%'
        document.cookie = 'difficulty=easy; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT'
        reset()
    }
})

///// Date /////
let date = new Date(Date.now())
date = date.toUTCString()

///// Mot /////
let liste_mots = motsFrequents

let mot = ''
if (!document.cookie.includes('mot')) {
    mot = liste_mots[Math.floor(Math.random() * liste_mots.length)]
    document.cookie = 'mot=' + mot + '; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT'
} else {
    mot = getCookie('mot')
}

let mot_l = Array.from(mot.toLowerCase())



///// Jeu /////
let cells_list = Array.from(document.getElementsByClassName('cell'))
let car_possibles = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
let keys = Array.from(document.getElementsByClassName('key'))
keyboard = true

// Lignes de Jeu
let ligne1 = cells_list.slice(0, 5);
let ligne2 = cells_list.slice(5, 10);
let ligne3 = cells_list.slice(10, 15);
let ligne4 = cells_list.slice(15, 20);
let ligne5 = cells_list.slice(20, 25);
let ligne6 = cells_list.slice(25, 30);

let lignes = [ligne1, ligne2, ligne3, ligne4, ligne5, ligne6]

let ligne_active = lignes[0] // ligne active

let mots_utilises = [] // Mots déjà testés

if (document.cookie.includes('mots_utilises')) {
    mots_utilises = getCookie('mots_utilises').split(',')
}

// Restoration des lignes
if (document.cookie.includes('ligne1')) {
    ligne1.forEach((cell, i) => {
        cell.innerHTML = getCookie('ligne1')[i].toUpperCase()
        cell.setAttribute('used', 'true')
    })
    verifRapide()
    ligne_active = lignes[1]
}
if (document.cookie.includes('ligne2')) {
    ligne2.forEach((cell, i) => {
        cell.innerHTML = getCookie('ligne2')[i].toUpperCase()
        cell.setAttribute('used', 'true')
    })
    verifRapide()
    ligne_active = lignes[2]
}
if (document.cookie.includes('ligne3')) {
    ligne3.forEach((cell, i) => {
        cell.innerHTML = getCookie('ligne3')[i].toUpperCase()
        cell.setAttribute('used', 'true')
    })
    verifRapide()
    ligne_active = lignes[3]
}
if (document.cookie.includes('ligne4')) {
    ligne4.forEach((cell, i) => {
        cell.innerHTML = getCookie('ligne4')[i].toUpperCase()
        cell.setAttribute('used', 'true')
    })
    verifRapide()
    ligne_active = lignes[4]
}
if (document.cookie.includes('ligne5')) {
    ligne5.forEach((cell, i) => {
        cell.innerHTML = getCookie('ligne5')[i].toUpperCase()
        cell.setAttribute('used', 'true')
    })
    verifRapide()
    ligne_active = lignes[5]
}

let active_cell = ligne_active[0] // Cellule active
active_cell.style.borderColor = 'rgb(249, 176, 252)'
active_cell.style.boxShadow = '0px 0px 10px 1px rgb(252, 158, 255)'

// Événements
document.addEventListener("keydown", (event) => {
    if (keyboard == true) { // clavier utilisable
        if (car_possibles.includes(event.key.toUpperCase())) {
            for (let i = 0; i < ligne_active.length; i++) {
                let cell = ligne_active[i]
                if (!(cell.hasAttribute('used'))) {
                    cell.innerHTML = event.key.toUpperCase()
                    cell.setAttribute('used', 'true')
                    active_cell.style.borderColor = 'rgb(196, 186, 174)'
                    active_cell.style.boxShadow = 'none'
                    if (i < 4) {
                        active_cell = ligne_active[i + 1]
                        active_cell.style.borderColor = 'rgb(249, 176, 252)'
                        active_cell.style.boxShadow = '0px 0px 10px 1px rgb(252, 158, 255)'
                    }
                    break
                }
            }
        } else {
            if (event.key == 'Backspace') {
                for (let i = ligne_active.length - 1; i >= 0; i--) {
                    let cell = ligne_active[i]
                    if (cell.hasAttribute('used')) {
                        cell.innerHTML = ''
                        cell.removeAttribute('used')
                        active_cell.style.borderColor = 'rgb(196, 186, 174)'
                        active_cell.style.boxShadow = 'none'
                        active_cell = ligne_active[i]
                        active_cell.style.borderColor = 'rgb(249, 176, 252)'
                        active_cell.style.boxShadow = '0px 0px 10px 1px rgb(252, 158, 255)'
                        break
                    }
                }
            } else {
                if (event.key == 'Enter') {
                    verification()
                }
            }
        }
    }
}

);


keys.forEach((key) => { // Clic sur une touche
    if (key.id == 'Enter') {
        key.addEventListener("click", (event) => {
            if (keyboard == true) {
                verification()
            }
        });
    } else if (key.id == 'Backspace') {
        key.addEventListener("click", (event) => {
            if (keyboard == true) {
                for (let i = ligne_active.length - 1; i >= 0; i--) {
                    let cell = ligne_active[i]
                    if (cell.hasAttribute('used')) {
                        cell.innerHTML = ''
                        cell.removeAttribute('used')
                        active_cell.style.borderColor = 'rgb(196, 186, 174)'
                        active_cell.style.boxShadow = 'none'
                        active_cell = ligne_active[i]
                        active_cell.style.borderColor = 'rgb(249, 176, 252)'
                        active_cell.style.boxShadow = '0px 0px 10px 1px rgb(252, 158, 255)'
                        break
                    }
                }
            }
        });
    } else {

        key.addEventListener("click", (event) => {
            if (keyboard==true) {
            for (let i = 0; i < ligne_active.length; i++) {
                let cell = ligne_active[i]
                if (!(cell.hasAttribute('used'))) {
                    cell.innerHTML = key.innerHTML
                    cell.setAttribute('used', 'true')
                    active_cell.style.borderColor = 'rgb(196, 186, 174)'
                    active_cell.style.boxShadow = 'none'
                    if (i < 4) {
                        active_cell = ligne_active[i + 1]
                        active_cell.style.borderColor = 'rgb(249, 176, 252)'
                        active_cell.style.boxShadow = '0px 0px 10px 1px rgb(252, 158, 255)'
                    }
                    break
                }
            }
        }
        });
    }
});

if (dif == 'easy') {
    afficherPremereLettre(mot)
    hideLetters()
}

let explain_button1 = document.getElementById('explain_button1')
let span1 = document.getElementById('s_facile')
let explain_button2 = document.getElementById('explain_button2')
let span2 = document.getElementById('s_difficile')

/* Span mode facile */
explain_button1.addEventListener("mouseover", (event) => {
    span1.style.display = 'block'
})

explain_button1.addEventListener("mouseout", (event) => {
    span1.style.display = 'none'
})

/* Span mode difficile */
explain_button2.addEventListener("mouseover", (event) => {
    span2.style.display = 'block'
})

explain_button2.addEventListener("mouseout", (event) => {
    span2.style.display = 'none'
})

if (screen.width < 1500) {
    explain_button1.addEventListener('click', (event) => {
        if (span1.style.display == 'none') {
            span1.style.display = 'block'
        } else {
            span1.style.display = 'none'
        }
    });
    explain_button2.addEventListener('click', (event) => {
        if (span2.style.display == 'none') {
            span2.style.display = 'block'
        } else {
            span2.style.display = 'none'
        }
    });
    document.addEventListener("mousedown", (event) => {
        if (span1.style.display == 'block') {
            span1.style.display = 'none'
        }

        if (span2.style.display == 'block') {
            span2.style.display = 'none'
        }
    })
}

// DEBUG //

// document.addEventListener('dblclick', (event) => {
//     console.log(document.cookie)
// })