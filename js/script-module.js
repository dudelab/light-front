// Component paths configuration
const COMPONENTS = {
    "news": "/components/_test-components",
    "news-filtered": "/components/_test-components",
    
    "header": "/components",
    "footer": "/components",
    "hero": "/components",
    "kpi-1": "/components",
    "kpi-1-card": "/components",
    "logo-strip": "/components",
    "features-home": "/components",
    "contact-box": "/components",
    "cards-carousel": "/components",
    "single-card-slider": "/components",
    "tech-areas": "/components",
    "tech-item": "/components"
};

// Lifecycle hooks
const LIFECYCLE = {
    BEFORE_MOUNT: 'beforeMount',
    MOUNTED: 'mounted',
    BEFORE_DESTROY: 'beforeDestroy'
};

// Track loaded resources
const loadedResources = {
    scripts: new Set(),
    styles: new Set()
};

// Component Registry for storing component definitions
class ComponentRegistry {
    static components = {};
    
    static register(name, definition) {
        this.components[name] = definition;
    }
    
    static get(name) {
        return this.components[name] || {
            beforeMount: () => {},
            mounted: () => {},
            beforeDestroy: () => {}
        };
    }
}

// Utility functions
const getComponentPath = (name) => `${COMPONENTS[name]}/${name}/${name}`;

const getNestedValue = (obj, path) => 
    path.split('.').reduce((value, key) => value?.[key], obj);

// Resource loading
async function loadScript(src) {
    if (loadedResources.scripts.has(src)) return;
    
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = resolve; // Resolve even on error to continue
        document.head.appendChild(script);
        loadedResources.scripts.add(src);
    });
}

function loadStyle(href) {
    if (loadedResources.styles.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    document.head.appendChild(link);
    loadedResources.styles.add(href);
}

async function loadTemplate(path) {
    try {
        const response = await fetch(`${path}.html`);
        if (!response.ok) throw new Error(`Failed to load template: ${path}`);
        return await response.text();
    } catch (error) {
        console.warn(`Template loading failed for ${path}:`, error);
        return null;
    }
}

// Template processing
function processTemplate(template, data) {
    if (!template) return '';
    
    return template.replace(/\{\{\s*(.*?)\s*\}\}/g, (match, expression) => {
        const value = evaluateExpression(expression.trim(), data);
        return value ?? match;
    });
}

function evaluateExpression(expr, data) {
    // Handle array access with method
    const arrayMethodMatch = expr.match(/^(\w+)\[(\d+)\]\.(\w+)\.(\w+)\((.*?)\)$/);
    if (arrayMethodMatch) {
        const [_, arrayName, index, property, method] = arrayMethodMatch;
        const array = getNestedValue(data, arrayName);
        if (Array.isArray(array) && array[index]) {
            const value = array[index][property];
            return typeof value?.[method] === 'function' ? value[method]() : undefined;
        }
        return undefined;
    }

    // Handle array access
    const arrayMatch = expr.match(/^(\w+)\[(\d+)\](\.[\w]+)?$/);
    if (arrayMatch) {
        const [_, arrayName, index, property] = arrayMatch;
        const array = getNestedValue(data, arrayName);
        if (Array.isArray(array) && array[index]) {
            return property ? 
                getNestedValue(array[index], property.slice(1)) : 
                array[index];
        }
        return undefined;
    }

    // Handle simple property access
    return getNestedValue(data, expr);
}

// Directive processing
function processDirectives(element, data) {
    processVIf(element, data);
    processVFor(element, data);
    processAttributes(element, data);
}

function processVIf(element, data) {
    const vIfElements = element.querySelectorAll('[v-if]');
    vIfElements.forEach(el => {
        const condition = el.getAttribute('v-if').trim();
        try {
            const result = new Function('data', `with(data) { return ${condition} }`)(data);
            if (!result) el.remove();
        } catch (error) {
            console.warn(`v-if evaluation failed for "${condition}"`, error);
        }
    });
}

function processVFor(element, data) {
    const vForElements = element.querySelectorAll('[v-for]');
    vForElements.forEach(el => {
        const [itemName, listName] = el.getAttribute('v-for').split(' in ').map(s => s.trim());
        const list = getNestedValue(data, listName);
        
        if (Array.isArray(list)) {
            const template = el.outerHTML;
            const fragment = document.createDocumentFragment();
            
            list.forEach(item => {
                const itemData = { ...data, [itemName]: item };
                const temp = document.createElement('div');
                temp.innerHTML = processTemplate(template, itemData);
                const newElement = temp.firstElementChild;
                processDirectives(newElement, itemData);
                fragment.appendChild(newElement);
            });
            
            el.replaceWith(fragment);
        }
    });
}

function processAttributes(element, data) {
    element.querySelectorAll('*').forEach(el => {
        [...el.attributes].forEach(attr => {
            if (attr.value.includes('{{')) {
                const newValue = processTemplate(attr.value, data);
                el.setAttribute(attr.name, newValue);
            }
        });
    });
}

// Component mounting
async function mountComponent(name, element, parentData = {}) {
    const componentDef = ComponentRegistry.get(name);
    const instance = {
        ...componentDef,
        element: null,
        data: null
    };

    // Process data
    let data = parentData;
    try {
        const dataAttr = element.getAttribute('data-object');
        if (dataAttr) {
            data = {
                ...parentData,
                ...JSON.parse(dataAttr.replace(/'/g, '"'))
            };
        }
    } catch (error) {
        console.warn(`Data parsing failed for ${name}:`, error);
    }
    instance.data = data;

    // Load resources
    const path = getComponentPath(name);
    await loadScript(`${path}.js`);
    loadStyle(`${path}.css`);

    // Load and process template
    const template = await loadTemplate(path);
    if (!template) return null;

    const temp = document.createElement('div');
    temp.innerHTML = processTemplate(template, data);
    const component = temp.firstElementChild;

    // Process directives
    processDirectives(component, data);

    // Handle nested components
    const nestedComponents = [...element.querySelectorAll('[data-component]')];
    nestedComponents.forEach(nested => {
        const nestedName = nested.getAttribute('data-component');
        mountComponent(nestedName, nested, data);
    });

    // Replace original element
    element.replaceWith(component);
    instance.element = component;

    return instance;
}

// Initialize components
function initComponents() {
    document.querySelectorAll('[data-component]').forEach(element => {
        const name = element.getAttribute('data-component');
        mountComponent(name, element);
    });
}

// Start on DOM load
document.addEventListener('DOMContentLoaded', initComponents);

// Export for use in other files
export { ComponentRegistry, mountComponent, initComponents };