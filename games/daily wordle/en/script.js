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
    en_mots_utilises = []
    deleteFromStorage('en_mots_utilises')
    keys.forEach((key) => {
        key.classList.remove('correct')
        key.classList.remove('present')
        key.classList.remove('absent')
        key.removeAttribute('state')
    })
    afficherPremereLettre(mot)
    for (let i = 1; i < 7; i++) {
        if (localStorage.getItem(`en_ligne${i}`) !== null) {
            deleteFromStorage(`en_ligne${i}`)
        }
    }
    localStorage.setItem('en_trouve', 'false')
    lettres_trouvees = []
    mot_l.forEach(() => {
        lettres_trouvees.push(' ')
    })

    lettres_trouvees[0] = mot_l[0].toUpperCase()

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
    grid.style.width = `min(${col * 70}px, 90dvw)`
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

function summonRecapBanner(mot, texte, stats) {
    keyboard = false
    recap_blur = document.createElement("div")
    recap_blur.classList.add("blurbox")
    document.body.appendChild(recap_blur)
    recap_blur.style.display = "block"
    recap_banner = document.createElement("div")
    recap_banner.classList.add("RecapBanner")
    document.body.appendChild(recap_banner)
    vic_section = document.createElement("section")
    recap_banner.appendChild(vic_section)
    recap_section = document.createElement("section")
    recap_banner.appendChild(recap_section)
    buttons_section = document.createElement("section")
    buttons_section.classList.add("buttons_section")
    recap_banner.appendChild(buttons_section)
    recap_blur.addEventListener("click", () => {
        document.body.removeChild(recap_blur)
        document.body.removeChild(recap_banner)
        clearInterval(time_update)
        keyboard = true
    })
    recap_row = document.createElement("div")
    recap_row.classList.add("recap_row")
    timer = document.createElement('div')
    timer.classList.add("timer")
    //-----------------------------------------
    vic_section.innerHTML = `<h3>${texte}</h3>`
    stats.forEach((stat) => {
        cadre = document.createElement('div')
        cadre.classList.add("statframe")
        cadre.style.setProperty("--stat_title", `"${stat[0]}"`)
        cadre.style.setProperty("--stat", `"${stat[1]}"`)
        recap_row.appendChild(cadre)

    })
    recap_section.appendChild(recap_row)
    if (getFromStorage('en_trouve') == 'true' || getFromStorage('en_ligne6') != null) {
        recap = ""
        lignes.forEach(ligne => {
            if (ligne[0].getAttribute('state') != null) {
                ligne.forEach(cell => {
                    if (cell.getAttribute('state') == 'correct') {
                        recap += '🟩'
                    } else if (cell.getAttribute('state') == 'present') {
                        recap += '🟨'
                    } else if (cell.getAttribute('state') == 'absent') {
                        recap += '⬛'
                    }
                })
                recap += "<br>"
            }
        })
        let game_recap = document.createElement('p')
        game_recap.innerHTML = recap
        game_recap.style.fontSize = '0.9em'
        recap_section.appendChild(game_recap)

        let word_reveal = document.createElement("p")
        word_reveal.style.fontSize = '0.9em'
        word_reveal.innerHTML = `The word was <br><b>${mot.toUpperCase()}</b>`
        recap_section.appendChild(word_reveal)

        def_button = document.createElement('button')
        def_button.innerHTML = `<img src="book.svg" alt="dictionary"><b>Definition</b>`
        buttons_section.appendChild(def_button)
        def_button.addEventListener("click", () => {
            window.open(`https://dictionary.cambridge.org/dictionary/english/${mot}`)
        })

        copy_button = document.createElement('button')
        copy_button.innerHTML = `<img src="clipboard.png" alt="clipboard"><b>Share</b>`
        copy_button.id = 'copy_button'
        buttons_section.appendChild(copy_button)
        copy_button.addEventListener('click', () => {
            let date = new Date()
            recap = ""
        lignes.forEach(ligne => {
            if (ligne[0].getAttribute('state') != null) {
                ligne.forEach(cell => {
                    if (cell.getAttribute('state') == 'correct') {
                        recap += '🟩'
                    } else if (cell.getAttribute('state') == 'present') {
                        recap += '🟨'
                    } else if (cell.getAttribute('state') == 'absent') {
                        recap += '⬛'
                    }
                })
                recap += "\n"
            }
        })
            navigator.clipboard.writeText(`Leuhan's Wordle | ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} | EN\n\n${recap}\nhttps://wordle.leuhan.dev/en`)
            summonSimpleBanner('Copied !', 1000)
        })
    }

    // Statistiques graphiques
        let recap_graph = document.createElement('div')
        recap_graph.classList.add('stat_graph')
        recap_section.appendChild(recap_graph)
        stat_max = Math.max(...graph_stats)
        for (let s = 0 ; s < graph_stats.length ; s++) {
            let stat = graph_stats[s]
            let stat_row = document.createElement('stat_row')
            let stat_bar = document.createElement('stat_bar')
            let num = document.createElement('p')
            if (s+1 != 7) {
            num.innerHTML = `<b>${s+1}</b>`
            } else {
                num.innerHTML = "💀"
            }
            stat_bar.style.setProperty('--bar_length', `${(stat/stat_max)*100}px`)
            stat_bar.style.setProperty('--stat_value', `"${stat}"`)
            stat_row.appendChild(stat_bar)
            stat_row.appendChild(num)
            recap_graph.appendChild(stat_row)
        }

    recap_banner.appendChild(timer)
    update_time()
    const time_update = setInterval(update_time, 1000)
}

