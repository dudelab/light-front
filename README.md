# Light-front

Micro Component Loading System

---

## Summary
[Basic Usage](#basic-usage) | 
[Components Structure](#components-structure) | 
[Passing Data](#passing-data) | 
[Special Features](#specialfeatures) | 
[component-registry](#component-registry) | 
[Benefits](#benefits)


## 1. Basic Usage

Add components to your page using the `data-component` attribute:

```html
<div data-component="header"></div>
<div data-component="hero"></div>
<div data-component="footer"></div>
```

## 2. Components Structure

To create a new component:

First, register your component in the COMPONENTS object:

```javascript
const COMPONENTS = {
    // Existing components...
    "header": "/components",
    
    // Add your new component
    "my-component": "/components"
};
```

Then create three files in your components directory:

```
componentName/
├── componentName.html  # Component's HTML template
├── componentName.css   # Component's styles
└── componentName.js    # Component's behavior/logic
```

## 3. Passing Data

You can pass data to components in two ways:

```html
<!-- Using data-object -->
<div data-component="card" data-object='{"title": "Hello", "description": "World"}'></div>

<!-- Using data-endpoint -->
<div data-component="news" data-endpoint="/api/news"></div>
```

## 4. Special Features

The system includes several special features for dynamic content:

```html
<!-- Template Variables -->
<h1>{{ title }}</h1>

<!-- Conditional Rendering -->
<div v-if="isVisible">This shows conditionally</div>

<!-- Lists/Loops -->
<div v-for="item in items">
    <p>{{ item.name }}</p>
</div>
```

## 5. Component Registry

Add lifecycle hooks to your components in their JS files:

```javascript
ComponentRegistry.register('my-component', {
    beforeMount($element, data) {
        // Runs before component is added to page
    },
    mounted($element, data) {
        // Runs after component is added to page
    },
    beforeDestroy($element, data) {
        // Runs before component is removed
    }
});
```

## Benefits

* Break down your website into reusable pieces
* Load components dynamically
* Pass data easily between components
* Keep your code organized and maintainable


## Linee guida per lo sviluppo

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