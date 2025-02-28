<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#il-progetto">Il progetto: CivicDrive</a></li>
    <li><a href="#funzionalità">Funzionalità</a></li>
    <li><a href="#struttura-del-codice">Struttura del codice</a></li>
    <li><a href="#link-al-sito">Link</a></li>
    <li><a href="#utilizzo">Utilizzo</a></li>
    <li><a href="#contribuire">Contribuire</a></li>
    <li><a href="#contatti">Contatti</a></li>
  </ol>
</details>



<!-- IL PROGETTO -->
## Il progetto

Questo progetto è un'applicazione sviluppata in Angular che simula un sistema di interazione tra cittadini con l'obiettivo di migliorare
la qualità della vita nei centri urbani.<br>

I cittadini possono registrarsi per condividere idee e segnalazioni tramite post e partecipare attivamente a discussioni visualizzando e 
commentando le proposte altrui e contribuire soprattutto a:<br>

<ul>
    <li>Proteggere, salvaguardare e valorizzare il patrimonio culturale della città;</li>
    <li>Proteggere l'ambiente e tutelare il patrimonio naturale della città;</li>
    <li>Favorire legami positivi, sociali e ambientali, tra le diverse aree urbane.</li>
</ul><br>


<!-- FUNZIONALITà -->
## Funzionalità

- **Visualizzazione elenco utenti**: La pagina iniziale mostra l'elenco degli utenti registrati alla piattaforma
- **Ricerca utenti**: Una barra di ricerca consente di filtrare gli utenti per nome o email
- **Registrazione/Cancellazione utente**: È possibile aggiungere un nuovo utente o rimuoverne uno esistente
- **Visualizzazione profilo utente**: Ogni utente ha una pagina dedicata con le informazioni di base e i post pubblicati
- **Visualizzazione lista dei post**: La seconda pagina mostra la lista dei post pubblicati dagli utenti
- **Ricerca post**: Una barra di ricerca permette di filtrare i post per titolo o contenuto
- **Pubblicazione post**: L'utente può pubblicare un post (previa registrazione)
- **Commentare un post**: L'utente può commentare un post esistente (previa registrazione)


<!-- Struttura -->
## Struttura del progetto

L’applicazione è organizzata seguendo lo schema Angular 19. Qui di seguito sono illustrate le cartelle principali:

```text
📂 src/app/
├── 📁 components/ (Contiene i componenti riutilizzabili)
│   ├── footer (Piè di pagina)
│   ├── form-add-user-details/ (Form per aggiungere dettagli utente a fine di registrazione)
|   ├── header (Header della pagina)
│   ├── paginator/ (Sistema di paginazione)
│   ├── post/ (Singolo post con commenti)
│   ├── search-bar/ (Barra di ricerca)
│   
├── 📁 models/ (Definizione delle interfacce degli oggetti)
│   ├── user.model.ts (Modello utente)
│   ├── post.model.ts (Modello post)
│   ├── postComment.model.ts (Modello commento)
│
├── 📁 pages/ (Le pagine principali dell'app)
│   ├── login/ (Pagina di accesso ocn token)
│   ├── users-list/ (Pagina iniziale con lista utenti)
│   ├── users-list-id/ (Pagina dedicata al singolo utente)
│   ├── users-posts/ (Seconda pagina con lista dei post)
│   
├── 📁 services/ (Contiene i servizi)
│   ├── go-rest-api.service.ts (Gestisce le chiamate API a GoRest)
│   ├── local-storage.service.ts (Gestisce il salvataggio dati nel LocalStorage)
│
└── 📜 app.* (Modulo principale Angular che importa tutti i componenti e servizi)
```

<!-- LINK -->
## Link al sito 

**Clicca qui:** [CivicDrive](https://civicdrive.netlify.app/)


<!-- UTILIZZO -->
## Utilizzo

1. **Clona il repository:**
    ```bash
    git clone https://github.com/ElisabettaNale/civic_drive.git
    ```
2. **Avvia il server di sviluppo locale:**
    ```bash
    ng serve
    ```


<!-- CONTRIBUIRE -->
## Contribuire

Se desideri contribuire al progetto, segui questi passaggi: 

1. **Forka il repository su GitHub.**

2. **Crea un nuovo branch per le tue modifiche.**

3. **Invia una request per l'integrazione delle tue modifiche nel repository principale.**


<!-- CONTATTI -->
## Contatti

Per qualsiasi domanda o suggerimenti, puoi contattarmi tramite il mio **profilo LinkedIn:** [Elisabetta Nale](https://www.linkedin.com/in/elisabetta-nale/)
e puoi anche dare un'occhiata al mio **sito web professionale:** [Home](https://elisabettanale.github.io/index.html).