# DEMO - MADE "Static" Website

## Intro

Vedremo la homepage a fine meeting, ma un grande sforzo in questa prima settimana è stato dedicato alla creazione del sistema per gestire i componenti. Questo sistema risponde direttamente alle esigenze del progetto: avere un sito statico ma con predisposizione per componenti dinamici e riutilizzabili.

Grazie a questa soluzione possiamo:

- Condividere facilmente il lavoro tra di noi.

- Implementare velocemente i componenti in qualsiasi punto del sito.

- Mantenere il codice pulito, riutilizzabile e facile da integrare in WordPress.

- Rendere più efficiente la gestione delle pagine, evitando ripetizioni e semplificando gli aggiornamenti futuri.

E ci auguriamo sia anche piacevole da usare! :)

Quindi, vediamo ora come funziona il sistema.


## Come usare il nostro sistema

1. Creiamo una cartella vuota "made-demo".
2. Copiamo al suo interno le cartelle:  
    - `assets` - *immagini e font 'Monoska' richiesto dal team Figma*.
    - `components` - *tutti i componenti*.
    - `css` - *style.css con gli stili comuni a tutti i componenti*.
    - `data` - *file JSON con i dati per i componenti dinamici.*  
        > *a) Non serve se si usano solo componenti statici.*  
         *b) Potenzialmente superfluo in futuro, collegando ad API.*  
         *c) Può rimanere comodo per gestire il menu in un file JSON.*
    - `js` - *gli script che rendono i componenti dinamici*.
3. Apriamo la cartella in VS Code.
> Zoom + di VS Code


## Componenti statici

1. Creiamo nella root una pagina `test.html` con **html vuoto** e `<h1>TEST</h1>`.  
`Lanciamo live server.`

2. Includiamo **css/style.css, jQuery e FontAwesome**.
3. Inseriamo un **.wrapper** per i nostri componenti.  
`Tutti i componenti sono nella stessa cartella.`

4. **Includiamo lo style** del `footer` e **incolliamo l'HTML** del footer in pagina.  
`Proviamo.`

5. Rimuoviamo il footer.
6. Incolliamo l'*HTML* della `hero` e importiamo il suo CSS.  
`Vediamo cosa succede.`

7. Proviamo con `kpi-1` in versione statica (niente sub-components) come fatto con la `hero`.
8. Replichiamo manualmente cards/elementi.  
`Proviamo.`


## Componenti dinamici

1. Includiamo `js/components.js` in pagina.
2. Aggiungiamo un div con `data-component="footer"`.  
`Vediamo cosa succede.`

3. Aggiungiamo un div con `data-component="kpi-1"`.  
`Proviamo.`

4. Cerchiamo l'endpoint "kpis" nel file `js/endpoints.js` e osserviamo a quale file punta.
5. Guardiamo com'è fatto il file `kpis.json` in /data.
6. Aggiungiamo la prop `data-endpoint="kpis"` al div.  
`Proviamo.`
7. Parliamo un momento di `js/endpoints.js` e `js/api.js`.


## Sub-componenti

1. Modifichiamo il componente `kpi-1` aggiungendo il sub-componente `kpi-1-card` con `<div data-component="kpi-1-card"></div>`.  
> `Osserviamo che il componente viene caricato, ma senza dati.`

2. Osserviamo nel template di `kpi-1-card` che dati si aspetta.
3. Nel template di `kpi-1` aggiorniamo il subcomponente con la prop `data-object='{ "value": "{{card.value}}", "label": "{{card.label}}" }'`.  
> Se si vogliono passare array bisogna omettere i doppi apici per non rompere il parser.  
`Proviamo.`

4. Avviso: non sono mai stati testati ulteriori livelli di nesting! 🚀


## Collegare i dati

1. Aggiungiamo un nuovo file JSON in `data/`.
2. Configuriamo l'endpoint nel file `js/endpoints.js`.
3. Aggiungiamo `data-endpoint="nuovo-endpoint"` al componente.  
`Verifichiamo.`
4. Menzione: c'è una predisposizione per API che vediamo dopo.
5. Mostriamo l'opzione `data-object` per passare dati ai subcomponenti.

## Aggiungere nuovi componenti

Creare un nuovo componente è semplice e segue un pattern chiaro per garantire pulizia e riutilizzabilità.

### 1. Creare la struttura del componente
1. Nella cartella `components`, creare una sottocartella con il nome del nuovo componente (es: `my-new-component`).
2. All'interno, creare tre file:
   - `my-new-component.html` → Struttura HTML del componente.
   - `my-new-component.css` → Stili specifici del componente (opzionale).
   - `my-new-component.js` → Logica JavaScript del componente (opzionale).
3. Aggiungere il componente alla variabile `COMPONENTS` in `components.js`.

### 2. Usare il componente nella pagina
Nel file HTML, basta scrivere:
```html
<div data-component="my-new-component"></div>
```
Se il componente ha dati dinamici, si può passare un oggetto JSON:
```html
<div data-component="my-new-component" data-object='{"title": "Esempio", "description": "Questo è un test"}'></div>
```

### 3. Caricare dati via API (opzionale)
Se il componente deve caricare dati da un'API, si può usare `data-endpoint`:
```html
<div data-component="my-new-component" data-endpoint="/api/data.json"></div>
```
Tuttavia, per maggiore controllo, è possibile **gestire le chiamate API direttamente nel componente** usando i lifecycle hooks.

## Lifecycle Hooks per gestire API personalizzate
Ogni componente ha tre momenti in cui possiamo eseguire codice:
1. **`beforeMount`** → Prima che il componente venga inserito nella pagina.
2. **`mounted`** → Quando il componente è stato inserito e può fare richieste API.
3. **`beforeDestroy`** → Quando il componente sta per essere rimosso.

Esempio di un componente che carica dati via API manualmente:
```js
ComponentRegistry.register("my-new-component", {
    mounted: function ($el, data) {
        fetch('/api/custom-endpoint')
            .then(response => response.json())
            .then(apiData => {
                console.log("Dati ricevuti:", apiData);
                compileComponent($el, apiData); // Rende dinamico il componente
            });
    }
});
```
Questo permette di **evitare l'uso di `data-endpoint`** e avere più controllo sulla logica di caricamento.

---

## Conclusione

Abbiamo sviluppato un sistema che non solo risponde alle esigenze attuali, ma rende il progetto più solido e scalabile per il futuro.

Grazie a questa struttura:

Possiamo lavorare con maggiore efficienza.

Il codice resta leggibile, modulare e facilmente gestibile.

Il sito può evolversi nel tempo senza compromettere la semplicità d'uso.

Se avete domande o volete approfondire qualche punto, sono qui per rispondere. Grazie per l’attenzione.
- Il sistema è ancora in sviluppo, potrebbero esserci modifiche anche radicali se necessario.
- Terrei il lunedì alle 10 come momento di allineamento!

