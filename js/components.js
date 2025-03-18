(async function initializeFramework() {
    // Load required scripts first
    await Promise.all([
        loadAndExecuteScript('/js/endpoints.js'),
        loadAndExecuteScript('/js/api.js')
    ]);
})();

function loadAndExecuteScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

const COMPONENTS = {
    "news": "/components/_test-components",
    "news-filtered": "/components/_test-components",
    "header": "/components",
    "footer": "/components",
    "hero": "/components",
    "hero-homepage": "/components",
    "hero-homepage-card-1": "/components",
    "hero-homepage-card-2": "/components",
    "kpi-1": "/components",
    "kpi-1-card": "/components",
    "logo-strip": "/components",
    "features-home": "/components",
    "contact-box": "/components",
    "cards-carousel": "/components",
    "single-card-slider": "/components",
    "single-card-slider-feature-card": "/components",
    "single-card-slider-announcement-card": "/components",
    "tech-areas": "/components",
    "tech-item": "/components",
    "blog-card": "/components",
    // "slider": "/components",
    "hero-1": "/components",
    "features-1": "/components",
    "testimonials-3": "/components",
    "contact-form-1": "/components",
    "contact-incentivo": "/components",
    "contact-hero": "/components",
    "perks": "/components",
    "consulenti-link": "/components",
    "faq": "/components",
    "objectives": "/components",
    "europe-link": "/components",
    "comments": "/components",
    "themes": "/components",
    "financing": "/components" ,
    "hero-banner": "/components",
    "banner-modal": "/components",
    "hero-technology": "/components",
    "processes": "/components",
    "statistics": "/components",
    "cards-event": "/components",
    "competence-center-banner": "/components",
    "moments": "/components",
    "hero-projects": "/components",
    "single-group-slider": "/components",
    "single-group": "/components",
    "double-card-slider": "/components",
    "card-item": "/components/cards-carousel/components",
    "europe-projects": "/components",
    "hero-tenders": "/components",
    "news": "/components",
    "sectors": "/components",
    "hero-competence-center": "/components",
    "statistics-2": "/components",
    "contact-incentivo-2": "/components"
};

const TEMPLATE_REGEX = /\{\{\s*(.*?)\s*\}\}/g;
const STYLE_REGEX = /\[\s*(.*?)\s*\]/g;
const CLASS_REGEX = /\[\[(.*?)\]\]/g;

// Resource loading state
const loadedScripts = new Set();
const loadedStyles = new Set();

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Process standalone data-objects first
    processDataObjects(document.body);
    // Then load components as usual
    loadAllComponents(document.body);
});

