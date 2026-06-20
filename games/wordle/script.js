/////////////////////
///// Functions /////
/////////////////////

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getFromStorage(name) {
    return localStorage.getItem(name)
}

function deleteFromStorage(name) {
    localStorage.removeItem(name)
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
    if (active_cell) {
        active_cell.style.borderColor = 'var(--text-color)'
        active_cell.style.boxShadow = 'none'
    }
    active_cell = ligne_active[1]
    active_cell.style.borderColor = 'rgb(249, 176, 252)'
    active_cell.style.boxShadow = '0px 0px 10px 1px rgb(252, 158, 255)'
}

async function reset() {
    /**
     * Réinitialise la grille
     */
    for (let i = 0; i < cells_list.length; i++) {
        let cell = cells_list[i]
        cell.innerHTML = ''
        cell.classList.remove('correct')
        cell.classList.remove('present')
        cell.classList.remove('absent')
        cell.removeAttribute('used')
        cell.removeAttribute('state')
    }

    mot = liste_mots[Math.floor(Math.random() * liste_mots.length)]
    localStorage.setItem('mot', mot)
    mot_l = Array.from(mot.toLowerCase())
    initGrid()
    ligne_active = lignes[0]
    if (active_cell) {
        active_cell.style.borderColor = 'var(--text-color)'
        active_cell.style.boxShadow = 'none'
    }
    active_cell = ligne_active[0]
    active_cell.style.borderColor = 'rgb(249, 176, 252)'
    active_cell.style.boxShadow = '0px 0px 10px 1px rgb(252, 158, 255)'
    mots_utilises = []
    deleteFromStorage('mots_utilises')
    keys.forEach((key) => {
        key.classList.remove('correct')
        key.classList.remove('present')
        key.classList.remove('absent')
        key.removeAttribute('state')
    })
    afficherPremereLettre(mot)
    for (let i = 1; i < 7; i++) {
        if (localStorage.getItem(`ligne${i}`) !== null) {
            deleteFromStorage(`ligne${i}`)
        }
    }
    deleteFromStorage('trouve')

};

async function initGrid() {
    let col = mot.length
    let grid = document.getElementById('grid')
    let gridLines = grid.querySelectorAll('.ligne')

    gridLines.forEach((line) => {
        line.style.gridTemplateColumns = `repeat(${col}, 1fr)`
        Array.from(line.children).forEach((cell) => {
            line.removeChild(cell)
        })
        for (let i = 0; i < col; i++) {
            let cell = document.createElement('div')
            cell.classList.add('cell')
            line.appendChild(cell)
            cell.style.scale = "0"
        }
    })
    grid.style.width = `min(${col * 60}px, 90vw)`
    cells_list = Array.from(document.querySelectorAll('.cell'))
    ligne1 = cells_list.slice(0 * mot.length, 1 * mot.length);
    ligne2 = cells_list.slice(1 * mot.length, 2 * mot.length);
    ligne3 = cells_list.slice(2 * mot.length, 3 * mot.length);
    ligne4 = cells_list.slice(3 * mot.length, 4 * mot.length);
    ligne5 = cells_list.slice(4 * mot.length, 5 * mot.length);
    ligne6 = cells_list.slice(5 * mot.length, 6 * mot.length);
    lignes = [ligne1, ligne2, ligne3, ligne4, ligne5, ligne6];
    for (let c = 0; c < cells_list.length; c++) {
        cells_list[c].animate(
            [{ scale: "0" },
            { scale: "1.15" },
            { scale: "1" }],
            200)
        cells_list[c].style.scale = 1

        await sleep(8)
    }
}

function blurexcept(itemid) {
    let item = document.getElementById(itemid)
    item.style.zIndex = '11'
    blurbox.style.display = "block"
    blurbox.addEventListener("click", (event) => {
        item.style.display = 'none';
        unblur()
    });
    keyboard = false
}

function unblur() {
    blurbox.style.display = 'none'
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
    ], 200)
    banner.style.opacity = 1
    await sleep(duration)
    banner.animate([
        { opacity: 1 },
        { opacity: 0 }
    ], 200)
    banner.style.opacity = 0
    await sleep(200)
    document.body.removeChild(banner)
}

