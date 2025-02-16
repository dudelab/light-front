# Readme

## Sommario

[Tipi di componenti](#tipi-di-componenti) | 
[Come aggiungere un nuovo componente](#come-aggiungere-un-nuovo-componente) | 
[Linee guida](#linee-guida) | 
[Dipendenze](#dipendenze)

## Tipi di componenti

- Statico --> 'footer'
- Dinamico --> 'hero' o 'kpi-1'

## Come aggiungere un nuovo componente

### Per tutti i componenti

1. creare una cartella col nome del nuovo componente (tutto minuscolo, separato da '-'
2. creare un file .js, un .css e un .html col nome del nuovo componente (uguale alla cartella)
3. aggiornare la variabile 'COMPONENTS' del file script.js con una nuova chiave con "nome-componente": "path+filename(senza estensione)" del nuovo componente
4. nella pagina in cui si vuole utilizzare il componente, aggiungere un div con l'attributo data-component="nome-componente"
6. creare l'html e il css del nuovo componente.

### Solo per i componenti dinamici

6. creare un file json con i dati necessari al nuovo componente nella cartella /data
7. aggiornare il file endpoints.js aggiungendo la nuova 'api' con il percorso del file json
8. nella pagina in cui stiamo utilizzando il componente (x es. home.html) aggiorniamo il div relativo con l'attributo data-endpoint="json-key", dove il valore dev'essere la chiave del nuovo elemento che abbiamo aggiunto in endpoints.js
9. popolare di contenuti dinamici l'html del componente con la sintassi {{ nome }}, {{ titolo }} eccetera.
10. se è necessario eseguire del javascript dopo che il componente è stato montato, aggiungere una funzione di questo tipo nel .js del componente:
`function populateSingleCardSlider($component, data) {
  console.log('single card slider')
  console.log(data)
}`
Il nome della funzione è importante per il funzionamento.


## Linee guida

- codice semantico
- accessibilità
- codice pulito, chiaro, leggibile e mantenibile
- nomi di variabili e funzioni chiari
- funzioni brevi e con singolo scopo, non funzioni grosse che fanno mille cose
- con una corretta gestione delle classi il css di un componente dev'essere specifico per quel componente e non deve rischiare di andare a toccare lo stile di altri elementi
- non usiamo id ma classi css, così che i componenti siano riutilizzabili più volte sulla stessa pagina
- i componenti devono essere riutilizzabili in maniera statica e devono funzionare anche senza javascript anche se con meno funzionalità (x es. una lista di tag andrà replicata a mano altrimenti di default ci sarà un solo elemento). Questo perchè potrebbe essere necessario per qualcuno prelevare singoli componenti da questo progetto per agganciarli ad un altro e il passaggio dev'essere semplice. Quindi x es. non creiamo html dal javascript se non in casi specifici giustificati.


## Dipendenze

- jquery
- js/api.js *(opzionale, se nessun componente lo usa)*
- js/endpoints.js *(opzionale, se nessun componente lo usa)*
- js/script.js
- css/style.css
- fontawesome