function processDataObjects(rootElement) {
    const nonComponentElements = Array.from(
        rootElement.querySelectorAll('[data-object]:not([data-component])')
    );
    
    nonComponentElements.forEach(element => {
        const objectAttr = element.getAttribute("data-object");
        try {
            const data = JSON.parse(objectAttr.replace(/'/g, '"'));
            compileComponent(element, data);
        } catch (error) {
            console.error(`Invalid data-object:`, objectAttr, error);
        }
    });
}

// Core loading functions
function loadAllComponents(component, data) {
    Array.from(component.children).forEach(child => {
        const componentName = child.getAttribute("data-component");

        if (componentName) {
            const fullPath = `${COMPONENTS[componentName]}/${componentName}/${componentName}`;
            loadScript(`${fullPath}.js`, () => mountComponent(componentName, child, data));
            loadCSS(`${fullPath}.css`);
            return;
        }
        
        if (child.children.length) {
            loadAllComponents(child, data);
        }
    });
}


function loadScript(src, callback = () => {}) {
    if (loadedScripts.has(src)) { // return callback();
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
            existingScript.remove();
        }
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = callback;
    document.head.appendChild(script);
    loadedScripts.add(src);
}

function loadCSS(href) {
    if (loadedStyles.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    document.head.appendChild(link);
    loadedStyles.add(href);
}

async function loadTemplate(path) {
    try {
        const response = await fetch(`${path}.html`);
        if (!response.ok) throw new Error(`Error loading ${path}`);
        return await response.text();
    } catch (error) {
        console.error(`Error retrieving template '${path}':`, error);
        return null;
    }
}

// Component Registry and Lifecycle
const LIFECYCLE = {
    BEFORE_MOUNT: 'beforeMount',
    MOUNTED: 'mounted',
    BEFORE_DESTROY: 'beforeDestroy'
};

const ComponentRegistry = {
    components: {},
    register(name, definition) {
        this.components[name] = definition;
    },
    get(name) {
        return this.components[name] || {
            beforeMount: () => {},
            mounted: () => {},
            beforeDestroy: () => {}
        };
    }
};

// Component mounting and lifecycle management
async function mountComponent(componentName, context, parentData) {
    try {
        const container = context;
        const data = await prepareComponentData(container, parentData);
        const instance = createComponentInstance(componentName, data);
        
        instance.callHook(LIFECYCLE.BEFORE_MOUNT);
        
        const nestedComponents = extractNestedComponents(container);
        const fullPath = `${COMPONENTS[componentName]}/${componentName}/${componentName}`;
        
        const template = await loadTemplate(fullPath);
        if (template) {
            await renderComponent(template, container, instance, data, nestedComponents);
        }
        
        return instance;
    } catch (error) {
        console.error(`Failed to mount component ${componentName}:`, error);
        return createErrorComponent();
    }
}

function createComponentInstance(componentName, data) {
    const componentDef = ComponentRegistry.get(componentName);
    return {
        ...componentDef,
        element: null,
        data,
        callHook(hookName) {
            if (typeof this[hookName] === 'function') {
                this[hookName](this.element, this.data);
            }
        }
    };
}

function createErrorComponent() {
    const div = document.createElement('div');
    div.className = 'component-error';
    div.textContent = 'Component failed to load';
    return { element: div };
}

// Data preparation functions
async function prepareComponentData(container, parentData) {
    const objectAttr = container.getAttribute("data-object");
    const configAttr = container.getAttribute("data-config");
    const endpoint = container.getAttribute("data-endpoint");
    
    let data = parseDataObject(objectAttr, parentData);
    
    if (!data && endpoint) {
        data = await fetchData(endpoint);
    }

    if (configAttr) {
        data = addConfigToData(data, configAttr);
    }

    return data;
}

function parseDataObject(objectAttr, parentData) {
    if (!objectAttr) return null;

    try {
        let processedAttr = objectAttr.replace(TEMPLATE_REGEX, (match, key) => {
            if (!parentData) return '""';
            
            const value = evaluateExpression(key.trim(), parentData);
            return typeof value === "object" && value !== null 
                ? JSON.stringify(value) 
                : value;
        });
        
        return JSON.parse(processedAttr.replace(/'/g, '"'));
    } catch (error) {
        console.error(`Invalid data-object:`, objectAttr, error);
        return null;
    }
}

function addConfigToData(data, configAttr) {
    try {
        return {
            ...data,
            config: JSON.parse(configAttr.replace(/'/g, '"'))
        };
    } catch (error) {
        console.error(`Invalid data-config:`, configAttr, error);
        return data;
    }
}

// Component rendering functions
async function renderComponent(template, container, instance, data, nestedComponents) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = template;
    const component = tempDiv.firstElementChild;
    
    transferAttributes(container, component);
    
    if (data) {
        compileComponent(component, data);
    }
    
    nestedComponents.forEach(comp => component.appendChild(comp));
    container.parentNode.replaceChild(component, container);
    
    finalizeComponent(component, instance, data);
    instance.callHook(LIFECYCLE.MOUNTED);
    
    await loadAllComponents(component, data);
}

function transferAttributes(source, target) {
    const originalId = source.getAttribute('id');
    const originalClasses = source.getAttribute('class');
    if (originalId) {
        target.setAttribute("id", originalId);
    }
    if (originalClasses) {
        target.classList.add(...originalClasses.split(' '));
    }    
}

function finalizeComponent(component, instance, data) {
    instance.element = component;
    component._componentInstance = instance;
    if (data) {
        component._componentData = data;
    }
}

function extractNestedComponents(container) {
    const components = Array.from(container.querySelectorAll('[data-component]'));
    components.forEach(comp => comp.parentNode.removeChild(comp));
    return components;
}

// Template compilation functions
function compileComponent(component, data) {
    processVIf(component, data);
    processVFor(component, data);
    processNodeAndChildren(component, data);
}

function processNodeAndChildren(node, data) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        processTextContent(node, data);
        processAttributes(node, data);
        processStyles(node, data);
        processClasses(node, data);
    }

    Array.from(node.children).forEach(child => {
        processNodeAndChildren(child, data);
    });
}

function processClasses(node, data) {
    const className = node.getAttribute("class");
    if (className && (className.includes("[[") || className.includes("{{"))) {
        let processedClassName = className.replace(TEMPLATE_REGEX, (match, expr) => {
            try {
                // Create evaluation context from data
                const context = {...data};
                
                // Handle ternary expressions or other complex expressions
                const evalFunction = new Function(...Object.keys(context), `return ${expr};`);
                const result = evalFunction.apply(null, Object.values(context));
                
                // Convert result to string appropriately
                return result === undefined || result === null ? '' : String(result);
            } catch (error) {
                console.warn(`Error evaluating class expression: "${expr}"`, error);
                return '';
            }
        });
        
        // Process class-specific syntax with [[condition]]
        processedClassName = processedClassName.replace(CLASS_REGEX, (_, condition) => {
            try {
                // Create evaluation context from data
                const context = {...data};
                
                // Evaluate the condition
                const conditionFunction = new Function(...Object.keys(context), `return ${condition};`);
                return conditionFunction.apply(null, Object.values(context)) ? condition : "";
            } catch (error) {
                console.warn(`Error evaluating class condition: "${condition}"`, error);
                return "";
            }
        });
        
        // Update the class attribute with the processed value
        node.setAttribute("class", processedClassName.trim().replace(/\s+/g, ' '));
    }
}

function processTextContent(node, data) {
    node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            child.textContent = replaceExpressions(child.textContent, data);
        }
    });
}

function processAttributes(node, data) {
    Array.from(node.attributes).forEach(attr => {
        if (attr.specified && attr.value.includes("{{") && attr.name !== "style") {
            node.setAttribute(attr.name, replaceExpressions(attr.value, data));
        }
    });
}

function processStyles(node, data) {
    const style = node.getAttribute("style");
    if (style?.includes("[") || style?.includes("{{")) {
        node.setAttribute("style", replaceStyleExpressions(style, data));
    }
}

function replaceExpressions(text, data) {
    return text.replace(TEMPLATE_REGEX, (_, expr) => {
        const value = evaluateExpression(expr.trim(), data);
        if (value === undefined || value === null) return _;
        return typeof value === 'object' ? JSON.stringify(value) : value;
    });
}

function replaceStyleExpressions(style, data) {
    return style
        .replace(STYLE_REGEX, (_, key) => getNestedValue(data, key.trim()) || "")
        .replace(TEMPLATE_REGEX, (_, key) => getNestedValue(data, key.trim()) || "");
}

// Expression evaluation functions
function evaluateExpression(expr, data) {
    const arrayMethodMatch = expr.match(/^(\w+)\[(\d+)\]\.(\w+)\.(\w+)\((.*?)\)$/);
    if (arrayMethodMatch) {
        return evaluateArrayMethod(arrayMethodMatch, data);
    }

    const arrayMatch = expr.match(/^(\w+)\[(\d+)\](\.[\w]+)?$/);
    if (arrayMatch) {
        return evaluateArrayAccess(arrayMatch, data);
    }

    return getNestedValue(data, expr);
}

function evaluateArrayMethod([_, arrayName, index, property, method], data) {
    const array = getNestedValue(data, arrayName);
    if (Array.isArray(array) && array[index]) {
        const value = array[index][property];
        if (typeof value === 'string' && typeof String.prototype[method] === 'function') {
            return value[method]();
        }
    }
    return undefined;
}

function evaluateArrayAccess([_, arrayName, index, property], data) {
    const array = getNestedValue(data, arrayName);
    if (Array.isArray(array) && array[index]) {
        return property 
            ? getNestedValue(array[index], property.slice(1)) 
            : array[index];
    }
    return undefined;
}

function getNestedValue(obj, key) {
    try {
        return key.split(/[\.\[\]]/)
                 .filter(k => k)
                 .reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
    } catch (error) {
        console.warn(`Error accessing key: "${key}"`, error);
        return undefined;
    }
}

// Conditional and loop processing
function processVIf(component, data) {
    component.querySelectorAll('[v-if]').forEach(el => {
        const condition = el.getAttribute("v-if").trim();
        try {
            // Create a new evaluation context that includes all properties from data
            const context = {};
            Object.entries(data).forEach(([key, value]) => {
                if (key !== 'config') {  // Skip config to avoid naming conflicts
                    context[key] = value;
                }
            });

            if (!condition.includes('.') && !condition.includes('(') && !condition.includes('=') && !(condition in context)) {
                // If it's just a property name that doesn't exist, treat as false
                el.parentNode.removeChild(el);
                return;
            }
            
            // Add special handling for array items if they exist
            if (data.item) context.item = data.item;
            if (data.feature) context.feature = data.feature;
            
            const conditionFunction = new Function(...Object.keys(context), `return ${condition};`);
            if (!conditionFunction.apply(null, Object.values(context))) {
                el.parentNode.removeChild(el);
            }
        } catch (error) {
            // Silently skip if the condition can't be evaluated
            // This happens when variables aren't yet defined, which is normal
            if (!error.toString().includes('is not defined')) {
                console.error(`Error evaluating v-if condition: "${condition}"`, error);
            }
        }
    });
}

function processVFor(component, data) {
    component.querySelectorAll('[v-for]').forEach(parent => {
        const vForAttr = parent.getAttribute("v-for");
        if (!vForAttr) return;

        // Parse both traditional and index-based v-for syntax
        let itemName, indexName, listName;
        
        if (vForAttr.includes(",")) {
            // Handle (item, index) in list syntax
            const [iterationPart, listPart] = vForAttr.split(" in ").map(s => s.trim());
            const [itemPart, indexPart] = iterationPart
                .replace(/[()]/g, '')  // Remove parentheses
                .split(",")
                .map(s => s.trim());
            
            itemName = itemPart;
            indexName = indexPart;
            listName = listPart;
        } else {
            // Handle traditional item in list syntax
            [itemName, listName] = vForAttr.split(" in ").map(s => s.trim());
            indexName = null;
        }

        const list = getNestedValue(data, listName);
        
        if (!Array.isArray(list)) {
            console.warn(`v-for error: "${listName}" is not an array`);
            return;
        }

        const fragment = document.createDocumentFragment();
        list.forEach((item, index) => {
            const clonedElement = createLoopElement(parent, data, item, itemName, index, indexName, list.length);
            fragment.appendChild(clonedElement);
        });
        
        parent.replaceWith(fragment);
    });
}

function createLoopElement(template, parentData, item, itemName, index, indexName, listLength) {
    const element = template.cloneNode(true);
    const itemData = { 
        ...parentData, 
        [itemName]: item,
        // Only add index to data if indexName was provided
        ...(indexName ? { [indexName]: index } : {}),
        // Add array length to support length-based conditions
        [`${itemName}s_length`]: listLength
    };
    
    element.removeAttribute("v-for");
    updateDataObjects(element, itemData);
    compileComponent(element, itemData);
    
    return element;
}

function updateDataObjects(element, itemData) {
    element.querySelectorAll('[data-object]').forEach(el => {
        const dataObjectAttr = el.getAttribute('data-object');
        if (dataObjectAttr.includes('{{')) {
            const expr = dataObjectAttr.match(/\{\{\s*(.*?)\s*\}\}/)[1].trim();
            const value = evaluateExpression(expr, itemData);
            if (value !== undefined && value !== null) {
                const stringified = JSON.stringify(value).replace(/"/g, "'");
                el.setAttribute('data-object', stringified);
            }
        }
    });
}

// Component lifecycle observer
const componentObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                handleNodeRemoval(node);
            }
        });
    });
});

