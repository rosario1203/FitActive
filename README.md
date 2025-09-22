# FitActive
**INTRODUZIONE**
Questo progetto riguarda la gestione delle prenotazioni di una palestra chiamat>
 Sono previsti 3 ruoli principali:
- **Admin**: ha il compito di gestire l’intero sito. Può cancellare una lezione>
- **Personal trainer**: può creare o cancellare una lezione e visualizzare l’el>
- **Cliente**: può prenotarsi o cancellare la prenotazione a una lezione.


Durante la registrazione:
- Il **personal trainer** deve scegliere il tipo di attività che desidera inseg>


- Il **cliente** deve scegliere il tipo di attività che desidera seguire e, al >
**STRUTTURA DEL PROGETTO**
Nella cartella principale del progetto sono presenti i seguenti elementi:
- **main.js** → rappresenta il backend del progetto e corrisponde al server.
- **www/** → cartella che contiene il front-end del progetto.


All’interno della cartella **www/** troviamo:
- **index.html** → costituisce la pagina principale del progetto.
- **asset/** → cartella che contiene:
  - un file **CSS**, dedicato alla gestione dello stile grafico del sito;
  - un file **JavaScript**, che rappresenta il client del progetto;
  - una cartella di **immagini** utilizzate all’interno del sito.
**INSTALLAZIONE E AVVIO**
```
#entra nella cartella del progetto:
cd percorso-file/PROGETTO
#installa tutte le dipendenze del progetto
npm install
#avvia il server
npm start
#entra nella porta 8080
http://localhost:8080
```
ps. ricordarsi di modificare il .env per le variabili ambientali utilizzate

