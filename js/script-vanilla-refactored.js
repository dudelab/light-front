// Constants remain the same
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
    "tech-item": "/components",
    "blog-card": "/components",
    "slider": "/components"
};

const TEMPLATE_REGEX = /\{\{\s*(.*?)\s*\}\}/g;
const STYLE_REGEX = /\[\s*(.*?)\s*\]/g;

// Resource loading state
const loadedScripts = new Set();
const loadedStyles = new Set();

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    loadAllComponents(document.body);
});

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
    if (loadedScripts.has(src)) return callback();

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
    
    transferClasses(container, component);
    
    if (data) {
        compileComponent(component, data);
    }
    
    nestedComponents.forEach(comp => component.appendChild(comp));
    container.parentNode.replaceChild(component, container);
    
    finalizeComponent(component, instance, data);
    instance.callHook(LIFECYCLE.MOUNTED);
    
    await loadAllComponents(component, data);
}

function transferClasses(source, target) {
    const originalClasses = source.getAttribute('class');
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
    }

    Array.from(node.children).forEach(child => {
        processNodeAndChildren(child, data);
    });
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

        const [itemName, listName] = vForAttr.split(" in ").map(s => s.trim());
        const list = getNestedValue(data, listName);
        
        if (!Array.isArray(list)) {
            console.warn(`v-for error: "${listName}" is not an array`);
            return;
        }

        const fragment = document.createDocumentFragment();
        list.forEach(item => {
            const clonedElement = createLoopElement(parent, data, item, itemName);
            fragment.appendChild(clonedElement);
        });
        
        parent.replaceWith(fragment);
    });
}

function createLoopElement(template, parentData, item, itemName) {
    const element = template.cloneNode(true);
    const itemData = { ...parentData, [itemName]: item };
    
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