function handleNodeRemoval(node) {
    const instance = node._componentInstance;
    if (instance) {
        instance.callHook(LIFECYCLE.BEFORE_DESTROY);
    }
    
    node.querySelectorAll('[data-component]').forEach(child => {
        const childInstance = child._componentInstance;
        if (childInstance) {
            childInstance.callHook(LIFECYCLE.BEFORE_DESTROY);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    componentObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});


// COMMON COMPONENTS CLASSES

class CarouselWithDots {
    constructor(carousel) {
        this.carousel = carousel;
        this.slidesContainer = carousel.querySelector('[data-carousel-slides-container]');
        this.paginationContainer = carousel.querySelector('[data-carousel-pagination]');
        this.currentSlide = 0;
        this.numSlides = this.slidesContainer.children.length;

        this.createDots();
        this.updateActiveDot();

        this.paginationContainer.addEventListener('click', this.handleDotClick.bind(this));

        // uncomment this to enable auto scroll
        // this.enableAutoScroll();
    }
  
    createDots() {
        this.paginationContainer.innerHTML = '';
        for (let i = 0; i < this.numSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        this.paginationContainer.appendChild(dot);
        }
    }
  
    updateActiveDot() {
        const dots = this.paginationContainer.children;
        for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
        }
        dots[this.currentSlide].classList.add('active');
    }
  
    handleDotClick(event) {
        if (event.target.classList.contains('carousel-dot')) {
            this.resetAutoScroll();
            const dots = this.paginationContainer.children;
            for (let i = 0; i < dots.length; i++) {
                if (dots[i] === event.target) {
                this.currentSlide = i;
                this.carousel.style.setProperty('--current-slide', this.currentSlide);
                this.updateActiveDot();
                }
            }
        }
    }

    enableAutoScroll() {
        this.autoScrollInterval = setInterval(this.autoScroll.bind(this), 4000); // Scroll every 3 seconds
    }

    autoScroll() {
        this.currentSlide = (this.currentSlide + 1) % this.numSlides;
        this.carousel.style.setProperty('--current-slide', this.currentSlide);
        this.updateActiveDot();
    }

    resetAutoScroll() {
        clearInterval(this.autoScrollInterval);
        this.enableAutoScroll();
    }
}

class CarouselWithButtons {
    constructor(carousel) {
      this.carousel = carousel;
      this.buttonPrevious = carousel.querySelector('[data-carousel-button-previous]');
      this.buttonNext = carousel.querySelector('[data-carousel-button-next]');
      this.slidesContainer = carousel.querySelector('[data-carousel-slides-container]');
      this.currentSlide = 0;
      this.numSlides = this.slidesContainer.children.length;
  
      this.buttonPrevious.addEventListener('click', this.handlePrevious.bind(this));
      this.buttonNext.addEventListener('click', this.handleNext.bind(this));
    }
  
    handleNext() {
      this.currentSlide = (this.currentSlide + 1) % this.numSlides;
      this.carousel.style.setProperty('--current-slide', this.currentSlide);
    }
  
    handlePrevious() {
      this.currentSlide = (this.currentSlide - 1 + this.numSlides) % this.numSlides;
      this.carousel.style.setProperty('--current-slide', this.currentSlide);
    }
}