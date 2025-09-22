import express from "express";
import http from "http";
import { Server } from "socket.io";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const dbUser = [];
const dbClienti = [];
const dbPersonal = [];
const dbAdmin = [];

const prenotazioni = [];
const attivita = [];

const app = express();
const httpServer = http.createServer(app);
const SocketServer = new Server(httpServer);

app.use(express.static("./www"));
app.use(express.json());


const poolWithoutDB = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


let pool;

async function createDatabaseIfNotExists() {
    try {
        const connection = await poolWithoutDB.getConnection();

        await connection.execute('CREATE DATABASE IF NOT EXISTS utente');

        connection.release();

        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

    } catch (error) {
        console.error('Errore nella creazione del database:', error);
        throw error;
    }
}

async function initDatabase() {
    try {
        // Prima crea il database se non esiste
        await createDatabaseIfNotExists();

        const connection = await pool.getConnection();

        // Tabella utenti
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS utenti(
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            ruolo VARCHAR(255) NOT NULL,
            UNIQUE KEY unique_username (username)
            )
        `);

        // Tabella attivita
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS attivita(
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome_attivita VARCHAR(255) NOT NULL,
            UNIQUE KEY unique_nome_attivita (nome_attivita)
            )
        `);

        // Tabella utente_attivita
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS utente_attivita(
            id INT AUTO_INCREMENT PRIMARY KEY,
            idutente INT NOT NULL,
            idattivita INT NOT NULL,
            FOREIGN KEY (idutente) REFERENCES utenti(id),
            FOREIGN KEY (idattivita) REFERENCES attivita(id),
            UNIQUE KEY unique_utente_attivita (idutente, idattivita)
            )
        `);

        // Tabella calendario
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS calendario(
            id INT AUTO_INCREMENT PRIMARY KEY,
            giorno VARCHAR(255) NOT NULL,
            inizio FLOAT NOT NULL,
            fine FLOAT NOT NULL,
            username varchar(255) NOT NULL,
            univoco VARCHAR(255) NOT NULL,
            numerogiorno INT NOT NULL,
            mese VARCHAR(3) NOT NULL,
            anno INT NOT NULL,
            UNIQUE KEY unique_calendario (univoco,username),
            idattivita INT NOT NULL,
            FOREIGN KEY (idattivita) REFERENCES attivita(id)
            )
        `);

        // Tabella prenotazioni
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS prenotazioni(
            id INT AUTO_INCREMENT PRIMARY KEY,
            idcalendario INT NOT NULL,
            idutente INT NOT NULL,
            FOREIGN KEY (idcalendario) REFERENCES calendario(id),
            FOREIGN KEY (idutente) REFERENCES utenti(id)
            )
        `);

        connection.release();

        // Inserisci le attività di default
        await pool.execute(`INSERT IGNORE INTO attivita (nome_attivita) VALUES(?)`, [`sala_pesi`]);
        await pool.execute(`INSERT IGNORE INTO attivita (nome_attivita) VALUES(?)`, [`crossfit`]);
        await pool.execute(`INSERT IGNORE INTO attivita (nome_attivita) VALUES(?)`, [`danza`]);
        await pool.execute(`INSERT IGNORE INTO attivita (nome_attivita) VALUES(?)`, [`funzionale`]);
        await pool.execute(`INSERT IGNORE INTO attivita (nome_attivita) VALUES(?)`, [`fit_box`]);

        console.log("Database inizializzato correttamente");

    } catch (error) {
        console.error('Errore nell\'inizializzazione del database:', error);
        throw error;
    }
}

function setupRoutes() {
    // 1<-- cliente
    // 2<-- personal trainer
    // 3<-- admin
    SocketServer.on("connection", (socket) => {
        console.log("🟢 SOCKET CONNESSO " + socket.id);
        socket.on("newuser", (ruolo) => {
            if (ruolo === "cliente") {
                socket.join(1);
            }
            else if (ruolo === "personal trainer") {
                socket.join(2);
            }
            else {
                socket.join(3);
            }
        });
    });

    app.post("/prendiSport", (req, res) => {
        (async () => {
            const db = [];
            const dati = req.body;
            const [idutente] = await pool.execute("SELECT id FROM utenti WHERE username = ?", [dati.username]);
            const [result] = await pool.execute("SELECT idattivita FROM utente_attivita WHERE idutente = ?", [idutente[0].id]);
            for (const elem of result) {
                const [nome] = await pool.execute("SELECT nome_attivita FROM attivita WHERE id = ?", [elem.idattivita]);
                db.push(nome[0].nome_attivita);
            }
            res.json({ db });
        })();

    });

    app.post("/prezzo", (req, res) => {
        const data = req.body;
        let prezzo = 0;
        for (const elem of data.attivita) {
            switch (elem) {
                case "sala_pesi":
                    prezzo += 29.99;
                    break;
                case "crossfit":
                case "danza":
                case "funzionale":
                case "fit_box":
                    prezzo += 39.99;
                    break;
                case "tutto":
                    prezzo = 99.99;
                    break;
            }
        }
        res.json({ prezzo });
    });

    app.post("/registrati", (req, res) => {
        const dati = req.body;
        (async () => {
            const [result] = await pool.execute(`INSERT IGNORE INTO utenti (username,password,ruolo) values(?, ?, ?)`, [dati.username, dati.password, dati.ruolo]);
            if (result.affectedRows === 0) {
                res.json({ success: false });
                return;
            }
            const id = result.insertId;
            if (dati.ruolo != "admin") {
                for (const elem of dati.attivita) {
                    if (elem === "tutto") {
                        const array = ["sala_pesi", "crossfit", "danza", "funzionale", "fit_box"];
                        for (const elem2 of array) {
                            const [idattivita] = await pool.execute(`SELECT id FROM attivita WHERE nome_attivita= ?`, [elem2]);
                            if (idattivita.length > 0) {
                                await pool.execute(`INSERT IGNORE INTO utente_attivita (idutente,idattivita) VALUES (?, ?)`, [id, idattivita[0].id]);
                            }
                        }
                    }
                    else {
                        const [idattivita] = await pool.execute(`SELECT id FROM attivita WHERE nome_attivita= ?`, [elem]);
                        if (idattivita.length > 0) {
                            await pool.execute(`INSERT IGNORE INTO utente_attivita (idutente,idattivita) VALUES (?, ?)`, [id, idattivita[0].id]);
                        }
                    }
                }
            }
            console.log("Benvenuto " + dati.username + " sei un " + dati.ruolo);
            res.json({ success: true });
        }
        )();

    });

    app.post("/login", (req, res) => {
        const dati = req.body;
        (async () => {
            const [result] = await pool.execute("SELECT ruolo FROM utenti WHERE username= ? AND password=?", [dati.username, dati.password]);
            if (result.length === 0) {
                res.json({ success: false });
            }
            else {
                console.log("Benvenuto: " + dati.username + " sei un: " + result[0].ruolo);
                res.json({ success: true, ruolo: result[0].ruolo });
            }
        })()
    });

    app.post("/newAttivita", (req, res) => {
        (async () => {
            const dati = req.body;
            if (dati.inizio > dati.fine) {
                console.log("Orario non valido: inizio dopo fine");
                res.json({ success: false });
                return;
            }
            const [result] = await pool.execute("SELECT * FROM calendario WHERE giorno = ? AND numerogiorno= ? AND mese = ? AND anno = ? AND  ((inizio<= ? AND fine> ?) OR (inizio < ? AND fine >=?) OR (inizio<= ? AND fine >= ?))", [dati.giorno, dati.numerogiorno, dati.mese, dati.anno, dati.inizio, dati.inizio, dati.fine, dati.fine, dati.inizio, dati.fine]);
            if (result.length > 0) {
                res.json({ success: false });
                return;
            }
            dati.inizio = dati.inizio.toFixed(2);
            dati.fine = dati.fine.toFixed(2);
            const [sport] = await pool.execute("SELECT id FROM attivita WHERE nome_attivita = ?", [dati.sport]);
            await pool.execute("INSERT INTO calendario (giorno,inizio,fine,idattivita,univoco,username,numerogiorno,mese,anno) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [dati.giorno, dati.inizio, dati.fine, sport[0].id, dati.univoco, dati.username, dati.numerogiorno, dati.mese, dati.anno]);
            SocketServer.emit("newAttivita", dati);
            res.json({ success: true });
        })();

    });

    app.get("/riempi", (req, res) => {
        (async () => {
            const attivita = [];
            const [result] = await pool.execute("SELECT * FROM calendario");
            for (const elem of result) {
                const [nomeatt] = await pool.execute("SELECT nome_attivita FROM attivita WHERE id= ?", [elem.idattivita]);
                elem.inizio = elem.inizio.toFixed(2);
                elem.fine = elem.fine.toFixed(2);
                const newOgg = {
                    username: elem.username,
                    sport: nomeatt[0].nome_attivita,
                    giorno: elem.giorno,
                    numerogiorno: elem.numerogiorno,
                    mese: elem.mese,
                    anno: elem.anno,
                    inizio: elem.inizio,
                    fine: elem.fine,
                    univoco: elem.univoco,
                };
                attivita.push(newOgg);
            }
            res.json({ attivita });
        })();

    });

    app.post("/rimuoviAttivita", (req, res) => {
        (async () => {
            const oggi = new Date();
            const dati = req.body;
            const [idcalendario] = await pool.execute("SELECT * FROM calendario WHERE univoco=?", [dati.univoco]);
            const [idprenotazioni] = await pool.execute("SELECT id,idutente FROM prenotazioni WHERE idcalendario= ?", [idcalendario[0].id]);
            idcalendario[0].inizio = idcalendario[0].inizio.toFixed(2);
            idcalendario[0].fine = idcalendario[0].fine.toFixed(2);
            const [ora, minuti] = idcalendario[0].inizio
                .split(".")
                .map(val => parseInt(val, 10));
            let numeromese;
            switch (idcalendario[0].mese) {
                case "gen":
                    numeromese = 0;
                    break;
                case "feb":
                    numeromese = 1;
                    break;
                case "mar":
                    numeromese = 2;
                    break;
                case "apr":
                    numeromese = 3;
                    break;
                case "mag":
                    numeromese = 4;
                    break;
                case "giu":
                    numeromese = 5;
                    break;
                case "lug":
                    numeromese = 6;
                    break;
                case "ago":
                    numeromese = 7;
                    break;
                case "set":
                    numeromese = 8;
                    break;
                case "ott":
                    numeromese = 9;
                    break;
                case "nov":
                    numeromese = 10;
                    break;
                case "dic":
                    numeromese = 11;
                    break;
            }
            const data = new Date(idcalendario[0].anno, numeromese, idcalendario[0].numerogiorno, ora, minuti);
            if (data >= oggi) {
                for (const elem of idprenotazioni) {
                    const [utente] = await pool.execute("SELECT username FROM utenti WHERE id=?", [elem.idutente]);

                    const newOgg = {
                        username: utente[0].username,
                        numerogiorno: idcalendario[0].numerogiorno,
                        mese: idcalendario[0].mese,
                        anno: idcalendario[0].anno,
                        giorno: idcalendario[0].giorno,
                        inizio: idcalendario[0].inizio,
                        fine: idcalendario[0].fine,
                        univoco: dati.univoco,
                    }
                    await pool.execute("DELETE FROM prenotazioni WHERE id= ?", [elem.id]);
                    SocketServer.emit("removePrenotazione", newOgg);
                }
                await pool.execute("DELETE FROM calendario WHERE id= ?", [idcalendario[0].id]);
                SocketServer.emit("rimuoviAttivita", dati);

                res.json({ success: true });
            }
            else {
                res.json({ success: false });
            }
        })();
    });

    app.post("/riempiClienti", (req, res) => {
        (async () => {
            const dati = req.body;
            const [idclienti] = await pool.execute("SELECT id FROM utenti WHERE username= ?", [dati.username]);
            const [idattivita] = await pool.execute("SELECT idattivita FROM utente_attivita WHERE idutente= ?", [idclienti[0].id]);
            const db = [];
            for (const elem of idattivita) {

                const [attivita] = await pool.execute("SELECT nome_attivita FROM attivita WHERE id=?", [elem.idattivita]);
                const [prenotazioni] = await pool.execute("SELECT * FROM calendario WHERE idattivita=?", [elem.idattivita]);
                for (const elem2 of prenotazioni) {
                    const [prenotato]=await pool.execute("SELECT id FROM prenotazioni WHERE idutente= ? AND idcalendario = ?",[idclienti[0].id,elem2.id]);
                    elem2.inizio = elem2.inizio.toFixed(2);
                    elem2.fine = elem2.fine.toFixed(2);
                    const newOgg = {
                        sport: attivita[0].nome_attivita,
                        giorno: elem2.giorno,
                        numerogiorno: elem2.numerogiorno,
                        mese: elem2.mese,
                        anno: elem2.anno,
                        inizio: elem2.inizio,
                        fine: elem2.fine,
                        univoco: elem2.univoco,
                        prenotato: (prenotato.length>0 ? 1 : 0),
                    };
                    db.push(newOgg);
                }
            }
            res.json({ db });
        })();
    });

    app.post("/prendiSportCliente", (req, res) => {
        (async () => {
            const dati = req.body;
            const [idclienti] = await pool.execute("SELECT id FROM utenti WHERE username= ?", [dati.username]);
            const [idattivita] = await pool.execute("SELECT idattivita FROM utente_attivita WHERE idutente= ?", [idclienti[0].id]);
            const attivita = [];
            for (const elem of idattivita) {

                const [nome_attivita] = await pool.execute("SELECT nome_attivita FROM attivita WHERE id=?", [elem.idattivita]);
                attivita.push(nome_attivita[0].nome_attivita);

            }
            res.json({ attivita });
        })();
    });

    app.post("/insertPrenotazione", (req, res) => {
        (async () => {

            const dati = req.body;
            const oggi = new Date();

            const [ora, minuti] = dati.inizio
                .split(".")
                .map(val => parseInt(val, 10));

            let numeromese;
            switch (dati.mese) {
                case "gen":
                    numeromese = 0;
                    break;
                case "feb":
                    numeromese = 1;
                    break;
                case "mar":
                    numeromese = 2;
                    break;
                case "apr":
                    numeromese = 3;
                    break;
                case "mag":
                    numeromese = 4;
                    break;
                case "giu":
                    numeromese = 5;
                    break;
                case "lug":
                    numeromese = 6;
                    break;
                case "ago":
                    numeromese = 7;
                    break;
                case "set":
                    numeromese = 8;
                    break;
                case "ott":
                    numeromese = 9;
                    break;
                case "nov":
                    numeromese = 10;
                    break;
                case "dic":
                    numeromese = 11;
                    break;
            }
            const data = new Date(dati.anno, numeromese, dati.numerogiorno, ora, minuti);
            if (data >= oggi) {
                const [idcalendario] = await pool.execute("SELECT id FROM calendario WHERE univoco= ?", [dati.univoco]);
                const [idutente] = await pool.execute("SELECT id FROM utenti WHERE username= ?", [dati.username]);
                const [result] = await pool.execute("SELECT * FROM prenotazioni WHERE idcalendario= ? AND idutente = ?", [idcalendario[0].id, idutente[0].id]);
                if (result.length > 0) {
                    res.json({ success: false, presente: true });
                    return;
                }
                await pool.execute("INSERT INTO prenotazioni(idcalendario,idutente) VALUES (?, ?)", [idcalendario[0].id, idutente[0].id]);
                SocketServer.emit("insertPrenotazione", dati);
                res.json({ success: true });
            }
            else {
                res.json({ success: false, presente: false });
            }
        })();
    });

    app.post("/prendiPrenotazioni", (req, res) => {
        (async () => {
            const dati = req.body;
            const oggi = new Date();
            const [idutente] = await pool.execute("SELECT id FROM utenti WHERE username= ?", [dati.username]);
            const [idcalendario] = await pool.execute("SELECT idcalendario FROM  prenotazioni WHERE idutente= ?", [idutente[0].id]);
            const db = [];
            for (const elem of idcalendario) {
                const [calendario] = await pool.execute("SELECT * FROM calendario WHERE id= ?", [elem.idcalendario]);
                const [nome_attivita] = await pool.execute("SELECT nome_attivita FROM attivita WHERE id= ?", [calendario[0].idattivita]);
                calendario[0].inizio = calendario[0].inizio.toFixed(2);
                calendario[0].fine = calendario[0].fine.toFixed(2);
                const [ora, minuti] = calendario[0].inizio
                    .split(".")
                    .map(val => parseInt(val, 10));
                let numeromese;
                switch (calendario[0].mese) {
                    case "gen":
                        numeromese = 0;
                        break;
                    case "feb":
                        numeromese = 1;
                        break;
                    case "mar":
                        numeromese = 2;
                        break;
                    case "apr":
                        numeromese = 3;
                        break;
                    case "mag":
                        numeromese = 4;
                        break;
                    case "giu":
                        numeromese = 5;
                        break;
                    case "lug":
                        numeromese = 6;
                        break;
                    case "ago":
                        numeromese = 7;
                        break;
                    case "set":
                        numeromese = 8;
                        break;
                    case "ott":
                        numeromese = 9;
                        break;
                    case "nov":
                        numeromese = 10;
                        break;
                    case "dic":
                        numeromese = 11;
                        break;
                }
                const data = new Date(calendario[0].anno, numeromese, calendario[0].numerogiorno, ora, minuti);
                if (data >= oggi) {
                    const newOgg = {
                        univoco: calendario[0].univoco,
                        sport: nome_attivita[0].nome_attivita,
                        inizio: calendario[0].inizio,
                        fine: calendario[0].fine,
                        giorno: calendario[0].giorno,
                        numerogiorno: calendario[0].numerogiorno,
                        mese: calendario[0].mese,
                        anno: calendario[0].anno
                    }
                    db.push(newOgg);
                }
            }
            res.json({ db });
        })();

    });

    app.post("/removePrenotazione", (req, res) => {
        (async () => {
            const dati = req.body;
            const oggi = new Date();
            const [idutente] = await pool.execute("SELECT id FROM utenti WHERE username= ?", [dati.username]);
            const [idcalendario] = await pool.execute("SELECT * FROM calendario WHERE univoco=?", [dati.univoco]);
            idcalendario[0].inizio = idcalendario[0].inizio.toFixed(2);

            const [ora, minuti] = idcalendario[0].inizio
                .split(".")
                .map(val => parseInt(val, 10));
            let numeromese;
            switch (idcalendario[0].mese) {
                case "gen":
                    numeromese = 0;
                    break;
                case "feb":
                    numeromese = 1;
                    break;
                case "mar":
                    numeromese = 2;
                    break;
                case "apr":
                    numeromese = 3;
                    break;
                case "mag":
                    numeromese = 4;
                    break;
                case "giu":
                    numeromese = 5;
                    break;
                case "lug":
                    numeromese = 6;
                    break;
                case "ago":
                    numeromese = 7;
                    break;
                case "set":
                    numeromese = 8;
                    break;
                case "ott":
                    numeromese = 9;
                    break;
                case "nov":
                    numeromese = 10;
                    break;
                case "dic":
                    numeromese = 11;
                    break;
            }
            const data = new Date(idcalendario[0].anno, numeromese, idcalendario[0].numerogiorno, ora, minuti);
            if (data >= oggi) {
                const [idprenotazione] = await pool.execute("SELECT id FROM prenotazioni WHERE idutente= ? AND idcalendario = ?", [idutente[0].id, idcalendario[0].id]);
                await pool.execute("DELETE FROM prenotazioni WHERE id= ?", [idprenotazione[0].id]);
                SocketServer.emit("removePrenotazione", dati);
                res.json({ success: true });
            }
            else {
                res.json({ success: false });
            }
        })();
    });

    app.post("/prendiClienti", (req, res) => {
        (async () => {
            const dati = req.body;
            const [idcalendario] = await pool.execute("SELECT id FROM calendario WHERE univoco=?", [dati.univoco]);
            const [idutente] = await pool.execute("SELECT idutente FROM prenotazioni WHERE idcalendario = ?", [idcalendario[0].id]);
            const db = [];
            for (const elem of idutente) {
                const [username] = await pool.execute("SELECT username FROM utenti WHERE id=?", [elem.idutente]);
                db.push(username[0]);
            }
            res.json({ db });
        })();
    });
}

// Inizializzazione del server
(async () => {
    try {
        await initDatabase();
        setupRoutes();

        httpServer.listen(8080, () => {
            console.log("server aperto sulla porta 8080");
        });
    } catch (error) {
        console.error("Errore durante l'inizializzazione del server:", error);
        process.exit(1);
    }
})();