import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
const ListaGrafica = {
    $primogiorno: null,
    $primomese: null,
    $primoanno: null,
    $title: null,
    $container_login: null,
    $superior_bar: null,
    $login: null,
    $loginUsername: null,
    $loginPassword: null,
    $loginButton: null,
    $register: null,
    $registerUsername: null,
    $registerPassword: null,
    $registerRuolo: null,
    $ruolo: null,
    $registerButton: null,
    $attivita: null,
    $attivita_scelte: null,
    $buttonAttivita: null,
    $registerError: null,
    $registerErrorVuoti: null,
    $registerErrorPresente: null,
    $registerErrorAdmin: null,
    $attivita_error: null,
    $prezzo: null,
    $prezzo_h1: null,
    $prezzoButton: null,
    $prezzoTermini: null,
    $prezzoErrore: null,
    $container_principale: null,
    $prenotazione: null,
    $newLesson: null,
    $prenotazioneAdmin: null,
    $loginError: null,
    $loginErrorVuoto: null,
    $loginErrorCorretto: null,
    $iconLogin: null,
    $iconRegister: null,
    $calendario: false,
    $selectedday: null,
    $currentDay: null,
    $prenotazionepersonal: null,
    init: function () {
        this.$title = document.querySelector(".title");
        this.$iconRegister = document.querySelector(".container-login>.bordo>.registrati>.password>.icon");
        this.$iconLogin = document.querySelector(".container-login>.bordo>.login>.password>.icon");
        this.$loginError = document.querySelector(".container-login>.bordo>.login>.errore");
        this.$loginErrorVuoto = document.querySelector(".container-login>.bordo>.login>.errore>.errore_vuoto");
        this.$loginErrorCorretto = document.querySelector(".container-login>.bordo>.login>.errore>.errore_noncorretti");
        this.$prezzoErrore = document.querySelector(".container-login>.bordo>.prezzo>.errore");
        this.$prezzoTermini = document.querySelector(".container-login>.bordo>.prezzo input");
        this.$prezzo = document.querySelector(".container-login>.bordo>.prezzo");
        this.$prezzo_h1 = document.querySelector(".container-login>.bordo>.prezzo>h1");
        this.$prezzoButton = document.querySelector(".container-login>.bordo>.prezzo>button");
        this.$attivita_error = document.querySelector(".container-login>.bordo>.attivita> .errore");
        this.$registerError = document.querySelector(".container-login>.bordo>.registrati>.errore");
        this.$registerErrorVuoti = document.querySelector(".container-login>.bordo>.registrati>.errore>.errore_vuoti");
        this.$registerErrorPresente = document.querySelector(".container-login>.bordo>.registrati>.errore>.errore_presente");
        this.$registerErrorAdmin = document.querySelector(".container-login>.bordo>.registrati>.errore>.errore_admin");
        this.$attivita = document.querySelector(".container-login>.bordo>.attivita");
        this.$buttonAttivita = document.querySelector(".container-login>.bordo>.attivita>button");
        this.$attivita_scelte = document.querySelectorAll(".container-login>.bordo>.attivita .attivita_input");
        this.$container_login = document.querySelector(".container-login");
        this.$superior_bar = document.querySelectorAll(".container-login>.bordo>.superior_bar>h1");
        this.$login = document.querySelector(".container-login>.bordo>.login");
        this.$register = document.querySelector(".container-login>.bordo>.registrati");
        this.$loginUsername = document.querySelector(".container-login>.bordo>.login .username_input");
        this.$loginPassword = document.querySelector(".container-login>.bordo>.login .password_input");
        this.$loginButton = document.querySelector(".container-login>.bordo>.login>button");
        this.$registerUsername = document.querySelector(".container-login>.bordo>.registrati .username_input");
        this.$registerPassword = document.querySelector(".container-login>.bordo>.registrati .password_input");
        this.$registerRuolo = document.querySelector(".container-login>.bordo>.registrati .ruolo_input");
        this.$registerButton = document.querySelector(".container-login>.bordo>.registrati>button");
        for (const elem of this.$superior_bar) {
            elem.addEventListener("click", () => {
                this._filter(elem);
            })
        }
        this.$registerButton.addEventListener("click", () => {
            if (this.$registerUsername.value != "" && this.$registerPassword.value != "" && this.$registerRuolo.value != "") {
                this.$ruolo = this.$registerRuolo.value;
                if (this.$ruolo === "admin") {


                    fetch("/registrati", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: this.$registerUsername.value,
                            password: this.$registerPassword.value,
                            ruolo: this.$ruolo,
                        })
                    }).then(res => res.json()).then(data => {
                        if (data.success) {
                            this._createSocket(this.$registerUsername.value);
                            this._createPage(this.$registerUsername.value);
                        }
                        else {
                            this.$registerError.classList.remove("no-focus");
                            this.$registerErrorAdmin.classList.add("no-focus");
                            this.$registerErrorPresente.classList.remove("no-focus");
                            this.$registerErrorVuoti.classList.add("no-focus");
                        }
                    })
                }
                else {
                    this.$register.classList.add("no-focus");
                    this.$register.classList.remove("flex");
                    this.$attivita.classList.remove("no-focus");
                    this.$attivita.classList.add("flex");
                    for (const elem of this.$attivita_scelte) {
                        elem.addEventListener("change", () => {
                            if (elem.checked && elem.value === "tutto") {
                                for (const elem2 of this.$attivita_scelte) {
                                    if (elem2.value != "tutto") {
                                        elem2.checked = false;
                                    }
                                }
                            }
                            else {
                                for (const elem2 of this.$attivita_scelte) {
                                    if (elem2.value === "tutto") {
                                        elem2.checked = false;
                                    }
                                }
                            }
                        })
                    }
                    this.$buttonAttivita.addEventListener("click", () => {
                        const att_scelte = [];
                        for (const elem of this.$attivita_scelte) {
                            if (elem.checked) {
                                att_scelte.push(elem.value);
                            }
                        }
                        if (att_scelte.length != 0) {
                            if (this.$ruolo === "personal trainer") {
                                fetch("/registrati", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        username: this.$registerUsername.value,
                                        password: this.$registerPassword.value,
                                        ruolo: this.$ruolo,
                                        attivita: att_scelte,
                                    })
                                }).then(res => res.json()).then(data => {
                                    if (data.success) {
                                        this._createSocket(this.$registerUsername.value);
                                        this._createPage(this.$registerUsername.value);
                                    }
                                    else {
                                        this.$registerError.classList.remove("no-focus");
                                        this.$registerErrorAdmin.classList.add("no-focus");
                                        this.$registerErrorPresente.classList.remove("no-focus");
                                        this.$registerErrorVuoti.classList.add("no-focus");
                                        this.$attivita.classList.add("no-focus");
                                        this.$attivita.classList.remove("flex");
                                        this.$register.classList.add("flex");
                                        this.$register.classList.remove("no-focus");
                                        this.$registerUsername.value = "";
                                        this.$registerPassword.value = "";
                                        this.$registerRuolo.value = "";
                                        for (const elem of this.$attivita_scelte) {
                                            elem.checked = false;
                                        }
                                    }
                                })

                            }
                            else {
                                fetch("/prezzo", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        attivita: att_scelte,
                                    })
                                }).then(res => res.json()).then(data => {
                                    this.$attivita.classList.remove("flex");
                                    this.$attivita.classList.add("no-focus");
                                    this.$prezzo_h1.innerHTML = `€${data.prezzo}/mese`
                                    this.$prezzo.classList.remove("no-focus");
                                    this.$prezzo.classList.add("flex");
                                    this.$prezzoButton.addEventListener("click", () => {
                                        if (this.$prezzoTermini.checked) {
                                            fetch("/registrati", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    username: this.$registerUsername.value,
                                                    password: this.$registerPassword.value,
                                                    ruolo: this.$ruolo,
                                                    attivita: att_scelte,
                                                })
                                            }).then(res => res.json()).then(data => {
                                                if (data.success) {
                                                    this._createSocket(this.$registerUsername.value);
                                                    this._createPage(this.$registerUsername.value);
                                                }
                                                else {
                                                    this.$registerError.classList.remove("no-focus");
                                                    this.$registerErrorAdmin.classList.add("no-focus");
                                                    this.$registerErrorPresente.classList.remove("no-focus");
                                                    this.$registerErrorVuoti.classList.add("no-focus");
                                                    this.$prezzo.classList.add("no-focus");
                                                    this.$prezzo.classList.remove("flex");
                                                    this.$register.classList.add("flex");
                                                    this.$register.classList.remove("no-focus");
                                                    this.$registerUsername.value = "";
                                                    this.$registerPassword.value = "";
                                                    this.$registerRuolo.value = "";
                                                    for (const elem of this.$attivita_scelte) {
                                                        elem.checked = false;
                                                    }
                                                    this.$prezzoTermini.checked = false;
                                                }
                                            })
                                        }
                                        else {
                                            this.$prezzoErrore.classList.remove("no-focus");
                                        }
                                    })
                                })
                            }

                        }
                        else {
                            this.$attivita_error.classList.remove("no-focus");
                        }
                    })


                }
            }
            else {
                this.$registerError.classList.remove("no-focus");
                this.$registerErrorAdmin.classList.add("no-fovus");
                this.$registerErrorPresente.classList.add("no-focus");
                this.$registerErrorVuoti.classList.remove("no-focus");
            }
        })
        this.$loginButton.addEventListener("click", () => {
            if (this.$loginUsername.value != "" && this.$loginPassword.value != "") {
                fetch("/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: this.$loginUsername.value,
                        password: this.$loginPassword.value,
                    })
                }).then(res => res.json()).then(data => {
                    if (data.success) {
                        this.$ruolo = data.ruolo;
                        this._createSocket(this.$loginUsername.value);
                        this._createPage(this.$loginUsername.value);
                    }
                    else {
                        this.$loginError.classList.remove("no-focus");
                        this.$loginErrorCorretto.classList.remove("no-focus");
                        this.$loginErrorVuoto.classList.add("no-focus");
                    }
                })
            }
            else {
                this.$loginError.classList.remove("no-focus");
                this.$loginErrorCorretto.classList.add("no-focus");
                this.$loginErrorVuoto.classList.remove("no-focus");
            }
        })
        this.$iconLogin.addEventListener("mousedown", (e) => {
            e.preventDefault();
            this._password(this.$loginPassword, this.$iconLogin);
        })
        this.$iconRegister.addEventListener("mousedown", (e) => {
            e.preventDefault();
            this._password(this.$registerPassword, this.$iconRegister);
        })
    },
    _password: function (password, icon) {
        if (password.type === "password") {
            icon.style.backgroundImage = "url('asset/img/eye1.png')";
            password.type = "text"
        }
        else {
            icon.style.backgroundImage = "url('asset/img/eye.png')";
            password.type = "password"
        }
    },
    _createPage: function (username) {
        this.$container_login.classList.add("no-focus");
        this.$container_login.classList.remove("grid");
        const oggi = new Date();
        const giorno1 = oggi.getDate();
        const settimana1 = oggi.getDay();
        const nomeSettimana1 = this._getSettimana(settimana1);
        const mese1 = oggi.getMonth();
        const nomeMese1 = this._getMese(mese1);
        const anno1 = oggi.getFullYear();
        this.$primogiorno = giorno1;
        this.$primomese = mese1;
        this.$primoanno = anno1;
        this.$selectedday = new Date(anno1, mese1, giorno1);
        this.$currentDay = new Date(anno1, mese1, giorno1);

        const giorno2 = this._getDay(giorno1, mese1);
        const settimana2 = this._getSettimanaNumber(settimana1);
        const nomeSettimana2 = this._getSettimana(settimana2);
        const mese2 = this._getMeseNumber(giorno1, mese1);
        const nomeMese2 = this._getMese(mese2);
        const anno2 = this._getAnno(giorno1, mese1, anno1);

        const giorno3 = this._getDay(giorno2, mese2);
        const settimana3 = this._getSettimanaNumber(settimana2);
        const nomeSettimana3 = this._getSettimana(settimana3);
        const mese3 = this._getMeseNumber(giorno2, mese2);
        const nomeMese3 = this._getMese(mese3);
        const anno3 = this._getAnno(giorno2, mese2, anno2);

        const giorno4 = this._getDay(giorno3, mese3);
        const settimana4 = this._getSettimanaNumber(settimana3);
        const nomeSettimana4 = this._getSettimana(settimana4);
        const mese4 = this._getMeseNumber(giorno3, mese3);
        const nomeMese4 = this._getMese(mese4);
        const anno4 = this._getAnno(giorno3, mese3, anno3);

        const giorno5 = this._getDay(giorno4, mese4);
        const settimana5 = this._getSettimanaNumber(settimana4);
        const nomeSettimana5 = this._getSettimana(settimana5);
        const mese5 = this._getMeseNumber(giorno4, mese4);
        const nomeMese5 = this._getMese(mese5);
        const anno5 = this._getAnno(giorno4, mese4, anno4);

        const giorno6 = this._getDay(giorno5, mese5);
        const settimana6 = this._getSettimanaNumber(settimana5);
        const nomeSettimana6 = this._getSettimana(settimana6);
        const mese6 = this._getMeseNumber(giorno5, mese5);
        const nomeMese6 = this._getMese(mese6);
        const anno6 = this._getAnno(giorno5, mese5, anno5);

        const giorno7 = this._getDay(giorno6, mese6);
        const settimana7 = this._getSettimanaNumber(settimana6);
        const nomeSettimana7 = this._getSettimana(settimana7);
        const mese7 = this._getMeseNumber(giorno6, mese6);
        const nomeMese7 = this._getMese(mese7);
        const anno7 = this._getAnno(giorno6, mese6, anno6);
        if (this.$ruolo === "personal trainer") {
            const template = `
                <div settimana="${nomeSettimana1}" giorno="${giorno1}" mese="${nomeMese1}" anno="${anno1}" class="giorno1">
                    <div  class="giorno">
                        <h1>${nomeSettimana1}</h1>
                        <p>${giorno1} ${nomeMese1} ${anno1}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana2}" giorno="${giorno2}" mese="${nomeMese2}" anno="${anno2}" class="giorno2">
                    <div class="giorno">
                        <h1>${nomeSettimana2}</h1>
                        <p>${giorno2} ${nomeMese2} ${anno2}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana3}" giorno="${giorno3}" mese="${nomeMese3}" anno="${anno3}" class="giorno3">
                    <div class="giorno">
                        <h1>${nomeSettimana3}</h1>
                        <p>${giorno3} ${nomeMese3} ${anno3}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana4}" giorno="${giorno4}" mese="${nomeMese4}" anno="${anno4}" class="giorno4">
                    <div class="giorno">
                        <h1>${nomeSettimana4}</h1>
                        <p>${giorno4} ${nomeMese4} ${anno4}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana5}" giorno="${giorno5}" mese="${nomeMese5}" anno="${anno5}" class="giorno5">
                    <div class="giorno">
                        <h1>${nomeSettimana5}</h1>
                        <p>${giorno5} ${nomeMese5} ${anno5}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana6}" giorno="${giorno6}" mese="${nomeMese6}" anno="${anno6}" class="giorno6">
                    <div class="giorno">
                        <h1>${nomeSettimana6}</h1>
                        <p>${giorno6} ${nomeMese6} ${anno6}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana7}" giorno="${giorno7}" mese="${nomeMese7}" anno="${anno7}" class="giorno7">
                    <div class="giorno">
                        <h1>${nomeSettimana7}</h1>
                        <p>${giorno7} ${nomeMese7} ${anno7}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div class="button">
                    <button>Aggiungi</button>
                </div>
            `;
            const template2 = `
                <div class="nome">Ciao, ${username} </div>
                <div class="ruolo_principale">${this.$ruolo} </div>
            `;
            const nomemese = this._getMese(this.$primomese);
            const template3 = `
                <div class="calendario_view">${this.$primogiorno} ${nomemese} ${this.$primoanno}</div>
            `
            const template4 = `
                <div class="header">
                    <button class=" buthead precedente">‹</button>
                    <div class="mese"></div>
                    <button class=" buthead successivo">›</button>
                </div>

                <div class="calendario-grid" id="calendarioGrid">
                    <div class="calendario-day-header">Dom</div>
                    <div class="calendario-day-header">Lun</div>
                    <div class="calendario-day-header">Mar</div>
                    <div class="calendario-day-header">Mer</div>
                    <div class="calendario-day-header">Gio</div>
                    <div class="calendario-day-header">Ven</div>
                    <div class="calendario-day-header">Sab</div>
                </div>
            `;
            const newElem = document.createElement("div");
            newElem.innerHTML = template;
            newElem.classList.add("container-principale");
            newElem.classList.add("grid");
            document.body.appendChild(newElem);
            const newElem2 = document.createElement("div");
            newElem2.innerHTML = template2;
            newElem2.classList.add("info_user");
            document.body.appendChild(newElem2);
            const newElem3 = document.createElement("div");
            newElem3.classList.add("calendario");
            newElem3.innerHTML = template3;
            const newElem4 = document.createElement("div");
            newElem4.classList.add("calendario_pop_up");
            newElem4.classList.add("no-focus");
            newElem4.innerHTML = template4;
            const calendario_view = newElem3.querySelector(".calendario_view");
            this.$title.insertAdjacentElement('afterend', newElem3);
            newElem3.insertAdjacentElement('afterend', newElem4);
            calendario_view.addEventListener("click", () => {
                this._orario(username, newElem4, newElem3);
            })
            this.$container_principale = newElem;
            const buttonAggiungi = document.querySelector(".container-principale>.button>button");
            fetch("/riempi", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(res => res.json()).then(data => {
                for (const elem of data.attivita) {

                    const inserisci = this.$container_principale.querySelector(`[settimana="${elem.giorno}"][giorno="${elem.numerogiorno}"][mese="${elem.mese}"][anno="${elem.anno}"]>.PrenotazioniGiorno`);
                    if (inserisci) {
                        const template = `
                            <h3>${elem.sport}</h3>
                            <p>${elem.inizio}-${elem.fine}</p>
                        `;
                        const newActivity = document.createElement("div");
                        newActivity.classList.add("newActivity");
                        newActivity.setAttribute("univoco", elem.univoco);
                        newActivity.innerHTML = template;
                        newActivity.setAttribute("sport", elem.sport);
                        newActivity.classList.add(`${elem.sport}`);
                        this._insertActivitySorted(inserisci, newActivity, elem.inizio);
                        if (elem.username === username) {
                            newActivity.addEventListener("click", () => {
                                fetch("/prendiClienti", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        univoco: elem.univoco,
                                    })
                                }).then(res => res.json()).then(data => {
                                    let template = `
                                        <div class="All_user">
                                    `;
                                    for (const elem of data.db) {
                                        template += `
                                            <div nome="${elem.username}" class="utente">
                                                <div class="nome">${elem.username}</div>
                                            </div>
                                        `;
                                    }
                                    template += `
                                        </div>
                                        <button class="Cancella">CANCELLA PRENOTAZIONE</button>
                                        <div class="X">X</div>
                                    `;
                                    const PrenotazionePersonal = document.createElement("div");
                                    PrenotazionePersonal.innerHTML = template;
                                    PrenotazionePersonal.setAttribute("univoco", elem.univoco);
                                    PrenotazionePersonal.classList.add("PrenotazionePersonal");
                                    document.body.appendChild(PrenotazionePersonal);
                                    this.$prenotazionepersonal = PrenotazionePersonal;
                                    const CancellaPrenotazione = PrenotazionePersonal.querySelector(".Cancella");
                                    const close = PrenotazionePersonal.querySelector(".X");
                                    close.addEventListener("click", () => {
                                        this.$prenotazionepersonal.remove();
                                        this.$prenotazionepersonal = null;
                                    })
                                    CancellaPrenotazione.addEventListener("click", () => {
                                        fetch("/rimuoviAttivita", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                giorno: elem.giorno,
                                                univoco: elem.univoco,
                                                inizio: elem.inizio,
                                                fine: elem.fine,
                                                admin: false,
                                            })
                                        }).then(res => res.json()).then(data => {
                                            if (data.success) {
                                                const template = `
                                                        <div class="toast-content">
                                                            <h4>Lezione cancellata</h4>
                                                            <p>È stato cancellato una prenotazione</p>
                                                        </div>
                                                        <button class="toast-close" aria-label="Chiudi">X</button>
                                                    `;
                                                const newElem = document.createElement("div");
                                                newElem.classList.add("toast-container");
                                                newElem.innerHTML = template;
                                                document.body.appendChild(newElem);
                                                const close = newElem.querySelector(".toast-close");
                                                close.addEventListener("click", () => {
                                                    newElem.remove();
                                                })
                                                //this.$prenotazionepersonal.remove();
                                                //this.$prenotazionepersonal = null;

                                            }
                                            else {
                                                const template = `
                                                        <div class="toast-content">
                                                            <h4>Cancellazione non effettuata</h4>
                                                            <p>Impossibile cancelare: l'orario selezionato è già passato</p>
                                                        </div>
                                                        <button class="toast-close" aria-label="Chiudi">X</button>
                                                    `;
                                                const newElem = document.createElement("div");
                                                newElem.classList.add("toast-container");
                                                newElem.innerHTML = template;
                                                document.body.appendChild(newElem);
                                                const close = newElem.querySelector(".toast-close");
                                                close.addEventListener("click", () => {
                                                    newElem.remove();
                                                })
                                            }
                                        });
                                    })
                                })
                            })
                        }
                    }
                }
            })
            buttonAggiungi.addEventListener("click", () => {
                if (!this.$newLesson) {
                    fetch("/prendiSport", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username,
                        })
                    }).then(res => res.json()).then(data => {
                        let template = `
                            <div class="errore no-focus">
                                <div class="errore_vuoti no-focus">inserisci tutti i campi</div>
                                <div class="errore_orario no-focus">Orari occupati o errati</div> 
                            </div>
                        `;
                        for (const elem of data.db) {
                            template += `<label><input type="radio" name="newAttivita" class="newAttivita" value="${elem}" />${elem}</label>`
                        }
                        template += `
                            <div class="numerogiorno">
                                <span>Giorno</span> <br />
                                <input type="date" class="numerogiorno_input"/>
                            </div>
                            <div class="tempo">
                                <span class="da">da</span><span class="a">a</span> <br />
                                <input type="time" class="inizio" />
                                <input type="time" class="fine" />
                            </div>
                            <button>CONTINUA</button>
                            <div class="X">X</div>
                        `
                        const newLesson = document.createElement("div");
                        newLesson.innerHTML = template;
                        newLesson.classList.add("newLesson");
                        document.body.appendChild(newLesson);
                        this.$newLesson = newLesson;
                        const errore = newLesson.querySelector(".errore");
                        const errore_vuoti = newLesson.querySelector(".errore>.errore_vuoti");
                        const errore_orario = newLesson.querySelector(".errore>.errore_orario");
                        const ButtonNewActivity = newLesson.querySelector("button");
                        const tempoinizio = newLesson.querySelector(".tempo>.inizio");
                        const tempofine = newLesson.querySelector(".tempo>.fine");
                        const calendario = newLesson.querySelector(".numerogiorno>.numerogiorno_input");
                        const chiudi = newLesson.querySelector(".X");
                        chiudi.addEventListener("click", () => {
                            newLesson.remove();
                            this.$newLesson = null;
                        })
                        ButtonNewActivity.addEventListener("click", () => {

                            const selectedActivity = newLesson.querySelector('input[name="newAttivita"]:checked');
                            if (selectedActivity && tempoinizio.value != "" && tempofine.value != "" && calendario.value != "") {
                                let inizio = parseFloat(tempoinizio.value.replace(":", "."));

                                let fine = parseFloat(tempofine.value.replace(":", "."));

                                let [anno, mese, numerogiorno] = calendario.value.split("-");
                                anno = parseInt(anno);
                                mese = parseInt(mese);
                                numerogiorno = parseInt(numerogiorno);
                                mese--;
                                const ora = Math.floor(inizio);                  // 14
                                const minuti = Math.round((inizio % 1) * 100);
                                const oggi = new Date();
                                const newdata = new Date(anno, mese, numerogiorno, ora, minuti);
                                //if (anno > this.$primoanno || (anno === this.$primoanno && (mese > this.$primomese || (mese === this.$primomese && numerogiorno >= this.$primogiorno)))) {
                                if (newdata >= oggi) {
                                    const giorno = this._getDayOfWeek(numerogiorno, mese, anno);
                                    const nomemese = this._getMese(mese);
                                    fetch("/newAttivita", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            username,
                                            sport: selectedActivity.value,
                                            giorno,
                                            numerogiorno,
                                            mese: nomemese,
                                            anno,
                                            inizio,
                                            fine,
                                            univoco: Date.now(),
                                        })
                                    }).then(res => res.json()).then(data => {
                                        if (data.success) {
                                            const template = `
                                            <div class="toast-content">
                                                <h4>Lezione creata</h4>
                                                <p>È stata registrata una nuova prenotazione.</p>
                                            </div>
                                            <button class="toast-close">X</button>`
                                            const newElem = document.createElement("div");
                                            newElem.classList.add("toast-container");
                                            newElem.innerHTML = template;
                                            document.body.appendChild(newElem);
                                            const close = newElem.querySelector(".toast-close");
                                            close.addEventListener("click", () => {
                                                newElem.remove();
                                            })

                                            newLesson.remove();
                                            this.$newLesson = null;
                                        }
                                        else {
                                            errore.classList.remove("no-focus");
                                            errore_vuoti.classList.add("no-focus");
                                            errore_orario.classList.remove("no-focus");
                                        }
                                    })
                                } else {
                                    errore.classList.remove("no-focus");
                                    errore_vuoti.classList.add("no-focus");
                                    errore_orario.classList.remove("no-focus");
                                }

                            }
                            else {
                                errore.classList.remove("no-focus");
                                errore_vuoti.classList.remove("no-focus");
                                errore_orario.classList.add("no-focus");
                            }
                        });
                    })
                }
            })
        }
        else if (this.$ruolo === "cliente") {
            const template = `
                <div settimana="${nomeSettimana1}" giorno="${giorno1}" mese="${nomeMese1}" anno="${anno1}" class="giorno1">
                    <div  class="giorno">
                        <h1>${nomeSettimana1}</h1>
                        <p>${giorno1} ${nomeMese1} ${anno1}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana2}" giorno="${giorno2}" mese="${nomeMese2}" anno="${anno2}" class="giorno2">
                    <div class="giorno">
                        <h1>${nomeSettimana2}</h1>
                        <p>${giorno2} ${nomeMese2} ${anno2}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana3}" giorno="${giorno3}" mese="${nomeMese3}" anno="${anno3}" class="giorno3">
                    <div class="giorno">
                        <h1>${nomeSettimana3}</h1>
                        <p>${giorno3} ${nomeMese3} ${anno3}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana4}" giorno="${giorno4}" mese="${nomeMese4}" anno="${anno4}" class="giorno4">
                    <div class="giorno">
                        <h1>${nomeSettimana4}</h1>
                        <p>${giorno4} ${nomeMese4} ${anno4}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana5}" giorno="${giorno5}" mese="${nomeMese5}" anno="${anno5}" class="giorno5">
                    <div class="giorno">
                        <h1>${nomeSettimana5}</h1>
                        <p>${giorno5} ${nomeMese5} ${anno5}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana6}" giorno="${giorno6}" mese="${nomeMese6}" anno="${anno6}" class="giorno6">
                    <div class="giorno">
                        <h1>${nomeSettimana6}</h1>
                        <p>${giorno6} ${nomeMese6} ${anno6}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana7}" giorno="${giorno7}" mese="${nomeMese7}" anno="${anno7}" class="giorno7">
                    <div class="giorno">
                        <h1>${nomeSettimana7}</h1>
                        <p>${giorno7} ${nomeMese7} ${anno7}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div class="button">
                    <button>Prenotazioni</button>
                </div>
            `;
            const template2 = `
                <div class="nome">Ciao, ${username} </div>
                <div class="ruolo_principale">${this.$ruolo} </div>
            `;
            const nomemese = this._getMese(this.$primomese);
            const template3 = `
                <input type="date" class="calendario_input"/>
                <div class="calendario_view">${this.$primogiorno} ${nomemese} ${this.$primoanno}</div>
            `
            const template4 = `
                <div class="header">
                    <button class=" buthead precedente">‹</button>
                    <div class="mese"></div>
                    <button class=" buthead successivo">›</button>
                </div>

                <div class="calendario-grid" id="calendarioGrid">
                    <div class="calendario-day-header">Dom</div>
                    <div class="calendario-day-header">Lun</div>
                    <div class="calendario-day-header">Mar</div>
                    <div class="calendario-day-header">Mer</div>
                    <div class="calendario-day-header">Gio</div>
                    <div class="calendario-day-header">Ven</div>
                    <div class="calendario-day-header">Sab</div>
                </div>
            `;
            const newElem = document.createElement("div");
            newElem.innerHTML = template;
            newElem.classList.add("container-principale");
            newElem.classList.add("grid");
            document.body.appendChild(newElem);
            const newElem2 = document.createElement("div");
            newElem2.innerHTML = template2;
            newElem2.classList.add("info_user");
            document.body.appendChild(newElem2);
            const newElem3 = document.createElement("div");
            newElem3.classList.add("calendario");
            newElem3.innerHTML = template3;
            const newElem4 = document.createElement("div");
            newElem4.classList.add("calendario_pop_up");
            newElem4.classList.add("no-focus");
            newElem4.innerHTML = template4;
            const calendario_view = newElem3.querySelector(".calendario_view");
            this.$title.insertAdjacentElement('afterend', newElem3);
            newElem3.insertAdjacentElement('afterend', newElem4);
            calendario_view.addEventListener("click", () => {
                this._orario(username, newElem4, newElem3);
            })
            this.$container_principale = newElem;
            const buttonAggiungi = document.querySelector(".container-principale>.button>button");
            fetch("/riempiClienti", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                })
            }).then(res => res.json()).then(data => {
                for (const elem of data.db) {
                    const inserisci = this.$container_principale.querySelector(`[settimana="${elem.giorno}"][giorno="${elem.numerogiorno}"][mese="${elem.mese}"][anno="${elem.anno}"]>.PrenotazioniGiorno`);
                    if (inserisci) {
                        const template = `
                            <h3>${elem.sport}</h3>
                            <p class="cliente prenotazione">${(elem.prenotato===1 ? "prenotato": "non prenotato")}</p>
                            <p class="cliente">${elem.inizio}-${elem.fine}</p>
                        `;
                        const newActivity = document.createElement("div");
                        newActivity.classList.add("newActivity");
                        newActivity.setAttribute("univoco", elem.univoco);
                        newActivity.innerHTML = template;
                        newActivity.setAttribute("sport", elem.sport);
                        newActivity.classList.add(`${elem.sport}`);
                        this._insertActivitySorted(inserisci, newActivity, elem.inizio);
                        const prenotato=newActivity.querySelector(".prenotazione");
                        newActivity.addEventListener("click", () => {
                            fetch("/insertPrenotazione", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    username,
                                    univoco: elem.univoco,
                                    giorno: elem.giorno,
                                    sport: elem.sport,
                                    inizio: elem.inizio,
                                    numerogiorno: elem.numerogiorno,
                                    mese: elem.mese,
                                    anno: elem.anno,
                                    fine: elem.fine,
                                })
                            }).then(res => res.json()).then(data => {
                                if (data.success) {
                                    prenotato.innerHTML="prenotato"
                                    const template = `
                                        <div class="toast-content">
                                            <h4>Lezione Prenotata</h4>
                                            <p>L'utente ha appena effetuato una prenotazione.</p>
                                        </div>
                                        <button class="toast-close" aria-label="Chiudi">X</button>
                                    `;
                                    const newElem = document.createElement("div");
                                    newElem.classList.add("toast-container");
                                    newElem.innerHTML = template;
                                    document.body.appendChild(newElem);
                                    const close = newElem.querySelector(".toast-close");
                                    close.addEventListener("click", () => {
                                        newElem.remove();
                                    })

                                }
                                else {
                                    if (data.presente) {
                                        const template = `
                                            <div class="toast-content">
                                                <h4>Prenotazione non effettuata</h4>
                                                <p>Impossibile prenotare: l'utente è gia prenotato</p>
                                            </div>
                                            <button class="toast-close" aria-label="Chiudi">X</button>
                                        `;
                                        const newElem = document.createElement("div");
                                        newElem.classList.add("toast-container");
                                        newElem.innerHTML = template;
                                        document.body.appendChild(newElem);
                                        const close = newElem.querySelector(".toast-close");
                                        close.addEventListener("click", () => {
                                            newElem.remove();
                                        })
                                    }
                                    else {
                                        const template = `
                                            <div class="toast-content">
                                                <h4>Prenotazione non effettuata</h4>
                                                <p>Impossibile prenotare: l'orario selezionato è già passato</p>
                                            </div>
                                            <button class="toast-close" aria-label="Chiudi">X</button>
                                        `;
                                        const newElem = document.createElement("div");
                                        newElem.classList.add("toast-container");
                                        newElem.innerHTML = template;
                                        document.body.appendChild(newElem);
                                        const close = newElem.querySelector(".toast-close");
                                        close.addEventListener("click", () => {
                                            newElem.remove();
                                        })
                                    }
                                }
                            })
                        })
                    }
                }
            })
            buttonAggiungi.addEventListener("click", () => {
                if (!this.$prenotazione) {
                    fetch("/prendiPrenotazioni", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username,
                        })
                    }).then(res => res.json()).then(data => {
                        let template = `<div class="numeroPrenotazioni">`;
                        for (const elem of data.db) {
                            template += `
                            <div univoco="${elem.univoco}" class="newPrenotazione">
                                <h3>${elem.sport}</h3>
                                <p class="data">${elem.numerogiorno} ${elem.mese} ${elem.anno}</p>
                                <p class="giorno">${elem.giorno}</p>
                                <p class="ora">${elem.inizio}-${elem.fine}</p>
                                <div giorno="${elem.giorno}" inizio="${elem.inizio}" fine="${elem.fine}" univoco="${elem.univoco}" numerogiorno="${elem.numerogiorno}" mese="${elem.mese}" anno="${elem.anno}" class="X">X</div>
                            </div>
                        `
                        }
                        template += `
                        </div>
                        <button>chiudi</button>
                    `;
                        const prenotazioni = document.createElement("div");
                        prenotazioni.innerHTML = template;
                        prenotazioni.classList.add("Prenotazioni");
                        document.body.appendChild(prenotazioni);
                        this.$prenotazione = prenotazioni;
                        const close = prenotazioni.querySelectorAll(".numeroPrenotazioni>.newPrenotazione>.X");
                        const finePrenotazioni = prenotazioni.querySelector("button");
                        finePrenotazioni.addEventListener("click", () => {
                            prenotazioni.remove();
                            this.$prenotazione = null;
                        })
                        for (const elem of close) {
                            elem.addEventListener("click", () => {
                                fetch("/removePrenotazione", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        username,
                                        numerogiorno: elem.getAttribute("numerogiorno"),
                                        mese: elem.getAttribute("mese"),
                                        anno: elem.getAttribute("anno"),
                                        univoco: elem.getAttribute("univoco"),
                                        giorno: elem.getAttribute("giorno"),
                                        inizio: elem.getAttribute("inizio"),
                                        fine: elem.getAttribute("fine"),
                                        admin: false,
                                    })
                                }).then(res => res.json()).then(data => {

                                });
                            })
                        }
                    })
                }
            })
        }
        else {
            const template = `
                <div settimana="${nomeSettimana1}" giorno="${giorno1}" mese="${nomeMese1}" anno="${anno1}" class="giorno1">
                    <div  class="giorno">
                        <h1>${nomeSettimana1}</h1>
                        <p>${giorno1} ${nomeMese1} ${anno1}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana2}" giorno="${giorno2}" mese="${nomeMese2}" anno="${anno2}" class="giorno2">
                    <div class="giorno">
                        <h1>${nomeSettimana2}</h1>
                        <p>${giorno2} ${nomeMese2} ${anno2}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana3}" giorno="${giorno3}" mese="${nomeMese3}" anno="${anno3}" class="giorno3">
                    <div class="giorno">
                        <h1>${nomeSettimana3}</h1>
                        <p>${giorno3} ${nomeMese3} ${anno3}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana4}" giorno="${giorno4}" mese="${nomeMese4}" anno="${anno4}" class="giorno4">
                    <div class="giorno">
                        <h1>${nomeSettimana4}</h1>
                        <p>${giorno4} ${nomeMese4} ${anno4}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana5}" giorno="${giorno5}" mese="${nomeMese5}" anno="${anno5}" class="giorno5">
                    <div class="giorno">
                        <h1>${nomeSettimana5}</h1>
                        <p>${giorno5} ${nomeMese5} ${anno5}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana6}" giorno="${giorno6}" mese="${nomeMese6}" anno="${anno6}" class="giorno6">
                    <div class="giorno">
                        <h1>${nomeSettimana6}</h1>
                        <p>${giorno6} ${nomeMese6} ${anno6}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana7}" giorno="${giorno7}" mese="${nomeMese7}" anno="${anno7}" class="giorno7">
                    <div class="giorno">
                        <h1>${nomeSettimana7}</h1>
                        <p>${giorno7} ${nomeMese7} ${anno7}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
            `;
            const template2 = `
                <div class="nome">Ciao, ${username} </div>
                <div class="ruolo_principale">${this.$ruolo} </div>
            `;
            const nomemese = this._getMese(this.$primomese);
            const template3 = `
                <input type="date" class="calendario_input"/>
                <div class="calendario_view">${this.$primogiorno} ${nomemese} ${this.$primoanno}</div>
            `
            const template4 = `
                <div class="header">
                    <button class=" buthead precedente">‹</button>
                    <div class="mese"></div>
                    <button class=" buthead successivo">›</button>
                </div>

                <div class="calendario-grid" id="calendarioGrid">
                    <div class="calendario-day-header">Dom</div>
                    <div class="calendario-day-header">Lun</div>
                    <div class="calendario-day-header">Mar</div>
                    <div class="calendario-day-header">Mer</div>
                    <div class="calendario-day-header">Gio</div>
                    <div class="calendario-day-header">Ven</div>
                    <div class="calendario-day-header">Sab</div>
                </div>
            `;
            const newElem = document.createElement("div");
            newElem.innerHTML = template;
            newElem.classList.add("container-principale");
            newElem.classList.add("grid");
            document.body.appendChild(newElem);
            const newElem2 = document.createElement("div");
            newElem2.innerHTML = template2;
            newElem2.classList.add("info_user");
            document.body.appendChild(newElem2);
            const newElem3 = document.createElement("div");
            newElem3.classList.add("calendario");
            newElem3.innerHTML = template3;
            const newElem4 = document.createElement("div");
            newElem4.classList.add("calendario_pop_up");
            newElem4.classList.add("no-focus");
            newElem4.innerHTML = template4;
            const calendario_view = newElem3.querySelector(".calendario_view");
            this.$title.insertAdjacentElement('afterend', newElem3);
            newElem3.insertAdjacentElement('afterend', newElem4);
            calendario_view.addEventListener("click", () => {
                this._orario(username, newElem4, newElem3);
            })
            this.$container_principale = newElem;
            fetch("/riempi", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(res => res.json()).then(data => {
                for (const elem of data.attivita) {
                    const inserisci = this.$container_principale.querySelector(`[settimana="${elem.giorno}"][giorno="${elem.numerogiorno}"][mese="${elem.mese}"][anno="${elem.anno}"]>.PrenotazioniGiorno`);
                    if (inserisci) {
                        const template = `
                            <h3>${elem.sport}</h3>
                            <p>${elem.inizio}-${elem.fine}</p>
                        `;
                        const newActivity = document.createElement("div");
                        newActivity.classList.add("newActivity");
                        newActivity.setAttribute("univoco", elem.univoco);
                        newActivity.innerHTML = template;
                        newActivity.setAttribute("sport", elem.sport);
                        newActivity.classList.add(`${elem.sport}`);
                        this._insertActivitySorted(inserisci, newActivity, elem.inizio);
                        newActivity.addEventListener("click", () => {
                            if (!this.$prenotazioneAdmin) {
                                fetch("/prendiClienti", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        univoco: elem.univoco,
                                    })
                                }).then(res => res.json()).then(data => {
                                    let template = `
                                    <div class="All_user">
                                `;
                                    for (const iterato of data.db) {
                                        template += `
                                        <div nome="${iterato.username}" class="utente">
                                            <div class="nome">${iterato.username}</div>
                                            <button nome="${iterato.username}">CANCELLA</button>
                                        </div>
                                    `;
                                    }
                                    template += `
                                    </div>
                                    <button class="Cancella">CANCELLA PRENOTAZIONE</button>
                                    <div class="X">X</div>
                                `;
                                    const PrenotazioneAdmin = document.createElement("div");
                                    PrenotazioneAdmin.innerHTML = template;
                                    PrenotazioneAdmin.setAttribute("univoco", elem.univoco);
                                    PrenotazioneAdmin.classList.add("PrenotazioneAdmin");
                                    document.body.appendChild(PrenotazioneAdmin);
                                    this.$prenotazioneAdmin = PrenotazioneAdmin;
                                    const CancellaPrenotazione = PrenotazioneAdmin.querySelector(".Cancella");
                                    const CancellaCliente = PrenotazioneAdmin.querySelectorAll(".All_user>.utente>button");
                                    const close = PrenotazioneAdmin.querySelector(".X");
                                    close.addEventListener("click", () => {
                                        this.$prenotazioneAdmin.remove();
                                        this.$prenotazioneAdmin = null;
                                    })
                                    for (const iterato of CancellaCliente) {
                                        iterato.addEventListener("click", () => {
                                            fetch("/removePrenotazione", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    username: iterato.getAttribute("nome"),
                                                    univoco: elem.univoco,
                                                    giorno: elem.giorno,
                                                    numerogiorno: elem.numerogiorno,
                                                    mese: elem.mese,
                                                    anno: elem.anno,
                                                    inizio: elem.inizio,
                                                    fine: elem.fine,
                                                    admin: true,
                                                })
                                            }).then(res => res.json()).then(data => {
                                                if (data.success) {
                                                    const template = `
                                                    <div class="toast-content">
                                                        <h4>utente cancellato</h4>
                                                        <p>È stato cancellato una prenotazione</p>
                                                    </div>
                                                    <button class="toast-close" aria-label="Chiudi">X</button>
                                                `;
                                                    const newElem = document.createElement("div");
                                                    newElem.classList.add("toast-container");
                                                    newElem.innerHTML = template;
                                                    document.body.appendChild(newElem);
                                                    const close = newElem.querySelector(".toast-close");
                                                    close.addEventListener("click", () => {
                                                        newElem.remove();
                                                    })

                                                }
                                                else {
                                                    const template = `
                                                    <div class="toast-content">
                                                        <h4>Cancellazione non effettuata</h4>
                                                        <p>Impossibile cancellare: l'orario selezionato è già passato</p>
                                                    </div>
                                                    <button class="toast-close" aria-label="Chiudi">X</button>
                                                `;
                                                    const newElem = document.createElement("div");
                                                    newElem.classList.add("toast-container");
                                                    newElem.innerHTML = template;
                                                    document.body.appendChild(newElem);
                                                    const close = newElem.querySelector(".toast-close");
                                                    close.addEventListener("click", () => {
                                                        newElem.remove();
                                                    })
                                                }
                                            });
                                        })
                                    }
                                    CancellaPrenotazione.addEventListener("click", () => {
                                        fetch("/rimuoviAttivita", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                numerogiorno:elem.numerogiorno,
                                                mese:elem.mese,
                                                anno:elem.anno,
                                                giorno: elem.giorno,
                                                univoco: elem.univoco,
                                                inizio: elem.inizio,
                                                fine: elem.fine,
                                                admin: true,
                                            })
                                        }).then(res => res.json()).then(data => {
                                            if (data.success) {
                                                const template = `
                                            <div class="toast-content">
                                                <h4>Lezione cancellata</h4>
                                                <p>È stato cancellato una prenotazione</p>
                                            </div>
                                            <button class="toast-close" aria-label="Chiudi">X</button>
                                        `;
                                                const newElem = document.createElement("div");
                                                newElem.classList.add("toast-container");
                                                newElem.innerHTML = template;
                                                document.body.appendChild(newElem);
                                                const close = newElem.querySelector(".toast-close");
                                                close.addEventListener("click", () => {
                                                    newElem.remove();
                                                })

                                            }
                                            else {
                                                const template = `
                                            <div class="toast-content">
                                                <h4>Cancellazione non effettuata</h4>
                                                <p>Impossibile cancellare: l'orario selezionato è già passato</p>
                                            </div>
                                            <button class="toast-close" aria-label="Chiudi">X</button>
                                        `;
                                                const newElem = document.createElement("div");
                                                newElem.classList.add("toast-container");
                                                newElem.innerHTML = template;
                                                document.body.appendChild(newElem);
                                                const close = newElem.querySelector(".toast-close");
                                                close.addEventListener("click", () => {
                                                    newElem.remove();
                                                })
                                            }
                                        });
                                    })
                                })
                            }
                        })
                    }
                }
            })
        }

    },
    _createSocket: function (username) {
        const socket = io();
        socket.on("connect", () => {
            console.log("🟢 SOCKET CONNESSO " + socket.id);
            socket.emit("newuser", this.$ruolo);
            socket.on("newAttivita", (dati) => {
                if (this.$ruolo != "cliente") {
                    const inserisci = this.$container_principale.querySelector(`[settimana="${dati.giorno}"][giorno="${dati.numerogiorno}"][mese="${dati.mese}"][anno="${dati.anno}"]>.PrenotazioniGiorno`);
                    if (inserisci) {
                        const template = `
                            <h3>${dati.sport}</h3>
                            <p>${dati.inizio}-${dati.fine}</p>
                        `;
                        const newActivity = document.createElement("div");
                        newActivity.classList.add("newActivity");
                        newActivity.setAttribute("univoco", dati.univoco);
                        newActivity.innerHTML = template;
                        newActivity.setAttribute("sport", dati.sport);
                        newActivity.classList.add(`${dati.sport}`);
                        this._insertActivitySorted(inserisci, newActivity, dati.inizio);
                        if (this.$ruolo === "personal trainer" && dati.username === username) {
                            newActivity.addEventListener("click", () => {
                                fetch("/prendiClienti", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        univoco: dati.univoco,
                                    })
                                }).then(res => res.json()).then(data => {
                                    let template = `
                                        <div class="All_user">
                                    `;
                                    for (const elem of data.db) {
                                        template += `
                                            <div nome="${elem.username}" class="utente">
                                                <div class="nome">${elem.username}</div>
                                            </div>
                                        `;
                                    }
                                    template += `
                                        </div>
                                        <button class="Cancella">CANCELLA PRENOTAZIONE</button>
                                        <div class="X">X</div>
                                    `;
                                    const PrenotazionePersonal = document.createElement("div");
                                    PrenotazionePersonal.innerHTML = template;
                                    PrenotazionePersonal.setAttribute("univoco", dati.univoco);
                                    PrenotazionePersonal.classList.add("PrenotazionePersonal");
                                    document.body.appendChild(PrenotazionePersonal);
                                    this.$prenotazionepersonal = PrenotazionePersonal;
                                    const CancellaPrenotazione = PrenotazionePersonal.querySelector(".Cancella");
                                    const close = PrenotazionePersonal.querySelector(".X");
                                    close.addEventListener("click", () => {
                                        this.$prenotazionepersonal.remove();
                                        this.$prenotazionepersonal = null;
                                    })
                                    CancellaPrenotazione.addEventListener("click", () => {
                                        fetch("/rimuoviAttivita", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                giorno: dati.giorno,
                                                univoco: dati.univoco,
                                                inizio: dati.inizio,
                                                fine: dati.fine,
                                                admin: false,
                                            })
                                        }).then(res => res.json()).then(data => {
                                            if (data.success) {
                                                const template = `
                                                        <div class="toast-content">
                                                            <h4>Lezione cancellata</h4>
                                                            <p>È stato cancellato una prenotazione</p>
                                                        </div>
                                                        <button class="toast-close" aria-label="Chiudi">X</button>
                                                    `;
                                                const newElem = document.createElement("div");
                                                newElem.classList.add("toast-container");
                                                newElem.innerHTML = template;
                                                document.body.appendChild(newElem);
                                                const close = newElem.querySelector(".toast-close");
                                                close.addEventListener("click", () => {
                                                    newElem.remove();
                                                })
                                                //this.$prenotazionepersonal.remove();
                                                //this.$prenotazionepersonal = null;

                                            }
                                            else {
                                                const template = `
                                                        <div class="toast-content">
                                                            <h4>Cancellazione non effettuata</h4>
                                                            <p>Impossibile cancelare: l'orario selezionato è già passato</p>
                                                        </div>
                                                        <button class="toast-close" aria-label="Chiudi">X</button>
                                                    `;
                                                const newElem = document.createElement("div");
                                                newElem.classList.add("toast-container");
                                                newElem.innerHTML = template;
                                                document.body.appendChild(newElem);
                                                const close = newElem.querySelector(".toast-close");
                                                close.addEventListener("click", () => {
                                                    newElem.remove();
                                                })
                                            }
                                        });
                                    })
                                })

                            })
                        }
                        else if (this.$ruolo === "admin") {
                            newActivity.addEventListener("click", () => {
                                if (!this.$prenotazioneAdmin) {
                                    fetch("/prendiClienti", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            univoco: dati.univoco,
                                        })
                                    }).then(res => res.json()).then(data => {
                                        let template = `
                                        <div class="All_user">
                                    `;
                                        for (const elem of data.db) {
                                            template += `
                                            <div nome="${elem.username}" class="utente">
                                                <div class="nome">${elem.username}</div>
                                                <button nome="${elem.username}">CANCELLA</button>
                                            </div>
                                        `;
                                        }
                                        template += `
                                        </div>
                                        <button class="Cancella">CANCELLA PRENOTAZIONE</button>
                                        <div class="X">X</div>
                                    `;
                                        const PrenotazioneAdmin = document.createElement("div");
                                        PrenotazioneAdmin.innerHTML = template;
                                        PrenotazioneAdmin.setAttribute("univoco", dati.univoco);
                                        PrenotazioneAdmin.classList.add("PrenotazioneAdmin");
                                        document.body.appendChild(PrenotazioneAdmin);
                                        this.$prenotazioneAdmin = PrenotazioneAdmin;
                                        const CancellaPrenotazione = PrenotazioneAdmin.querySelector(".Cancella");
                                        const CancellaCliente = PrenotazioneAdmin.querySelectorAll(".All_user>.utente>button");
                                        const close = PrenotazioneAdmin.querySelector(".X");
                                        close.addEventListener("click", () => {
                                            this.$prenotazioneAdmin.remove();
                                            this.$prenotazioneAdmin = null;
                                        })
                                        for (const elem of CancellaCliente) {
                                            elem.addEventListener("click", () => {
                                                fetch("/removePrenotazione", {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({
                                                        username: elem.getAttribute("nome"),
                                                        univoco: dati.univoco,
                                                        numerogiorno: dati.numerogiorno,
                                                        mese: dati.mese,
                                                        anno: dati.anno,
                                                        giorno: dati.giorno,
                                                        inizio: dati.inizio,
                                                        fine: dati.fine,
                                                        admin: true,
                                                    })
                                                }).then(res => res.json()).then(data => {
                                                    if (data.success) {
                                                        const template = `
                                                    <div class="toast-content">
                                                        <h4>utente cancellato</h4>
                                                        <p>È stato cancellato una prenotazione</p>
                                                    </div>
                                                    <button class="toast-close" aria-label="Chiudi">X</button>
                                                `;
                                                        const newElem = document.createElement("div");
                                                        newElem.classList.add("toast-container");
                                                        newElem.innerHTML = template;
                                                        document.body.appendChild(newElem);
                                                        const close = newElem.querySelector(".toast-close");
                                                        close.addEventListener("click", () => {
                                                            newElem.remove();
                                                        })

                                                    }
                                                    else {
                                                        const template = `
                                                    <div class="toast-content">
                                                        <h4>Cancellazione non effettuata</h4>
                                                        <p>Impossibile cancellare: l'orario selezionato è già passato</p>
                                                    </div>
                                                    <button class="toast-close" aria-label="Chiudi">X</button>
                                                `;
                                                        const newElem = document.createElement("div");
                                                        newElem.classList.add("toast-container");
                                                        newElem.innerHTML = template;
                                                        document.body.appendChild(newElem);
                                                        const close = newElem.querySelector(".toast-close");
                                                        close.addEventListener("click", () => {
                                                            newElem.remove();
                                                        })
                                                    }
                                                });
                                            })
                                        }
                                        CancellaPrenotazione.addEventListener("click", () => {
                                            fetch("/rimuoviAttivita", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    numerogiorno:dati.numerogiorno,
                                                    mese:dati.mese,
                                                    anno:dati.anno,
                                                    giorno: dati.giorno,
                                                    univoco: dati.univoco,
                                                    inizio: dati.inizio,
                                                    fine: dati.fine,
                                                    admin: true,
                                                })
                                            }).then(res => res.json()).then(data => {
                                                if (data.success) {
                                                    const template = `
                                                        <div class="toast-content">
                                                            <h4>Lezione cancellata</h4>
                                                            <p>È stato cancellato una prenotazione</p>
                                                        </div>
                                                        <button class="toast-close" aria-label="Chiudi">X</button>
                                                    `;
                                                    const newElem = document.createElement("div");
                                                    newElem.classList.add("toast-container");
                                                    newElem.innerHTML = template;
                                                    document.body.appendChild(newElem);
                                                    const close = newElem.querySelector(".toast-close");
                                                    close.addEventListener("click", () => {
                                                        newElem.remove();
                                                    })

                                                }
                                                else {
                                                    const template = `
                                            <div class="toast-content">
                                                <h4>Cancellazione non effettuata</h4>
                                                <p>Impossibile cancelare: l'orario selezionato è già passato</p>
                                            </div>
                                            <button class="toast-close" aria-label="Chiudi">X</button>
                                        `;
                                                    const newElem = document.createElement("div");
                                                    newElem.classList.add("toast-container");
                                                    newElem.innerHTML = template;
                                                    document.body.appendChild(newElem);
                                                    const close = newElem.querySelector(".toast-close");
                                                    close.addEventListener("click", () => {
                                                        newElem.remove();
                                                    })
                                                }
                                            });
                                        })
                                    })
                                }
                            })
                        }
                    }
                }
                else {
                    fetch("/prendiSportCliente", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username,
                        })
                    }).then(res => res.json()).then(Sport => {
                        for (const elem of Sport.attivita) {
                            if (elem === dati.sport) {
                                const inserisci = this.$container_principale.querySelector(`[settimana="${dati.giorno}"][giorno="${dati.numerogiorno}"][mese="${dati.mese}"][anno="${dati.anno}"]>.PrenotazioniGiorno`);

                                if (inserisci) {
                                    const template = `
                                        <h3>${dati.sport}</h3>
                                        <p class="cliente prenotazione">non prenotato</p>
                                        <p class="cliente">${dati.inizio}-${dati.fine}</p>
                                        
                                    `;
                                    const newActivity = document.createElement("div");
                                    newActivity.classList.add("newActivity");
                                    newActivity.setAttribute("univoco", dati.univoco);
                                    newActivity.innerHTML = template;
                                    newActivity.setAttribute("sport", dati.sport);
                                    newActivity.classList.add(`${dati.sport}`);
                                    this._insertActivitySorted(inserisci, newActivity, dati.inizio);
                                    const prenotato=newActivity.querySelector(".prenotazione");
                                    newActivity.addEventListener("click", () => {
                                        fetch("/insertPrenotazione", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                username,
                                                univoco: dati.univoco,
                                                giorno: dati.giorno,
                                                sport: dati.sport,
                                                inizio: dati.inizio,
                                                fine: dati.fine,
                                                numerogiorno: dati.numerogiorno,
                                                mese: dati.mese,
                                                anno: dati.anno,
                                            })
                                        }).then(res => res.json()).then(data => {
                                            if (data.success) {
                                                prenotato.innerHTML="prenotato";
                                                const template = `
                                                    <div class="toast-content">
                                                        <h4>Lezione Prenotata</h4>
                                                        <p>L'utente ha appena effetuato una prenotazione.</p>
                                                    </div>
                                                    <button class="toast-close" aria-label="Chiudi">X</button>
                                                `;
                                                const newElem = document.createElement("div");
                                                newElem.classList.add("toast-container");
                                                newElem.innerHTML = template;
                                                document.body.appendChild(newElem);
                                                const close = newElem.querySelector(".toast-close");
                                                close.addEventListener("click", () => {
                                                    newElem.remove();
                                                })

                                            }
                                            else {
                                                if (data.presente) {
                                                    const template = `
                                                        <div class="toast-content">
                                                            <h4>Prenotazione non effettuata</h4>
                                                            <p>Impossibile prenotare: l'utente è gia prenotato</p>
                                                        </div>
                                                        <button class="toast-close" aria-label="Chiudi">X</button>
                                                    `;
                                                    const newElem = document.createElement("div");
                                                    newElem.classList.add("toast-container");
                                                    newElem.innerHTML = template;
                                                    document.body.appendChild(newElem);
                                                    const close = newElem.querySelector(".toast-close");
                                                    close.addEventListener("click", () => {
                                                        newElem.remove();
                                                    })
                                                }
                                                else {
                                                    const template = `
                                                        <div class="toast-content">
                                                            <h4>Prenotazione non effettuata</h4>
                                                            <p>Impossibile prenotare: l'orario selezionato è già passato</p>
                                                        </div>
                                                        <button class="toast-close" aria-label="Chiudi">X</button>
                                                    `;
                                                    const newElem = document.createElement("div");
                                                    newElem.classList.add("toast-container");
                                                    newElem.innerHTML = template;
                                                    document.body.appendChild(newElem);
                                                    const close = newElem.querySelector(".toast-close");
                                                    close.addEventListener("click", () => {
                                                        newElem.remove();
                                                    })
                                                }
                                            }
                                        })
                                    })
                                }
                            }
                        }
                    })
                }
            })
            socket.on("removePrenotazione", (dati) => {
                if (username === dati.username) {
                    const template = `
                           <div class="toast-content">
                               <h4>Prenotazione è stata cancellata</h4>
                               <p>giorno: ${dati.numerogiorno} ${dati.mese} ${dati.anno}, inizio: ${dati.inizio}, fine: ${dati.fine}</p>
                           </div>
                           <button class="toast-close" aria-label="Chiudi">X</button>
                       `;
                    const newElem = document.createElement("div");
                    newElem.classList.add("toast-container");
                    newElem.innerHTML = template;
                    document.body.appendChild(newElem);
                    const close = newElem.querySelector(".toast-close");
                    close.addEventListener("click", () => {
                        newElem.remove();
                    })
                    if (this.$prenotazione) {
                        const rimuovi = this.$prenotazione.querySelector(`.numeroPrenotazioni>[univoco="${dati.univoco}"]`);
                        rimuovi.remove();

                    }
                    const prenotato=document.querySelector(`.newActivity[univoco="${dati.univoco}"]>.prenotazione`);
                    prenotato.innerHTML="non prenotato";
                }
                else if (this.$ruolo === "admin") {

                    if (this.$prenotazioneAdmin && this.$prenotazioneAdmin.getAttribute("univoco") == dati.univoco) {
                        const rimuovi = this.$prenotazioneAdmin.querySelector(`.All_user>.utente[nome="${dati.username}"]`);
                        rimuovi.remove();
                    }
                }
                else {
                    if (this.$prenotazionepersonal && this.$prenotazionepersonal.getAttribute("univoco") == dati.univoco) {
                        const rimuovi = this.$prenotazionepersonal.querySelector(`.All_user>.utente[nome="${dati.username}"]`);
                        rimuovi.remove();
                    }
                }
            })
            socket.on("insertPrenotazione", (dati) => {
                if (username === dati.username) {

                    if (this.$prenotazione) {
                        const inserisci = this.$prenotazione.querySelector(".numeroPrenotazioni");
                        const template = `
                                <h3>${dati.sport}</h3>
                                <p class="data">${dati.numerogiorno} ${dati.mese} ${dati.anno}</p>
                                <p class="giorno">${dati.giorno}</p>
                                <p class="ora">${dati.inizio}-${dati.fine}</p>
                                <div giorno="${dati.giorno}" inizio="${dati.inizio}" fine="${dati.fine}" univoco="${dati.univoco}" numerogiorno="${dati.numerogiorno}" mese="${dati.mese}" anno="${dati.anno}" class="X">X</div>
                        `
                        /*<div univoco="${elem.univoco}" class="newPrenotazione">*/
                        const newPrenotazione = document.createElement("div");
                        newPrenotazione.innerHTML = template;
                        newPrenotazione.classList.add("newPrenotazione");
                        newPrenotazione.setAttribute("univoco", dati.univoco);
                        inserisci.appendChild(newPrenotazione);
                        const close = newPrenotazione.querySelector(".X");
                        close.addEventListener("click", () => {
                            fetch("/removePrenotazione", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    username,
                                    univoco: dati.univoco,
                                    numerogiorno: dati.numerogiorno,
                                    mese: dati.mese,
                                    anno: dati.anno,
                                    giorno: dati.giorno,
                                    inizio: dati.inizio,
                                    fine: dati.fine,
                                    admin: false,
                                })
                            }).then(res => res.json()).then(data => { });
                        })
                    }
                }
                else if (this.$ruolo === "admin") {
                    if (this.$prenotazioneAdmin && this.$prenotazioneAdmin.getAttribute("univoco") == dati.univoco) {
                        const insert = this.$prenotazioneAdmin.querySelector(".All_user");
                        const template = `
                            <div class="nome">${dati.username}</div>
                            <button nome="${dati.username}">CANCELLA</button>
                        `
                        const newUser = document.createElement("div");
                        newUser.classList.add("utente");
                        newUser.setAttribute("nome", dati.username);
                        newUser.innerHTML = template;
                        insert.appendChild(newUser);
                        const cancella = newUser.querySelector("button");
                        cancella.addEventListener("click", () => {
                            fetch("/removePrenotazione", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    username: dati.username,
                                    univoco: dati.univoco,
                                    numerogiorno: dati.numerogiorno,
                                    mese: dati.mese,
                                    anno: dati.anno,
                                    giorno: dati.giorno,
                                    inizio: dati.inizio,
                                    fine: dati.fine,
                                    admin: true,
                                })
                            }).then(res => res.json()).then(data => {
                                if (data.success) {
                                    const template = `
                                                    <div class="toast-content">
                                                        <h4>utente cancellato</h4>
                                                        <p>È stato cancellato una prenotazione</p>
                                                    </div>
                                                    <button class="toast-close" aria-label="Chiudi">X</button>
                                                `;
                                    const newElem = document.createElement("div");
                                    newElem.classList.add("toast-container");
                                    newElem.innerHTML = template;
                                    document.body.appendChild(newElem);
                                    const close = newElem.querySelector(".toast-close");
                                    close.addEventListener("click", () => {
                                        newElem.remove();
                                    })

                                }
                                else {
                                    const template = `
                                                    <div class="toast-content">
                                                        <h4>Cancellazione non effettuata</h4>
                                                        <p>Impossibile cancellare: l'orario selezionato è già passato</p>
                                                    </div>
                                                    <button class="toast-close" aria-label="Chiudi">X</button>
                                                `;
                                    const newElem = document.createElement("div");
                                    newElem.classList.add("toast-container");
                                    newElem.innerHTML = template;
                                    document.body.appendChild(newElem);
                                    const close = newElem.querySelector(".toast-close");
                                    close.addEventListener("click", () => {
                                        newElem.remove();
                                    })
                                }
                            });
                        })
                    }
                }
                else {
                    if (this.$prenotazionepersonal && this.$prenotazionepersonal.getAttribute("univoco") == dati.univoco) {
                        const insert = this.$prenotazionepersonal.querySelector(".All_user");
                        const template = `
                            <div class="nome">${dati.username}</div>
                        `
                        const newUser = document.createElement("div");
                        newUser.classList.add("utente");
                        newUser.setAttribute("nome", dati.username);
                        newUser.innerHTML = template;
                        insert.appendChild(newUser);

                    }
                }
            })
            socket.on("rimuoviAttivita", (dati) => {

                const rimuovi = this.$container_principale.querySelector(`[settimana="${dati.giorno}"]>.PrenotazioniGiorno>[univoco="${dati.univoco}"]`);
                rimuovi.remove();
                if (this.$prenotazioneAdmin && this.$prenotazioneAdmin.getAttribute("univoco") == dati.univoco) {
                    this.$prenotazioneAdmin.remove();
                    this.$prenotazioneAdmin = null;
                }
                if (this.$prenotazionepersonal && this.$prenotazionepersonal.getAttribute("univoco") == dati.univoco) {
                    this.$prenotazionepersonal.remove();
                    this.$prenotazionepersonal = null;
                }
                if (this.$ruolo === "personal trainer" && dati.admin) {
                    const template = `
                        <div class="toast-content">
                            <h4>Attivita è stata cancellata</h4>
                            <p>giorno: ${dati.numerogiorno} ${dati.mese} ${dati.anno}, inizio: ${dati.inizio}, fine: ${dati.fine}</p>
                        </div>
                        <button class="toast-close" aria-label="Chiudi">X</button>
                    `;
                    const newElem = document.createElement("div");
                    newElem.classList.add("toast-container");
                    newElem.innerHTML = template;
                    document.body.appendChild(newElem);
                    const close = newElem.querySelector(".toast-close");
                    close.addEventListener("click", () => {
                        newElem.remove();
                    })
                }
            })
        })
    },
    /*const mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno','Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];*/
    _orario: function (username, elemento, elemento2) {
        if (!this.$calendario) {
            elemento.classList.remove("no-focus");
            this.$calendario = true;
            this._createCalendar(elemento, username, elemento2);
            const right = elemento.querySelector(".header>.successivo");
            const left = elemento.querySelector(".header>.precedente");
            right.addEventListener("click", () => {
                this.$currentDay.setMonth(this.$currentDay.getMonth() + 1);
                this._createCalendar(elemento, username, elemento2);
            });
            left.addEventListener("click", () => {
                this.$currentDay.setMonth(this.$currentDay.getMonth() - 1);
                this._createCalendar(elemento, username, elemento2);
            });
        }
        else {
            elemento.classList.add("no-focus");
            this.$calendario = false;
        }
    },

    _createCalendar: function (elemento, username, elemento2) {
        const mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
        const insertMese = elemento.querySelector(".mese");
        const nomeMese = mesi[this.$currentDay.getMonth()];
        const anno = this.$currentDay.getFullYear();
        const mese = this.$currentDay.getMonth();
        insertMese.innerHTML = `${nomeMese} ${anno}`;
        const firstDay = new Date(anno, mese, 1);
        const lastDay = new Date(anno, mese + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        const inserisci = elemento.querySelector(".calendario-grid");
        const giorni = inserisci.querySelectorAll(".calendario-day-header");
        inserisci.innerHTML = "";
        for (const elem of giorni) {
            inserisci.appendChild(elem);
        }
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i)
            const newElem = document.createElement("div");
            newElem.classList.add("calendario-day");
            if (date.getMonth() != mese) {
                newElem.classList.add("other-month");
            }
            if (this._isToday(date)) {
                newElem.classList.add(`today`);
            }
            if (this._isSameDate(date, this.$selectedday)) {
                newElem.classList.add(`selected`);
            }
            newElem.innerHTML = date.getDate();
            newElem.setAttribute("giorno", date.getDate());
            newElem.setAttribute("mese", date.getMonth());
            newElem.setAttribute("anno", date.getFullYear());
            newElem.setAttribute("settimana", date.getDay());
            inserisci.appendChild(newElem);
            newElem.addEventListener("click", () => {
                this._selected(elemento, newElem, username, elemento2);
            })
        }

    },
    _selected: function (elemento, newElem, username, elemento2) {
        elemento.classList.add("no-focus");
        this.$calendario = false;
        const dataselezionata = elemento.querySelector(".calendario-grid>.calendario-day.selected");
        if (dataselezionata) {
            dataselezionata.classList.remove("selected");
        }
        newElem.classList.add("selected");

        /*elemento.classList.add("no-focus");
            this.$calendario = false;*/
        const giorno1 = parseInt(newElem.getAttribute("giorno"));
        const mese1 = parseInt(newElem.getAttribute("mese"));
        const anno1 = parseInt(newElem.getAttribute("anno"));
        const settimana1 = parseInt(newElem.getAttribute("settimana"));
        const nomeSettimana1 = this._getSettimana(settimana1);
        const nomeMese1 = this._getMese(mese1);
        this.$selectedday = new Date(anno1, mese1, giorno1);
        const calendar = elemento2.querySelector(".calendario_view");
        calendar.innerHTML = `${giorno1} ${nomeMese1} ${anno1}`;

        const giorno2 = this._getDay(giorno1, mese1);
        const settimana2 = this._getSettimanaNumber(settimana1);
        const nomeSettimana2 = this._getSettimana(settimana2);
        const mese2 = this._getMeseNumber(giorno1, mese1);
        const nomeMese2 = this._getMese(mese2);
        const anno2 = this._getAnno(giorno1, mese1, anno1);

        const giorno3 = this._getDay(giorno2, mese2);
        const settimana3 = this._getSettimanaNumber(settimana2);
        const nomeSettimana3 = this._getSettimana(settimana3);
        const mese3 = this._getMeseNumber(giorno2, mese2);
        const nomeMese3 = this._getMese(mese3);
        const anno3 = this._getAnno(giorno2, mese2, anno2);

        const giorno4 = this._getDay(giorno3, mese3);
        const settimana4 = this._getSettimanaNumber(settimana3);
        const nomeSettimana4 = this._getSettimana(settimana4);
        const mese4 = this._getMeseNumber(giorno3, mese3);
        const nomeMese4 = this._getMese(mese4);
        const anno4 = this._getAnno(giorno3, mese3, anno3);

        const giorno5 = this._getDay(giorno4, mese4);
        const settimana5 = this._getSettimanaNumber(settimana4);
        const nomeSettimana5 = this._getSettimana(settimana5);
        const mese5 = this._getMeseNumber(giorno4, mese4);
        const nomeMese5 = this._getMese(mese5);
        const anno5 = this._getAnno(giorno4, mese4, anno4);

        const giorno6 = this._getDay(giorno5, mese5);
        const settimana6 = this._getSettimanaNumber(settimana5);
        const nomeSettimana6 = this._getSettimana(settimana6);
        const mese6 = this._getMeseNumber(giorno5, mese5);
        const nomeMese6 = this._getMese(mese6);
        const anno6 = this._getAnno(giorno5, mese5, anno5);

        const giorno7 = this._getDay(giorno6, mese6);
        const settimana7 = this._getSettimanaNumber(settimana6);
        const nomeSettimana7 = this._getSettimana(settimana7);
        const mese7 = this._getMeseNumber(giorno6, mese6);
        const nomeMese7 = this._getMese(mese7);
        const anno7 = this._getAnno(giorno6, mese6, anno6);
        if (this.$ruolo === "personal trainer") {
            const template = `
                <div settimana="${nomeSettimana1}" giorno="${giorno1}" mese="${nomeMese1}" anno="${anno1}" class="giorno1">
                    <div  class="giorno">
                        <h1>${nomeSettimana1}</h1>
                        <p>${giorno1} ${nomeMese1} ${anno1}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana2}" giorno="${giorno2}" mese="${nomeMese2}" anno="${anno2}" class="giorno2">
                    <div class="giorno">
                        <h1>${nomeSettimana2}</h1>
                        <p>${giorno2} ${nomeMese2} ${anno2}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana3}" giorno="${giorno3}" mese="${nomeMese3}" anno="${anno3}" class="giorno3">
                    <div class="giorno">
                        <h1>${nomeSettimana3}</h1>
                        <p>${giorno3} ${nomeMese3} ${anno3}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana4}" giorno="${giorno4}" mese="${nomeMese4}" anno="${anno4}" class="giorno4">
                    <div class="giorno">
                        <h1>${nomeSettimana4}</h1>
                        <p>${giorno4} ${nomeMese4} ${anno4}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana5}" giorno="${giorno5}" mese="${nomeMese5}" anno="${anno5}" class="giorno5">
                    <div class="giorno">
                        <h1>${nomeSettimana5}</h1>
                        <p>${giorno5} ${nomeMese5} ${anno5}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana6}" giorno="${giorno6}" mese="${nomeMese6}" anno="${anno6}" class="giorno6">
                    <div class="giorno">
                        <h1>${nomeSettimana6}</h1>
                        <p>${giorno6} ${nomeMese6} ${anno6}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana7}" giorno="${giorno7}" mese="${nomeMese7}" anno="${anno7}" class="giorno7">
                    <div class="giorno">
                        <h1>${nomeSettimana7}</h1>
                        <p>${giorno7} ${nomeMese7} ${anno7}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div class="button">
                    <button>Aggiungi</button>
                </div>
            `;
            const nomemese = this._getMese(this.$primomese);
            this.$container_principale.remove();
            const newElem = document.createElement("div");
            newElem.innerHTML = template;
            newElem.classList.add("container-principale");
            newElem.classList.add("grid");
            document.body.appendChild(newElem);
            this.$container_principale = newElem;
            const buttonAggiungi = document.querySelector(".container-principale>.button>button");
            fetch("/riempi", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(res => res.json()).then(data => {
                for (const elem of data.attivita) {

                    const inserisci = this.$container_principale.querySelector(`[settimana="${elem.giorno}"][giorno="${elem.numerogiorno}"][mese="${elem.mese}"][anno="${elem.anno}"]>.PrenotazioniGiorno`);
                    if (inserisci) {
                        const template = `
                            <h3>${elem.sport}</h3>
                            <p>${elem.inizio}-${elem.fine}</p>
                        `;
                        const newActivity = document.createElement("div");
                        newActivity.classList.add("newActivity");
                        newActivity.setAttribute("univoco", elem.univoco);
                        newActivity.innerHTML = template;
                        newActivity.setAttribute("sport", elem.sport);
                        newActivity.classList.add(`${elem.sport}`);
                        this._insertActivitySorted(inserisci, newActivity, elem.inizio);
                        if (elem.username === username) {
                            newActivity.addEventListener("click", () => {
                                fetch("/prendiClienti", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        univoco: elem.univoco,
                                    })
                                }).then(res => res.json()).then(data => {
                                    let template = `
                                        <div class="All_user">
                                    `;
                                    for (const elem of data.db) {
                                        template += `
                                            <div nome="${elem.username}" class="utente">
                                                <div class="nome">${elem.username}</div>
                                            </div>
                                        `;
                                    }
                                    template += `
                                        </div>
                                        <button class="Cancella">CANCELLA PRENOTAZIONE</button>
                                        <div class="X">X</div>
                                    `;
                                    const PrenotazionePersonal = document.createElement("div");
                                    PrenotazionePersonal.innerHTML = template;
                                    PrenotazionePersonal.setAttribute("univoco", elem.univoco);
                                    PrenotazionePersonal.classList.add("PrenotazionePersonal");
                                    document.body.appendChild(PrenotazionePersonal);
                                    this.$prenotazionepersonal = PrenotazionePersonal;
                                    const CancellaPrenotazione = PrenotazionePersonal.querySelector(".Cancella");
                                    const close = PrenotazionePersonal.querySelector(".X");
                                    close.addEventListener("click", () => {
                                        this.$prenotazionepersonal.remove();
                                        this.$prenotazionepersonal = null;
                                    })
                                    CancellaPrenotazione.addEventListener("click", () => {
                                        fetch("/rimuoviAttivita", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                giorno: elem.giorno,
                                                univoco: elem.univoco,
                                                inizio: elem.inizio,
                                                fine: elem.fine,
                                                admin: false,
                                            })
                                        }).then(res => res.json()).then(data => {
                                            if (data.success) {
                                                const template = `
                                                        <div class="toast-content">
                                                            <h4>Lezione cancellata</h4>
                                                            <p>È stato cancellato una prenotazione</p>
                                                        </div>
                                                        <button class="toast-close" aria-label="Chiudi">X</button>
                                                    `;
                                                const newElem = document.createElement("div");
                                                newElem.classList.add("toast-container");
                                                newElem.innerHTML = template;
                                                document.body.appendChild(newElem);
                                                const close = newElem.querySelector(".toast-close");
                                                close.addEventListener("click", () => {
                                                    newElem.remove();
                                                })
                                                //this.$prenotazionepersonal.remove();
                                                //this.$prenotazionepersonal = null;

                                            }
                                            else {
                                                const template = `
                                                        <div class="toast-content">
                                                            <h4>Cancellazione non effettuata</h4>
                                                            <p>Impossibile cancelare: l'orario selezionato è già passato</p>
                                                        </div>
                                                        <button class="toast-close" aria-label="Chiudi">X</button>
                                                    `;
                                                const newElem = document.createElement("div");
                                                newElem.classList.add("toast-container");
                                                newElem.innerHTML = template;
                                                document.body.appendChild(newElem);
                                                const close = newElem.querySelector(".toast-close");
                                                close.addEventListener("click", () => {
                                                    newElem.remove();
                                                })
                                            }
                                        });
                                    })
                                })
                            })
                        }
                    }
                }
            })
            buttonAggiungi.addEventListener("click", () => {
                if (!this.$newLesson) {
                    fetch("/prendiSport", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username,
                        })
                    }).then(res => res.json()).then(data => {
                        let template = `
                            <div class="errore no-focus">
                                <div class="errore_vuoti no-focus">inserisci tutti i campi</div>
                                <div class="errore_orario no-focus">Orari occupati o errati</div> 
                            </div>
                        `;
                        for (const elem of data.db) {
                            template += `<label><input type="radio" name="newAttivita" class="newAttivita" value="${elem}" />${elem}</label>`
                        }
                        template += `
                            <div class="numerogiorno">
                                <span>Giorno</span> <br />
                                <input type="date" class="numerogiorno_input"/>
                            </div>
                            <div class="tempo">
                                <span class="da">da</span><span class="a">a</span> <br />
                                <input type="time" class="inizio" />
                                <input type="time" class="fine" />
                            </div>
                            <button>CONTINUA</button>
                            <div class="X">X</div>
                        `
                        const newLesson = document.createElement("div");
                        newLesson.innerHTML = template;
                        newLesson.classList.add("newLesson");
                        document.body.appendChild(newLesson);
                        this.$newLesson = newLesson;
                        const errore = newLesson.querySelector(".errore");
                        const errore_vuoti = newLesson.querySelector(".errore>.errore_vuoti");
                        const errore_orario = newLesson.querySelector(".errore>.errore_orario");
                        const ButtonNewActivity = newLesson.querySelector("button");
                        const tempoinizio = newLesson.querySelector(".tempo>.inizio");
                        const tempofine = newLesson.querySelector(".tempo>.fine");
                        const calendario = newLesson.querySelector(".numerogiorno>.numerogiorno_input");
                        const chiudi = newLesson.querySelector(".X");
                        chiudi.addEventListener("click", () => {
                            newLesson.remove();
                            this.$newLesson = null;
                        })
                        ButtonNewActivity.addEventListener("click", () => {

                            const selectedActivity = newLesson.querySelector('input[name="newAttivita"]:checked');
                            if (selectedActivity && tempoinizio.value != "" && tempofine.value != "" && calendario.value != "") {
                                let inizio = parseFloat(tempoinizio.value.replace(":", "."));

                                let fine = parseFloat(tempofine.value.replace(":", "."));

                                let [anno, mese, numerogiorno] = calendario.value.split("-");
                                anno = parseInt(anno);
                                mese = parseInt(mese);
                                numerogiorno = parseInt(numerogiorno);
                                mese--;
                                const ora = Math.floor(inizio);                  // 14
                                const minuti = Math.round((inizio % 1) * 100);
                                const oggi = new Date();
                                const newdata = new Date(anno, mese, numerogiorno, ora, minuti);
                                //if (anno > this.$primoanno || (anno === this.$primoanno && (mese > this.$primomese || (mese === this.$primomese && numerogiorno >= this.$primogiorno)))) {
                                if (newdata >= oggi) {
                                    const giorno = this._getDayOfWeek(numerogiorno, mese, anno);
                                    const nomemese = this._getMese(mese);
                                    fetch("/newAttivita", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            username,
                                            sport: selectedActivity.value,
                                            giorno,
                                            numerogiorno,
                                            mese: nomemese,
                                            anno,
                                            inizio,
                                            fine,
                                            univoco: Date.now(),
                                        })
                                    }).then(res => res.json()).then(data => {
                                        if (data.success) {
                                            const template = `
                                            <div class="toast-content">
                                                <h4>Lezione creata</h4>
                                                <p>È stata registrata una nuova prenotazione.</p>
                                            </div>
                                            <button class="toast-close">X</button>`
                                            const newElem = document.createElement("div");
                                            newElem.classList.add("toast-container");
                                            newElem.innerHTML = template;
                                            document.body.appendChild(newElem);
                                            const close = newElem.querySelector(".toast-close");
                                            close.addEventListener("click", () => {
                                                newElem.remove();
                                            })

                                            newLesson.remove();
                                            this.$newLesson = null;
                                        }
                                        else {
                                            errore.classList.remove("no-focus");
                                            errore_vuoti.classList.add("no-focus");
                                            errore_orario.classList.remove("no-focus");
                                        }
                                    })
                                } else {
                                    errore.classList.remove("no-focus");
                                    errore_vuoti.classList.add("no-focus");
                                    errore_orario.classList.remove("no-focus");
                                }

                            }
                            else {
                                errore.classList.remove("no-focus");
                                errore_vuoti.classList.remove("no-focus");
                                errore_orario.classList.add("no-focus");
                            }
                        });
                    })
                }
            })
        }
        else if (this.$ruolo === "cliente") {
            const template = `
                <div settimana="${nomeSettimana1}" giorno="${giorno1}" mese="${nomeMese1}" anno="${anno1}" class="giorno1">
                    <div  class="giorno">
                        <h1>${nomeSettimana1}</h1>
                        <p>${giorno1} ${nomeMese1} ${anno1}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana2}" giorno="${giorno2}" mese="${nomeMese2}" anno="${anno2}" class="giorno2">
                    <div class="giorno">
                        <h1>${nomeSettimana2}</h1>
                        <p>${giorno2} ${nomeMese2} ${anno2}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana3}" giorno="${giorno3}" mese="${nomeMese3}" anno="${anno3}" class="giorno3">
                    <div class="giorno">
                        <h1>${nomeSettimana3}</h1>
                        <p>${giorno3} ${nomeMese3} ${anno3}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana4}" giorno="${giorno4}" mese="${nomeMese4}" anno="${anno4}" class="giorno4">
                    <div class="giorno">
                        <h1>${nomeSettimana4}</h1>
                        <p>${giorno4} ${nomeMese4} ${anno4}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana5}" giorno="${giorno5}" mese="${nomeMese5}" anno="${anno5}" class="giorno5">
                    <div class="giorno">
                        <h1>${nomeSettimana5}</h1>
                        <p>${giorno5} ${nomeMese5} ${anno5}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana6}" giorno="${giorno6}" mese="${nomeMese6}" anno="${anno6}" class="giorno6">
                    <div class="giorno">
                        <h1>${nomeSettimana6}</h1>
                        <p>${giorno6} ${nomeMese6} ${anno6}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana7}" giorno="${giorno7}" mese="${nomeMese7}" anno="${anno7}" class="giorno7">
                    <div class="giorno">
                        <h1>${nomeSettimana7}</h1>
                        <p>${giorno7} ${nomeMese7} ${anno7}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div class="button">
                    <button>Prenotazioni</button>
                </div>
            `;
            this.$container_principale.remove();
            const newElem = document.createElement("div");
            newElem.innerHTML = template;
            newElem.classList.add("container-principale");
            newElem.classList.add("grid");
            document.body.appendChild(newElem);
            this.$container_principale = newElem;
            const buttonAggiungi = document.querySelector(".container-principale>.button>button");
            fetch("/riempiClienti", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                })
            }).then(res => res.json()).then(data => {
                for (const elem of data.db) {
                    const inserisci = this.$container_principale.querySelector(`[settimana="${elem.giorno}"][giorno="${elem.numerogiorno}"][mese="${elem.mese}"][anno="${elem.anno}"]>.PrenotazioniGiorno`);
                    if (inserisci) {
                        const template = `
                            <h3>${elem.sport}</h3>
                            <p class="cliente prenotazione">${(elem.prenotato===1 ? "prenotato": "non prenotato")}</p>
                            <p class="cliente">${elem.inizio}-${elem.fine}</p>
                        `;
                        const newActivity = document.createElement("div");
                        newActivity.classList.add("newActivity");
                        newActivity.setAttribute("univoco", elem.univoco);
                        newActivity.innerHTML = template;
                        newActivity.setAttribute("sport", elem.sport);
                        newActivity.classList.add(`${elem.sport}`);
                        this._insertActivitySorted(inserisci, newActivity, elem.inizio);
                        const prenotato=newActivity.querySelector(".prenotazione");
                        newActivity.addEventListener("click", () => {
                            fetch("/insertPrenotazione", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    username,
                                    univoco: elem.univoco,
                                    giorno: elem.giorno,
                                    sport: elem.sport,
                                    inizio: elem.inizio,
                                    numerogiorno: elem.numerogiorno,
                                    mese: elem.mese,
                                    anno: elem.anno,
                                    fine: elem.fine,
                                })
                            }).then(res => res.json()).then(data => {
                                if (data.success) {
                                    prenotato.innerHTML="prenotato";
                                    const template = `
                                         <div class="toast-content">
                                             <h4>Lezione Prenotata</h4>
                                             <p>L'utente ha appena effetuato una prenotazione.</p>
                                         </div>
                                         <button class="toast-close" aria-label="Chiudi">X</button>
                                     `;
                                    const newElem = document.createElement("div");
                                    newElem.classList.add("toast-container");
                                    newElem.innerHTML = template;
                                    document.body.appendChild(newElem);
                                    const close = newElem.querySelector(".toast-close");
                                    close.addEventListener("click", () => {
                                        newElem.remove();
                                    })

                                }
                                else {
                                    if (data.presente) {
                                        const template = `
                                        <div class="toast-content">
                                            <h4>Prenotazione non effettuata</h4>
                                            <p>Impossibile prenotare: l'utente è gia prenotato</p>
                                        </div>
                                        <button class="toast-close" aria-label="Chiudi">X</button>
                                    `;
                                        const newElem = document.createElement("div");
                                        newElem.classList.add("toast-container");
                                        newElem.innerHTML = template;
                                        document.body.appendChild(newElem);
                                        const close = newElem.querySelector(".toast-close");
                                        close.addEventListener("click", () => {
                                            newElem.remove();
                                        })
                                    }
                                    else {
                                        const template = `
                                            <div class="toast-content">
                                                <h4>Prenotazione non effettuata</h4>
                                                <p>Impossibile prenotare: l'orario selezionato è già passato</p>
                                            </div>
                                            <button class="toast-close" aria-label="Chiudi">X</button>
                                        `;
                                        const newElem = document.createElement("div");
                                        newElem.classList.add("toast-container");
                                        newElem.innerHTML = template;
                                        document.body.appendChild(newElem);
                                        const close = newElem.querySelector(".toast-close");
                                        close.addEventListener("click", () => {
                                            newElem.remove();
                                        })
                                    }
                                }
                            })
                        })
                    }
                }
            })
            buttonAggiungi.addEventListener("click", () => {
                if (!this.$prenotazione) {
                    fetch("/prendiPrenotazioni", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username,
                        })
                    }).then(res => res.json()).then(data => {
                        let template = `<div class="numeroPrenotazioni">`;
                        for (const elem of data.db) {
                            template += `
                            <div univoco="${elem.univoco}" class="newPrenotazione">
                                <h3>${elem.sport}</h3>
                                <p class="data">${elem.numerogiorno} ${elem.mese} ${elem.anno}</p>
                                <p class="giorno">${elem.giorno}</p>
                                <p class="ora">${elem.inizio}-${elem.fine}</p>
                                <div giorno="${elem.giorno}" inizio="${elem.inizio}" fine="${elem.fine}" univoco="${elem.univoco}" numerogiorno="${elem.numerogiorno}" mese="${elem.mese}" anno="${elem.anno}" class="X">X</div>
                            </div>
                        `
                        }
                        template += `
                        </div>
                        <button>chiudi</button>
                    `;
                        const prenotazioni = document.createElement("div");
                        prenotazioni.innerHTML = template;
                        prenotazioni.classList.add("Prenotazioni");
                        document.body.appendChild(prenotazioni);
                        this.$prenotazione = prenotazioni;
                        const close = prenotazioni.querySelectorAll(".numeroPrenotazioni>.newPrenotazione>.X");
                        const finePrenotazioni = prenotazioni.querySelector("button");
                        finePrenotazioni.addEventListener("click", () => {
                            prenotazioni.remove();
                            this.$prenotazione = null;
                        })
                        for (const elem of close) {
                            elem.addEventListener("click", () => {
                                fetch("/removePrenotazione", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        username,
                                        numerogiorno: elem.getAttribute("numerogiorno"),
                                        mese: elem.getAttribute("mese"),
                                        anno: elem.getAttribute("anno"),
                                        univoco: elem.getAttribute("univoco"),
                                        giorno: elem.getAttribute("giorno"),
                                        inizio: elem.getAttribute("inizio"),
                                        fine: elem.getAttribute("fine"),
                                        admin: false,
                                    })
                                }).then(res => res.json()).then(data => {

                                });
                            })
                        }
                    })
                }
            })
        }
        else {
            const template = `
                <div settimana="${nomeSettimana1}" giorno="${giorno1}" mese="${nomeMese1}" anno="${anno1}" class="giorno1">
                    <div  class="giorno">
                        <h1>${nomeSettimana1}</h1>
                        <p>${giorno1} ${nomeMese1} ${anno1}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana2}" giorno="${giorno2}" mese="${nomeMese2}" anno="${anno2}" class="giorno2">
                    <div class="giorno">
                        <h1>${nomeSettimana2}</h1>
                        <p>${giorno2} ${nomeMese2} ${anno2}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana3}" giorno="${giorno3}" mese="${nomeMese3}" anno="${anno3}" class="giorno3">
                    <div class="giorno">
                        <h1>${nomeSettimana3}</h1>
                        <p>${giorno3} ${nomeMese3} ${anno3}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana4}" giorno="${giorno4}" mese="${nomeMese4}" anno="${anno4}" class="giorno4">
                    <div class="giorno">
                        <h1>${nomeSettimana4}</h1>
                        <p>${giorno4} ${nomeMese4} ${anno4}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana5}" giorno="${giorno5}" mese="${nomeMese5}" anno="${anno5}" class="giorno5">
                    <div class="giorno">
                        <h1>${nomeSettimana5}</h1>
                        <p>${giorno5} ${nomeMese5} ${anno5}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana6}" giorno="${giorno6}" mese="${nomeMese6}" anno="${anno6}" class="giorno6">
                    <div class="giorno">
                        <h1>${nomeSettimana6}</h1>
                        <p>${giorno6} ${nomeMese6} ${anno6}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
                <div settimana="${nomeSettimana7}" giorno="${giorno7}" mese="${nomeMese7}" anno="${anno7}" class="giorno7">
                    <div class="giorno">
                        <h1>${nomeSettimana7}</h1>
                        <p>${giorno7} ${nomeMese7} ${anno7}</p>
                    </div>
                    <div class="PrenotazioniGiorno"></div>
                </div>
            `;
            this.$container_principale.remove();
            const newElem = document.createElement("div");
            newElem.innerHTML = template;
            newElem.classList.add("container-principale");
            newElem.classList.add("grid");
            document.body.appendChild(newElem);
            this.$container_principale = newElem;
            fetch("/riempi", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(res => res.json()).then(data => {
                for (const elem of data.attivita) {
                    const inserisci = this.$container_principale.querySelector(`[settimana="${elem.giorno}"][giorno="${elem.numerogiorno}"][mese="${elem.mese}"][anno="${elem.anno}"]>.PrenotazioniGiorno`);
                    if (inserisci) {
                        const template = `
                            <h3>${elem.sport}</h3>
                            <p>${elem.inizio}-${elem.fine}</p>
                        `;
                        const newActivity = document.createElement("div");
                        newActivity.classList.add("newActivity");
                        newActivity.setAttribute("univoco", elem.univoco);
                        newActivity.innerHTML = template;
                        newActivity.setAttribute("sport", elem.sport);
                        newActivity.classList.add(`${elem.sport}`);
                        this._insertActivitySorted(inserisci, newActivity, elem.inizio);
                        newActivity.addEventListener("click", () => {
                            if (!this.$prenotazioneAdmin) {
                                fetch("/prendiClienti", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        univoco: elem.univoco,
                                    })
                                }).then(res => res.json()).then(data => {
                                    let template = `
                                    <div class="All_user">
                                `;
                                    for (const iterato of data.db) {
                                        template += `
                                        <div nome="${iterato.username}" class="utente">
                                            <div class="nome">${iterato.username}</div>
                                            <button nome="${iterato.username}">CANCELLA</button>
                                        </div>
                                    `;
                                    }
                                    template += `
                                    </div>
                                    <button class="Cancella">CANCELLA PRENOTAZIONE</button>
                                    <div class="X">X</div>
                                `;
                                    const PrenotazioneAdmin = document.createElement("div");
                                    PrenotazioneAdmin.innerHTML = template;
                                    PrenotazioneAdmin.setAttribute("univoco", elem.univoco);
                                    PrenotazioneAdmin.classList.add("PrenotazioneAdmin");
                                    document.body.appendChild(PrenotazioneAdmin);
                                    this.$prenotazioneAdmin = PrenotazioneAdmin;
                                    const CancellaPrenotazione = PrenotazioneAdmin.querySelector(".Cancella");
                                    const CancellaCliente = PrenotazioneAdmin.querySelectorAll(".All_user>.utente>button");
                                    const close = PrenotazioneAdmin.querySelector(".X");
                                    close.addEventListener("click", () => {
                                        this.$prenotazioneAdmin.remove();
                                        this.$prenotazioneAdmin = null;
                                    })
                                    for (const iterato of CancellaCliente) {
                                        iterato.addEventListener("click", () => {
                                            fetch("/removePrenotazione", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    username: iterato.getAttribute("nome"),
                                                    univoco: elem.univoco,
                                                    numerogiorno: elem.numerogiorno,
                                                    mese: elem.mese,
                                                    anno: elem.anno,
                                                    giorno: elem.giorno,
                                                    inizio: elem.inizio,
                                                    fine: elem.fine,
                                                    admin: true,
                                                })
                                            }).then(res => res.json()).then(data => {
                                                if (data.success) {
                                                    const template = `
                                                    <div class="toast-content">
                                                        <h4>utente cancellato</h4>
                                                        <p>È stato cancellato una prenotazione</p>
                                                    </div>
                                                    <button class="toast-close" aria-label="Chiudi">X</button>
                                                `;
                                                    const newElem = document.createElement("div");
                                                    newElem.classList.add("toast-container");
                                                    newElem.innerHTML = template;
                                                    document.body.appendChild(newElem);
                                                    const close = newElem.querySelector(".toast-close");
                                                    close.addEventListener("click", () => {
                                                        newElem.remove();
                                                    })

                                                }
                                                else {
                                                    const template = `
                                                    <div class="toast-content">
                                                        <h4>Cancellazione non effettuata</h4>
                                                        <p>Impossibile cancellare: l'orario selezionato è già passato</p>
                                                    </div>
                                                    <button class="toast-close" aria-label="Chiudi">X</button>
                                                `;
                                                    const newElem = document.createElement("div");
                                                    newElem.classList.add("toast-container");
                                                    newElem.innerHTML = template;
                                                    document.body.appendChild(newElem);
                                                    const close = newElem.querySelector(".toast-close");
                                                    close.addEventListener("click", () => {
                                                        newElem.remove();
                                                    })
                                                }
                                            });
                                        })
                                    }
                                    CancellaPrenotazione.addEventListener("click", () => {
                                        fetch("/rimuoviAttivita", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                numerogiorno:elem.numerogiorno,
                                                mese:elem.mese,
                                                anno: elem.anno,
                                                giorno: elem.giorno,
                                                univoco: elem.univoco,
                                                inizio: elem.inizio,
                                                fine: elem.fine,
                                                admin: true,
                                            })
                                        }).then(res => res.json()).then(data => {
                                            if (data.success) {
                                                const template = `
                                            <div class="toast-content">
                                                <h4>Lezione cancellata</h4>
                                                <p>È stato cancellato una prenotazione</p>
                                            </div>
                                            <button class="toast-close" aria-label="Chiudi">X</button>
                                        `;
                                                const newElem = document.createElement("div");
                                                newElem.classList.add("toast-container");
                                                newElem.innerHTML = template;
                                                document.body.appendChild(newElem);
                                                const close = newElem.querySelector(".toast-close");
                                                close.addEventListener("click", () => {
                                                    newElem.remove();
                                                })

                                            }
                                            else {
                                                const template = `
                                            <div class="toast-content">
                                                <h4>Cancellazione non effettuata</h4>
                                                <p>Impossibile cancellare: l'orario selezionato è già passato</p>
                                            </div>
                                            <button class="toast-close" aria-label="Chiudi">X</button>
                                        `;
                                                const newElem = document.createElement("div");
                                                newElem.classList.add("toast-container");
                                                newElem.innerHTML = template;
                                                document.body.appendChild(newElem);
                                                const close = newElem.querySelector(".toast-close");
                                                close.addEventListener("click", () => {
                                                    newElem.remove();
                                                })
                                            }
                                        });
                                    })
                                })
                            }
                        })
                    }
                }
            })
        }
    },
    _isToday: function (date) {
        const today = new Date();
        return this._isSameDate(today, date);
    },
    _isSameDate: function (day1, day2) {
        return day1.getDate() === day2.getDate() &&
            day1.getMonth() === day2.getMonth() &&
            day1.getFullYear() === day2.getFullYear();
    },
    _insertActivitySorted: function (container, newActivity, startTime) {
        const existingActivities = container.querySelectorAll('.newActivity');

        // Se non ci sono attività esistenti, aggiungi semplicemente
        if (existingActivities.length === 0) {
            container.appendChild(newActivity);
            return;
        }

        // Converti l'orario in formato numerico per il confronto (es: "10.30" -> 10.30)
        const newStartTime = parseFloat(startTime);

        let inserted = false;

        // Trova la posizione corretta per inserire la nuova attività
        for (let i = 0; i < existingActivities.length; i++) {
            const activity = existingActivities[i];
            const timeText = activity.querySelector('p').textContent;
            const existingStartTime = parseFloat(timeText.split('-')[0].replace(':', '.'));

            // Se la nuova attività inizia prima di quella esistente, inseriscila prima
            if (newStartTime < existingStartTime) {
                container.insertBefore(newActivity, activity);
                inserted = true;
                break;
            }
        }

        // Se non è stata inserita, significa che va alla fine
        if (!inserted) {
            container.appendChild(newActivity);
        }
    },
    _getAnno: function (giorno, mese, anno) {
        giorno++;
        if (mese === 11 && giorno === 32) {
            anno++;
        }
        return anno;
    },
    _getMeseNumber: function (giorno, mese) {
        giorno++;
        switch (mese) {
            case 3:
            case 5:
            case 8:
            case 10:
                if (giorno === 31)
                    mese++;
                break;
            case 2:
                if (giorno === 29)
                    mese++;
                break;
            default:
                if (giorno === 32) {
                    mese++;
                    if (mese === 12) {
                        mese = 0;
                    }
                }
        }
        return mese;

    },

    _getSettimanaNumber: function (settimana) {
        settimana++;
        if (settimana === 7) {
            settimana = 0;
        }
        return settimana;
    },
    _getDay(giorno, mese) {
        giorno++;
        switch (mese) {
            case 3:
            case 5:
            case 8:
            case 10:
                if (giorno === 31)
                    giorno = 1;
                break;
            case 2:
                if (giorno === 29)
                    giorno = 1;
                break;
            default:
                if (giorno === 32)
                    giorno = 1;
        }
        return giorno;
    },
    _getMese: function (mese) {
        switch (mese) {
            case 0:
                return "gen";
            case 1:
                return "feb";
            case 2:
                return "mar";
            case 3:
                return "apr";
            case 4:
                return "mag";
            case 5:
                return "giu";
            case 6:
                return "lug";
            case 7:
                return "ago";
            case 8:
                return "set";
            case 9:
                return "ott";
            case 10:
                return "nov";
            case 11:
                return "dic";
        }
    },
    _getSettimana: function (giorno) {
        switch (giorno) {
            case 0:
                return "Domenica";
            case 1:
                return "Lunedì";
            case 2:
                return "Martedì";
            case 3:
                return "Mercoledì";
            case 4:
                return "Giovedì";
            case 5:
                return "Venerdì";
            case 6:
                return "Sabato";
        }
    },
    _filter: function (iterato) {
        for (const elem of this.$superior_bar) {
            elem.classList.remove("active");
        }
        iterato.classList.add("active");
        if (iterato.getAttribute("tipo") === "login") {
            this.$login.classList.add("flex");
            this.$login.classList.remove("no-focus");
            this.$register.classList.add("no-focus");
            this.$register.classList.remove("flex");
            this.$attivita.classList.remove("flex");
            this.$attivita.classList.add("no-focus");
            this.$prezzo.classList.add("no-focus");
            this.$prezzo.classList.remove("flex");
            this.$registerUsername.value = "";
            this.$registerPassword.value = "";
            this.$registerRuolo = "";
            for (const elem of this.$attivita_scelte) {
                elem.checked = false;
            }
        }
        else {
            this.$register.classList.add("flex");
            this.$register.classList.remove("no-focus");
            this.$login.classList.add("no-focus");
            this.$login.classList.remove("flex");
            this.$attivita.classList.remove("flex");
            this.$attivita.classList.add("no-focus");
            this.$prezzo.classList.add("no-focus");
            this.$prezzo.classList.remove("flex");
            this.$registerUsername.value = "";
            this.$registerPassword.value = "";
            for (const elem of this.$attivita_scelte) {
                elem.checked = false;
            }
        }
    },
    _getDayOfWeek: function (giorno, mese, anno) {
        // Attenzione: in JS i mesi partono da 0 (0 = Gennaio, 11 = Dicembre)
        const date = new Date(anno, mese, giorno);
        const giorniSettimana = [
            "Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"
        ];
        return giorniSettimana[date.getDay()];
    }
}
ListaGrafica.init();