function update_time() {
    let time = 0
    let now = new Date()
    let tommorow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

    let time_left = tommorow.getTime() - now.getTime()
    const totalSeconds = Math.floor(time_left / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    time = String(hours).padStart(2, '0') + ':' +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0');
    timer.innerHTML = time
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
        if (getFromStorage('en_trouve') == 'true') {
            summonRecapBanner(mot, "You Won !", [["Games", en_cherches], ["Wins", en_n_trouves], ["Wins (%)", `${Math.floor((en_n_trouves / Math.max(en_cherches, 1)) * 100)}`]])
        } else {
            summonRecapBanner(mot, "You Lost !", [["Games", en_cherches], ["Wins", en_n_trouves], ["Wins (%)", `${Math.floor((en_n_trouves / Math.max(en_cherches, 1)) * 100)}`]])
        }
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
            if (!(en_mots_utilises.includes(guess.toUpperCase()))) { // Test si le mot a déjà été utilisé
                for (let k = 0; k < ligne_active.length; k++) { // Test si les lettres sont bien placées
                    let cell = ligne_active[k]
                    if (cell.innerHTML.toLowerCase() == mot[k].toLowerCase()) {
                        cell.setAttribute('state', 'correct')
                        dico_mot[cell.innerHTML.toLowerCase()] -= 1
                        juste++
                        lettres_trouvees[k] = cell.innerHTML.toUpperCase()
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
                localStorage.setItem(`en_ligne${lignes.indexOf(ligne_active) + 1}`, guess)
                if (juste == mot.length) {
                    await sleep(500)
                    localStorage.setItem('en_trouve', 'true')
                    en_n_trouves += 1
                    localStorage.setItem('en_cherches', en_cherches)
                    localStorage.setItem('en_n_trouves', en_n_trouves)
                    // Graphique Statistiques
                    n_l =  lignes.indexOf(ligne_active)+1
                    graph_stats[lignes.indexOf(ligne_active)]++
                    localStorage.setItem(`en_l${n_l}`, Number(getFromStorage(`en_l${n_l}`)+1))
                    summonRecapBanner(mot, "You Won !", [["Games", en_cherches], ["Wins", en_n_trouves], ["Wins (%)", `${Math.floor((en_n_trouves / Math.max(en_cherches, 1)) * 100)}%`]])
                    ligne_active = null

                } else {
                    if (lignes.indexOf(ligne_active) < 5) {
                        en_mots_utilises.push(guess.toUpperCase())
                        localStorage.setItem('en_mots_utilises', en_mots_utilises.toString())
                        ligne_active = lignes[lignes.indexOf(ligne_active) + 1]
                        afficherPremereLettre(mot)
                        active_cell.style.borderColor = 'var(--text-color)'
                        active_cell.style.boxShadow = 'none'
                        active_cell = ligne_active[1]
                        active_cell.style.borderColor = 'rgb(249, 176, 252)'
                        active_cell.style.boxShadow = '0px 0px 10px 1px rgb(252, 158, 255)'

                    } else {
                        localStorage.setItem('en_cherches', en_cherches)
                        graph_stats[6]++
                        localStorage.setItem('fr_defaites', Number(getFromStorage(`fr_defaites`)+1))
                        summonRecapBanner(mot, "You Lost !", [["Parties", en_cherches], ["Victoires", en_n_trouves], ["en_taux", `${Math.floor((en_n_trouves / Math.max(en_cherches, 1)) * 100)}%`]])
                        ligne_active = null
                    }
                }
                if (getFromStorage('en_trouve') == "false" && ligne_active) {
                    overlay(ligne_active)
                }
            } else {
                summonSimpleBanner('You already tried this word', 1000)
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
            summonSimpleBanner("This word is not in our dictionary", 1000)
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
        summonSimpleBanner(`This word is too short`, 1000)
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
                lettres_trouvees[k] = cell.innerHTML.toUpperCase()
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

async function initKeyboard(disposition) {
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
    keys.forEach((key) => {
        if (key.id == 'Enter') {
            key.addEventListener("click", () => {
                if (keyboard == true) {
                    verification()
                }
            });
        } else if (key.id == 'Delete') {
            key.addEventListener("click", () => {
                if (keyboard == true) {
                    if (ligne_active) {
                        for (let i = ligne_active.length - 1; i >= 0; i--) {
                            let cell = ligne_active[i]
                            if (cell.hasAttribute('used')) {
                                if (lettres_trouvees[ligne_active.indexOf(cell)] !== ' ') {
                                    cell.style.setProperty('--overlay', `"${lettres_trouvees[ligne_active.indexOf(cell)]}"`)
                                }
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
                }
            });
        } else {

            key.addEventListener("click", () => {
                if (keyboard == true) {
                    if (ligne_active) {
                        for (let i = 0; i < ligne_active.length; i++) {
                            let cell = ligne_active[i]
                            if (!(cell.hasAttribute('used'))) {
                                cell.style.setProperty('--overlay', '""')
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
                }
            });
        }
    });

    for (let i = 0; i < 6; i++) {
        if (getFromStorage('en_ligne' + (i + 1)) !== null) {
            let ligne = lignes[i]
            verifRapide(ligne)
        }
    }
};

function overlay(ligne) {
    ligne_overlay = []
    ligne.forEach((cell) => {
        cell.style.setProperty('--overlay', `"${lettres_trouvees[ligne.indexOf(cell)]}"`)
    })
}

////////////////////////////
///// Gestion du theme /////
////////////////////////////

// let themeToggle = document.querySelector('.theme-toggle input');

// themeToggle.addEventListener('change', () => {
//     toggleTheme();
// });

// if (getFromStorage('theme') === 'light') {
//     document.documentElement.classList.remove('dark-mode');
//     themeToggle.checked = false;
// } else {
//     document.documentElement.classList.add('dark-mode');
//     themeToggle.checked = true;
// }

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
    }
]
const selector = document.getElementById('scheme_selector');

selector.addEventListener('change', (event) => {
    let colorsheme = colorshemes[selector.value]
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
        s_blur.style.display = 'none'
    }
    if (rules_button.checked) {
        r_blur.style.display = 'block'
        keyboard = false
    } else {
        r_blur.style.display = 'none'
        keyboard = true
    }
})

settings_button.addEventListener(('change'), () => {
    if (rules_button.checked) {
        rules_button.checked = false
        r_blur.style.display = 'none'
    }
    if (settings_button.checked) {
        s_blur.style.display = 'block'
        keyboard = false
    } else {
        s_blur.style.display = 'none'
        keyboard = true
    }
})

const stat_button = document.getElementById('stat_button')
stat_button.addEventListener('click', () => {
    summonRecapBanner(mot, "Statistiques", [["Games", en_cherches], ["Wins", en_n_trouves], ["Wins (%)", `${Math.floor((en_n_trouves / Math.max(en_cherches, 1)) * 100)}`]])
})

const lang_button = document.getElementById('lang_button')
const lang_sel = document.getElementById('language_selection')
lang_button.addEventListener('mouseup', async () => {
    if (lang_sel.style.display != 'flex') {
        lang_sel.style.display = 'flex'
        await sleep(10)
    document.addEventListener('click', () => {
        lang_sel.style.display = 'none'
    }, { once : true })
    } else {
        lang_sel.style.display = 'none'
    }
    
})


///////////////
///// Mot /////
///////////////

let liste_mots = motsFrequents
let cells_list = []
let motsProposables = listeMots
let mot = ''

if (getFromStorage("en_mot") != null) {
    mot = getFromStorage("en_mot")
} else {
    mot = "emmetrope"
}

let mot_l = Array.from(mot.toLowerCase())
let lettres_trouvees = []
mot_l.forEach((lettre) => {
    lettres_trouvees.push(' ')
})

lettres_trouvees[0] = mot_l[0].toUpperCase()

///////////////
///// Jeu /////
///////////////

const blurbox = document.createElement('div')
document.body.appendChild(blurbox)
blurbox.style.width = '100dvw'
blurbox.style.height = '100dvh'
blurbox.style.position = 'fixed'
blurbox.style.top = '0'
blurbox.style.left = '0'
blurbox.style.zIndex = '3'
blurbox.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'
blurbox.style.backdropFilter = 'blur(10px)'
blurbox.style.display = 'none'

let ligne1 = []
let ligne2 = []
let ligne3 = []
let ligne4 = []
let ligne5 = []
let ligne6 = []
let lignes = []
initGrid()

let car_possibles = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
let keys = []
keyboard = true

let ligne_active = lignes[0] // ligne active

let en_mots_utilises = [] // Mots déjà testés

if (localStorage.getItem('en_mots_utilises') !== null) {
    en_mots_utilises = getFromStorage('en_mots_utilises').split(',')
}

///////////////////////
///// Disposition /////
///////////////////////

const dispoSelector = document.getElementById('dispo_selector')
const dispositions = {
    "Default": ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P",
        "Q", "S", "D", "F", "G", "H", "J", "K", "L", "M",
        "Enter", "W", "X", "C", "V", "B", "N", "Delete"],
    "Inverse": ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P",
        "Q", "S", "D", "F", "G", "H", "J", "K", "L", "M",
        "Delete", "W", "X", "C", "V", "B", "N", "Enter"],
    "Droite": ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P",
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
    if (localStorage.getItem('en_ligne' + (i + 1))) {
        let ligne = lignes[i]
        let cookie_ligne = getFromStorage('en_ligne' + (i + 1))
        ligne.forEach((cell, j) => {
            cell.innerHTML = cookie_ligne[j].toUpperCase()
            cell.setAttribute('used', 'true')
        })
        verifRapide(ligne_active)
        if (i < 6) {
            ligne_active = lignes[i + 1]
        } else {
            ligne_active = null
        }
    }
}

if (getFromStorage('en_trouve') == 'true') {
    ligne_active = null
}

if (ligne_active) {
    overlay(ligne_active)
}

let active_cell = null

if (ligne_active) {
    active_cell = ligne_active[1] // Cellule active
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
            if (ligne_active) {
                for (let i = 0; i < ligne_active.length; i++) {
                    let cell = ligne_active[i]
                    if (!(cell.hasAttribute('used'))) {
                        cell.style.setProperty('--overlay', '""')
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
            }
        } else {
            if (event.key == 'Backspace') {
                if (ligne_active) {
                    for (let i = ligne_active.length - 1; i >= 0; i--) {
                        let cell = ligne_active[i]
                        if (cell.hasAttribute('used')) {
                            if (lettres_trouvees[ligne_active.indexOf(cell)] !== ' ') {
                                cell.style.setProperty('--overlay', `"${lettres_trouvees[ligne_active.indexOf(cell)]}"`)
                            }
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
            } else {
                if (event.key == 'Enter') {
                    verification()
                }
            }
        }
    }
}

);

let time = "00:00:00"

let en_n_trouves = 0
let en_cherches = 0
let en_taux = 0

// Statistiques Graphiques
let en_l1 = 0
let en_l2 = 0
let en_l3 = 0
let en_l4 = 0
let en_l5 = 0
let en_l6 = 0
let en_defaites = 0

if (getFromStorage('en_n_trouves') != null) {
    en_n_trouves = Number(getFromStorage('en_n_trouves'))
} else {
    en_n_trouves = 0
    localStorage.setItem('en_n_trouves', 0)
}

if (getFromStorage("en_cherches") != null) {
    en_cherches = Number(getFromStorage('en_cherches'))
} else {
    en_cherches = 0
    localStorage.setItem("en_cherchess", en_cherches)
}

if (getFromStorage('en_taux') != null) {
    en_taux = Number(getFromStorage("en_taux"))
} else {
    en_taux = 0
    localStorage.setItem('en_taux', en_taux)
}

// Statistiques Graphiques
if (getFromStorage('en_l1') != null) {
    en_l1 = getFromStorage('en_l1')
} else {
    en_l1 = 0
    localStorage.setItem('en_l1', 0)
}
if (getFromStorage('en_l2') != null) {
    en_l2 = getFromStorage('en_l2')
} else {
    en_l2 = 0
    localStorage.setItem('en_l2', 0)
}
if (getFromStorage('en_l3') != null) {
    en_l3 = getFromStorage('en_l3')
} else {
    en_l3 = 0
    localStorage.setItem('en_l3', 0)
}
if (getFromStorage('en_l4') != null) {
    en_l4 = getFromStorage('en_l4')
} else {
    en_l4 = 0
    localStorage.setItem('en_l4', 0)
}
if (getFromStorage('en_l5') != null) {
    en_l5 = getFromStorage('en_l5')
} else {
    en_l5 = 0
    localStorage.setItem('en_l5', 0)
}
if (getFromStorage('en_l6') != null) {
    en_l6 = getFromStorage('en_l6')
} else {
    en_l6 = 0
    localStorage.setItem('en_l6', 0)
}
if (getFromStorage('en_defaites') != null) {
    en_defaites = getFromStorage('en_defaites')
} else {
    en_defaites = 0
    localStorage.setItem('en_defaites', 0)
}

const graph_stats = [en_l1, en_l2, en_l3, en_l4, en_l5, en_l6, en_defaites]


function reset_stats() {
    en_n_trouves = 0
    localStorage.setItem('en_n_trouves', en_n_trouves)
    en_cherches = 0
    localStorage.setItem('en_cherches', en_cherches)
    en_taux = 0
    localStorage.setItem('en_taux', en_taux)
    console.log(en_n_trouves, en_cherches, en_taux, essais)
}

//////////////////////////////
///// Changement de Date /////
//////////////////////////////

let date = new Date()
let numero_mot = date.getDate() + date.getMonth() * 31
let liste_annee = []
let annee = date.getFullYear()

for (let i = 0; i < 403; i++) {
    let ecart = Math.floor((-annee) ** 4)
    j = (ecart + ecart * i) % liste_mots.length
    liste_annee.push(liste_mots[j])
}

let nouveau_mot = liste_annee[numero_mot]

if (getFromStorage('en_mot') !== nouveau_mot) {
    mot = nouveau_mot
    localStorage.setItem('en_mot', mot)
    reset()
    en_cherches += 1
    localStorage.setItem('en_cherches', en_cherches)
}

/////////////////
///// DEBUG /////
/////////////////

// document.addEventListener('dblclick', (event) => {
//     reset()
// })