async function verification() {

    if (!ligne_active) {
        summonSimpleBanner(`Le mot était : ${mot.toUpperCase()}`, 2000)
        return
    }

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
        let guess = ""
        ligne_active.forEach((cell) => {
            guess += cell.innerHTML.toLowerCase()
        })

        if (motsProposables.includes(guess)) { // Test si le mot est dans le dictionnaire
            if (!(mots_utilises.includes(guess.toUpperCase()))) {
                // Test si le mot a déjà été utilisé
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
                            { transform: 'rotateX(0deg)', backgroundColor: 'rgb(121, 121, 121)', scale: 1 },
                            { transform: 'rotateX(90deg)', backgroundColor: "var(--correct)", scale: 1.25 },
                            { transform: 'rotateX(0deg)', backgroundColor: "var(--correct)", scale: 1 },
                        ], 300)
                        cell.classList.add('correct')
                        keys.forEach((key) => {
                            if (key.innerHTML.toUpperCase() == cell.innerHTML.toUpperCase()) {
                                key.classList.add('correct')
                                key.setAttribute('state', 'correct')
                            }
                        })
                    } else if (cell.getAttribute('state') == 'present') {
                        cell.animate([
                            { transform: 'rotateX(0deg)', backgroundColor: 'rgb(121, 121, 121)', scale: 1 },
                            { transform: 'rotateX(90deg)', backgroundColor: "var(--present)", scale: 1.25 },
                            { transform: 'rotateX(0deg)', backgroundColor: "var(--present)", scale: 1 },
                        ], 300)
                        cell.classList.add('present')
                        keys.forEach((key) => {
                            if (key.innerHTML.toUpperCase() == cell.innerHTML.toUpperCase()) {
                                if (!key.hasAttribute('state')) {
                                    key.classList.add('present')
                                    key.setAttribute('state', 'present')
                                }
                            }
                        })
                    } else if (cell.getAttribute('state') == 'absent') {
                        cell.animate([
                            { transform: 'rotateX(0deg)', backgroundColor: 'rgb(121, 121, 121)', scale: 1 },
                            { transform: 'rotateX(90deg)', backgroundColor: "var(--absent)", scale: 1.25 },
                            { transform: 'rotateX(0deg)', backgroundColor: "var(--absent)", scale: 1 },
                        ], 300)
                        cell.classList.add('absent')
                        keys.forEach((key) => {
                            if (key.innerHTML.toUpperCase() == cell.innerHTML.toUpperCase()) {
                                if (!key.hasAttribute('state')) {
                                    key.classList.add('absent')
                                }
                            }
                        })
                    }
                    await sleep(100);
                }
                localStorage.setItem(`ligne${lignes.indexOf(ligne_active) + 1}`, guess)
                if (juste == mot.length) {
                    await sleep(500)
                    summonBanner('win_banner', `<b>Vous avez trouvé le mot !</b>`);
                    ligne_active = null
                    trouve = true
                    localStorage.setItem('trouve', true)
                } else {
                    if (lignes.indexOf(ligne_active) < 5) {
                        mots_utilises.push(guess.toUpperCase())
                        localStorage.setItem('mots_utilises', mots_utilises.toString())
                        ligne_active = lignes[lignes.indexOf(ligne_active) + 1]
                        afficherPremereLettre(mot)
                        active_cell.style.borderColor = 'var(--text-color)'
                        active_cell.style.boxShadow = 'none'
                        active_cell = ligne_active[1]
                        active_cell.style.borderColor = 'rgb(249, 176, 252)'
                        active_cell.style.boxShadow = '0px 0px 10px 1px rgb(252, 158, 255)'

                    } else {
                        summonBanner('lose_banner', `<b>Perdu ! Le mot était : <br>${mot.toUpperCase()}</b>`);
                        ligne_active = null
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
        summonSimpleBanner(`Veuillez rentrer un mot de ${mot.length} lettres`, 1000)
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

async function verifRapide(ligne) {
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
    for (let j = 0; j < ligne.length; j++) { // Test si la ligne est complète
        let cell = ligne[j]
        if (!(cell.hasAttribute('used'))) {
            ligne_complete = false
            break
        }
    } if (ligne_complete == true) {
        for (let k = 0; k < ligne.length; k++) { // Test si les lettres sont bien placées
            let cell = ligne[k]
            if (cell.innerHTML.toLowerCase() == mot[k].toLowerCase()) {
                cell.setAttribute('state', 'correct')
                dico_mot[cell.innerHTML.toLowerCase()] -= 1
                juste++
            }
        } ligne.forEach((cell) => { // Test si les lettres sont présentes dans le mot
            if (mot.toLowerCase().includes(cell.innerHTML.toLowerCase()) && dico_mot[cell.innerHTML.toLowerCase()] > 0 && !(cell.hasAttribute('state'))) {
                cell.setAttribute('state', 'present')
                dico_mot[cell.innerHTML.toLowerCase()] -= 1
            }
        });
        for (let n = 0; n < ligne.length; n++) { // Test si les lettres ne sont pas dans le mot
            let cell = ligne[n]
            if ((dico_mot[cell.innerHTML.toLowerCase()] == 0 && !(cell.hasAttribute('state'))) || !(mot.toLowerCase().includes(cell.innerHTML.toLowerCase()))) {
                cell.setAttribute('state', 'absent')
            }
        }
        let colorsheme = {
            correct: 'rgba(15, 129, 0, 1)',
            present: 'rgba(221, 133, 0, 1)',
            absent: 'rgba(80, 80, 80, 1)'
        }
        for (let m = 0; m < ligne.length; m++) { // Changement de couleur des cases
            let cell = ligne[m]
            if (cell.getAttribute('state') == 'correct') {
                cell.classList.add('correct')
                keys.forEach((key) => {
                    if (key.innerHTML.toUpperCase() == cell.innerHTML.toUpperCase()) {
                        key.classList.add('correct')
                        key.setAttribute('state', 'correct')
                    }
                })
            } else if (cell.getAttribute('state') == 'present') {
                cell.classList.add('present')
                keys.forEach((key) => {
                    if (key.innerHTML.toUpperCase() == cell.innerHTML.toUpperCase()) {
                        if (!key.hasAttribute('state')) {
                            key.classList.add('present')
                            key.setAttribute('state', 'present')
                        }
                    }
                })
            } else if (cell.getAttribute('state') == 'absent') {
                cell.classList.add('absent')
                keys.forEach((key) => {
                    if (key.innerHTML.toUpperCase() == cell.innerHTML.toUpperCase()) {
                        if (!key.hasAttribute('state')) {
                            key.classList.add('absent')
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
        localStorage.setItem('theme', 'dark')
    } else {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light')
    }
}

function initKeyboard(disposition) {
    let kb = document.getElementById('keyboard')
    kb.innerHTML = null
    disposition.forEach((keyid) => {
    let key = document.createElement('div')
    key.classList.add('key')
    key.id = keyid
    if ((keyid === "Enter") || (keyid === "Delete")) {
        key.classList.add('wide_key')
        key.innerHTML = `<img src="${keyid.toLowerCase()}.svg" alt="${keyid}">`
    } else {
        key.innerHTML = keyid
    }
    kb.appendChild(key)
    keys.push(key)
})


///// Clavier Virutel /////
keys.forEach((key) => { // Clic sur une touche
    if (key.id == 'Enter') {
        key.addEventListener("click", (event) => {
            if (keyboard == true) {
                verification()
            }
        });
    } else if (key.id == 'Delete') {
        key.addEventListener("click", (event) => {
            if (keyboard == true) {
                for (let i = ligne_active.length - 1; i >= 0; i--) {
                    let cell = ligne_active[i]
                    if (cell.hasAttribute('used')) {
                        cell.innerHTML = ''
                        cell.removeAttribute('used')
                        active_cell.style.borderColor = 'var(--text-color)'
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

        key.addEventListener("click", () => {
            if (keyboard == true) {
                for (let i = 0; i < ligne_active.length; i++) {
                    let cell = ligne_active[i]
                    if (!(cell.hasAttribute('used'))) {
                        cell.innerHTML = key.innerHTML
                        cell.setAttribute('used', 'true')
                        active_cell.style.borderColor = 'var(--text-color)'
                        active_cell.style.boxShadow = 'none'
                        if (i < ligne_active.length - 1) {
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
lignes.forEach((ligne) => {
    verifRapide(ligne)
})
};

////////////////////////////
///// Gestion du theme /////
////////////////////////////

let themeToggle = document.querySelector('.theme-toggle input');

themeToggle.addEventListener('change', () => {
    toggleTheme();
});

if (getFromStorage('theme') === 'light') {
    document.documentElement.classList.remove('dark-mode');
    themeToggle.checked = false;
} else {
    document.documentElement.classList.add('dark-mode');
    themeToggle.checked = true;
}

////////////////////////////////
///// Gestion des couleurs /////
////////////////////////////////

const colorshemes = [
    {
        correct: 'rgba(15, 129, 0, 1)',
        present: 'rgba(221, 133, 0, 1)',
        absent: 'rgba(80, 80, 80, 1)'
    },
    {
        correct: 'rgb(255, 0, 0)',
        present: '#FFBD00',
        absent: 'rgba(80, 80, 80, 1)'
    },
    {
        correct: 'rgb(255, 151, 246)',
        present: 'rgb(76, 219, 255)',
        absent: 'rgba(80, 80, 80, 1)'
    }
]
const selector = document.getElementById('scheme_selector');

selector.addEventListener('change', (event) => {
    colorsheme = colorshemes[selector.value]
    localStorage.setItem('colorsheme', selector.value)
    let root = document.documentElement;
    root.style.setProperty('--correct', colorsheme['correct']);
    root.style.setProperty('--present', colorsheme['present']);
    root.style.setProperty('--absent', colorsheme['absent']);
})

if (localStorage.getItem('colorsheme') !== null) {
    selector.value = getFromStorage('colorsheme')
    colorsheme = colorshemes[selector.value]
    let root = document.documentElement;
    root.style.setProperty('--correct', colorsheme['correct']);
    root.style.setProperty('--present', colorsheme['present']);
    root.style.setProperty('--absent', colorsheme['absent']);
} else {
    selector.value = 0
    localStorage.setItem('colorscheme', selector.value)
    colorsheme = colorshemes[0]
    let root = document.documentElement;
    root.style.setProperty('--correct', colorsheme['correct']);
    root.style.setProperty('--present', colorsheme['present']);
    root.style.setProperty('--absent', colorsheme['absent']);
}

////////////////////////////
///// Rules & Settings /////
////////////////////////////

const rules_button = document.getElementById('rules_button')
const settings_button = document.getElementById('settings_button')
const r_blur = document.getElementById('rules_blur')
const s_blur = document.getElementById('settings_blur')

rules_button.checked = false
settings_button.checked = false

rules_button.addEventListener(("change"), () => {
    if (settings_button.checked) {
        settings_button.checked = false
    }
    if (rules_button.checked) {
        r_blur.style.display = 'block'
    } else {
        r_blur.style.display = 'none'
    }
})

settings_button.addEventListener(('change'), () => {
    if (rules_button.checked) {
        rules_button.checked = false
    }
    if (settings_button.checked) {
        s_blur.style.display = 'block'
    } else {
        s_blur.style.display = 'none'
    }
})

//////////////////////
///// Difficulty /////
//////////////////////

let liste_mots = []
let dif_button = document.getElementById('difficulty')

if (!getFromStorage('difficulty') !== null) {
    localStorage.setItem('difficulty', 'hard')
    dif = 'hard'
} else {
    dif = getFromStorage('difficulty')
}
if (dif == 'easy') {
    dif_button.checked = false
    liste_mots = motsFrequents.filter((mot) => 5 <= mot.length && mot.length <= 6)
} else {
    dif_button.checked = true
    liste_mots = motsFrequents.filter((mot) => 7 <= mot.length && mot.length <= 9)
}
dif_button.addEventListener("click", (event) => {
    if (dif == 'easy') {
        dif = 'hard'
        dif_button.checked = true
        liste_mots = motsFrequents.filter((mot) => 7 <= mot.length && mot.length <= 9)
        localStorage.setItem('difficulty', 'hard')
        reset()
    } else {
        dif = 'easy'
        dif_button.checked = false
        liste_mots = motsFrequents.filter((mot) => 5 <= mot.length && mot.length <= 6)
        localStorage.setItem('difficulty', 'easy')
        reset()
    }
})

///////////////
///// Mot /////
///////////////

let motsProposables = listeMots

let mot = ''
if (getFromStorage('mot') == null) {
    mot = liste_mots[Math.floor(Math.random() * liste_mots.length)]
    localStorage.setItem('mot', mot)
} else {
    mot = getFromStorage('mot')
}

let mot_l = Array.from(mot.toLowerCase())

///////////////
///// Jeu /////
///////////////

const blurbox = document.createElement('div')
document.body.appendChild(blurbox)
blurbox.style.width = '100vw'
blurbox.style.height = '100vh'
blurbox.style.position = 'fixed'
blurbox.style.top = '0'
blurbox.style.left = '0'
blurbox.style.zIndex = '10'
blurbox.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'
blurbox.style.backdropFilter = 'blur(10px)'
blurbox.style.display = 'none'

let trouve = false
let ligne1 = []
let ligne2 = []
let ligne3 = []
let ligne4 = []
let ligne5 = []
let ligne6 = []
let cells_list = []
let lignes = []
initGrid()

let car_possibles = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
let keys = []
keyboard = true

let ligne_active = lignes[0] // ligne active

let mots_utilises = [] // Mots déjà testés

if (localStorage.getItem('mots_utilises') !== null) {
    mots_utilises = getFromStorage('mots_utilises').split(',')
}

///////////////////////
///// Disposition /////
///////////////////////

const dispoSelector = document.getElementById('dispo_selector')
const dispositions = {
    "Default" : ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P",
                "Q", "S", "D", "F", "G", "H", "J", "K", "L", "M",
                "Enter", "W", "X", "C", "V", "B", "N", "Delete"],
    "Inverse" : ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P",
                "Q", "S", "D", "F", "G", "H", "J", "K", "L", "M",
                "Delete", "W", "X", "C", "V", "B", "N", "Enter"],
    "Droite" : ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P",
                "Q", "S", "D", "F", "G", "H", "J", "K", "L", "M",
                "W", "X", "C", "V", "B", "N", "Delete", "Enter"]
}
let disposition = dispositions["Default"] 

if (getFromStorage('disposition') !== null) {
    dispoSelector.value = getFromStorage('disposition')
    disposition = dispositions[dispoSelector.value]
} else {
    dispoSelector.value = "Default"
    disposition = dispositions["Default"]
}

dispoSelector.addEventListener(("change"), () => {
    disposition = dispositions[dispoSelector.value]
    localStorage.setItem('disposition', dispoSelector.value)
    initKeyboard(disposition)
})

initKeyboard(disposition)

//////////////////////////////////
///// Restoration des lignes /////
//////////////////////////////////

for (let i = 0; i < 6; i++) {
    if (localStorage.getItem('ligne' + (i + 1))) {
        let ligne = lignes[i]
        let cookie_ligne = getFromStorage('ligne' + (i + 1))
        ligne.forEach((cell, j) => {
            cell.innerHTML = cookie_ligne[j].toUpperCase()
            cell.setAttribute('used', 'true')
        })
        verifRapide(ligne_active)
        if (i < 6) {
            ligne_active = lignes[i+1]
        } else {
            ligne_active = null
        }
    }
};
if (localStorage.getItem('trouve') !== null) {
    trouve = true
}
if (trouve) {
    ligne_active = null
}

active_cell = null

if (ligne_active) {
    let active_cell = ligne_active[1] // Cellule active
    active_cell.style.borderColor = 'rgb(249, 176, 252)'
    active_cell.style.boxShadow = '0px 0px 10px 1px rgb(252, 158, 255)'
    afficherPremereLettre(mot)
}

//////////////////////
///// Événements /////
//////////////////////

///// Clavier Réel /////
document.addEventListener("keydown", (event) => {
    if (keyboard == true) {
        if (car_possibles.includes(event.key.toUpperCase())) {
            for (let i = 0; i < ligne_active.length; i++) {
                let cell = ligne_active[i]
                if (!(cell.hasAttribute('used'))) {
                    cell.innerHTML = event.key.toUpperCase()
                    cell.setAttribute('used', 'true')
                    active_cell.style.borderColor = 'var(--text-color)'
                    active_cell.style.boxShadow = 'none'
                    if (i < ligne_active.length - 1) {
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
                        active_cell.style.borderColor = 'var(--text-color)'
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

const reset_button = document.getElementById('resButton')
reset_button.addEventListener("click", (event) => {
    reset()
})

/////////////////
///// DEBUG /////
/////////////////

// document.addEventListener('dblclick', (event) => {
//     console.log(keyboard)
// })