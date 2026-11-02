# Nova Studio

**Dai forma alle tue idee, direttamente nel browser.**

Nova Studio è un editor visuale per progettare pagine, interfacce e composizioni grafiche senza dover partire dal codice. Aggiungi elementi, trascinali sulla tavola, personalizza ogni dettaglio e controlla il risultato su desktop e mobile.

> Nova Studio è in evoluzione: alcune funzioni avanzate, come collaborazione in tempo reale, sincronizzazione cloud e pubblicazione hosting con un clic, non sono ancora disponibili.

## Cosa puoi fare

- **Progettare visivamente:** crea layout con titoli, testi, pulsanti, immagini, card, forme e altri componenti.
- **Comporre liberamente:** sposta gli elementi, regola dimensioni e larghezza, gestisci livelli e allineamenti.
- **Personalizzare:** modifica colori, tipografia, spaziature, raggi, trasformazioni e proprietà degli elementi.
- **Lavorare con precisione:** usa selezione, livelli, duplicazione, blocco, visibilità, guide e strumenti di allineamento.
- **Cambiare anteprima:** controlla il progetto in modalità desktop e mobile.
- **Gestire il lavoro:** annulla e ripristina le modifiche, salva automaticamente nel browser e importa o esporta i progetti.
- **Portare fuori le tue creazioni:** esporta una pagina HTML autonoma e un archivio progetto `.NOVA` quando disponibile nell'editor.

## Inizia

### Usare la versione online

Apri la distribuzione web di Nova Studio dal link condiviso dal progetto. Non serve installare un'applicazione.

### Avviare Nova Studio in locale

Requisiti: Node.js 20 o superiore.

```bash
npm install
npm run dev
```

Apri l'indirizzo locale mostrato da Vite.

### Creare una build

```bash
npm run build
npm run preview
```

## Salvataggio e privacy

I progetti vengono salvati localmente nel browser tramite `localStorage`. Questo significa che non vengono caricati automaticamente su un account cloud e non si sincronizzano da soli tra dispositivi o browser.

**Consiglio:** esporta regolarmente una copia del progetto e conservala in un posto sicuro. Cancellare i dati del browser può eliminare i progetti salvati localmente.

## Stato del progetto

Nova Studio è un prodotto in sviluppo attivo. L'obiettivo è renderlo uno spazio creativo accessibile sia a chi muove i primi passi sia a chi vuole controllare con precisione i propri layout.

Le prossime aree di lavoro includono:
- onboarding e tutorial per chi lo usa per la prima volta;
- libreria di template e progetti di esempio;
- accessibilità e rifinitura dell'esperienza mobile;
- test automatici e maggiore robustezza di importazione/esportazione;
- valutazione di account, backup cloud e collaborazione.

## Contribuire

Idee, segnalazioni e proposte sono benvenute. Se trovi un problema, apri una issue nel repository descrivendo i passaggi per riprodurlo e cosa ti aspettavi che accadesse.

---

**Nova Studio — crea, sperimenta, realizza.**
