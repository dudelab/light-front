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

// Replace $(document).ready
document.addEventListener('DOMContentLoaded', function() {
    loadAllComponents(document.body);
});

const loadedScripts = new Set();
const loadedStyles = new Set();

function loadAllComponents(component, data) {
    Array.from(component.children).forEach(child => {
        const componentName = child.getAttribute("data-component");

        if (componentName) {
            const fullPath = getComponentFullPath(componentName);

            loadScript(`${fullPath}.js`, () => {
                mountComponentSafely(componentName, child, data);
            });

            loadCSS(`${fullPath}.css`);
            return;
        }
        if (child.children.length) loadAllComponents(child, data);
    });
}

const getComponentFullPath = (name) => `${COMPONENTS[name]}/${name}/${name}`;

function loadScript(src, callback = () => {}) {
    if (loadedScripts.has(src)) return callback();

    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = callback;
    document.head.appendChild(script);
    loadedScripts.add(src);
}

const loadCSS = (href) => {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        document.head.appendChild(link);
    }
};

async function loadTemplate(path, callback) {
    try {
        const response = await fetch(`${path}.html`);
        if (!response.ok) throw new Error(`Error loading ${path}`);
        callback(await response.text());
    } catch (error) {
        // console.error(`Error retrieving template '${path}':`, error);
    }
}

function mountComponentSafely(...args) {
    try {
        return mountComponent(...args);
    } catch (error) {
        console.error(`Failed to mount component:`, error);
        const div = document.createElement('div');
        div.className = 'component-error';
        div.textContent = 'Component failed to load';
        return div;
    }
}

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

const componentObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const instance = node._componentInstance;
                if (instance) {
                    instance.callHook(LIFECYCLE.BEFORE_DESTROY);
                }
                
                // Check removed children components
                node.querySelectorAll('[data-component]').forEach(child => {
                    const childInstance = child._componentInstance;
                    if (childInstance) {
                        childInstance.callHook(LIFECYCLE.BEFORE_DESTROY);
                    }
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    componentObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});

async function mountComponent(componentName, context, parentData) {
    const container = context;
    let objectAttr = container.getAttribute("data-object");
    const configAttr = container.getAttribute("data-config");
    let endpoint = container.getAttribute("data-endpoint");
    let data = null;

    const componentDef = ComponentRegistry.get(componentName);
    
    const instance = {
        ...componentDef,
        element: null,
        data: null,
        
        callHook: function(hookName) {
            if (typeof this[hookName] === 'function') {
                this[hookName](this.element, this.data);
            }
        }
    };

    instance.callHook(LIFECYCLE.BEFORE_MOUNT);

    if (objectAttr) {
        try {
            let processedAttr = objectAttr.replace(TEMPLATE_REGEX, (match, key) => {
                if (parentData) {
                    const value = evaluateExpression(key.trim(), parentData);
                    if (typeof value === "object" && value !== null) {
                        return JSON.stringify(value);
                    }
                    return value;
                }
                return '""';
            });
            data = JSON.parse(processedAttr.replace(/'/g, '"'));
        } catch (error) {
            console.error(`❌ Invalid data-object for ${componentName}:`, objectAttr, error);
        }
    }

    if (!data && endpoint) {
        data = await fetchData(endpoint);
    }

    if (configAttr) {
        try {
            data.config = JSON.parse(configAttr.replace(/'/g, '"'));
        } catch (error) {
            console.error(`❌ Invalid data-config for ${componentName}:`, configAttr, error);
        }
    }
    instance.data = data;

    const nestedComponents = Array.from(container.querySelectorAll('[data-component]'));
    nestedComponents.forEach(comp => comp.parentNode.removeChild(comp));
    
    const fullPath = getComponentFullPath(componentName);

    loadTemplate(fullPath, async (template) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = template;
        const component = tempDiv.firstElementChild;
        
        const originalClasses = container.getAttribute('class');
        if (originalClasses) {
            component.classList.add(...originalClasses.split(' '));
        }
        
        if (data) {
            compileComponent(component, data);
        }
        
        nestedComponents.forEach(comp => component.appendChild(comp));
        container.parentNode.replaceChild(component, container);
        
        instance.element = component;
        component._componentInstance = instance;
        
        if (data) {
            component._componentData = data;
        }
        
        instance.callHook(LIFECYCLE.MOUNTED);
        
        loadAllComponents(component, data);
    });

    return instance;
}

function compileComponent(component, data) {
    processVIf(component, data);
    processVFor(component, data);

    const processNode = (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            // Text Content Replacement
            node.childNodes.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    child.textContent = child.textContent.replace(TEMPLATE_REGEX, (_, expr) => {
                        const value = evaluateExpression(expr.trim(), data);
                        if (value === undefined || value === null) return _;
                        return typeof value === 'object' ? JSON.stringify(value) : value;
                    });
                }
            });

            // Attributes Replacement
            Array.from(node.attributes).forEach(attr => {
                if (attr.specified && attr.value.includes("{{") && attr.name !== "style") {
                    node.setAttribute(attr.name, attr.value.replace(TEMPLATE_REGEX, (_, expr) => {
                        const value = evaluateExpression(expr.trim(), data);
                        if (value === undefined || value === null) return _;
                        return typeof value === 'object' ? JSON.stringify(value) : value;
                    }));
                }
            });

            // Styles Replacement
            let inlineStyle = node.getAttribute("style");
            if (inlineStyle?.includes("[") || inlineStyle?.includes("{{")) {
                node.setAttribute("style", inlineStyle
                    .replace(STYLE_REGEX, (_, key) => getNestedValue(data, key.trim()) || "")
                    .replace(TEMPLATE_REGEX, (_, key) => getNestedValue(data, key.trim()) || "")
                );
            }
        }
    };

    processNode(component);
    Array.from(component.getElementsByTagName("*")).forEach(processNode);
}

const getNestedValue = (obj, key) => {
    try {
        return key.split(/[\.\[\]]/).filter(k => k).reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
    } catch (error) {
        console.warn(`Error accessing key: "${key}"`, error);
        return undefined;
    }
};

function processVIf(component, data) {
    component.querySelectorAll('[v-if]').forEach(el => {
        let condition = el.getAttribute("v-if").trim();

        try {
            let conditionFunction = new Function('data', `with(data) { return ${condition} }`);
            let result = conditionFunction(data);

            if (!result) el.parentNode.removeChild(el);
        } catch (error) {
            // console.error(`❌ Error evaluating v-if condition: "${condition}"`, error);
        }
    });
}

function processVFor(component, data) {
    component.querySelectorAll('[v-for]').forEach(parent => {
        const vForAttr = parent.getAttribute("v-for");
        if (vForAttr) {
            const [itemName, listName] = vForAttr.split(" in ").map(s => s.trim());
            const list = getNestedValue(data, listName);
            if (Array.isArray(list)) {
                const fragment = document.createDocumentFragment();
                list.forEach(item => {
                    let tempElement = parent.cloneNode(true);
                    let itemData = { ...data, [itemName]: item };
                    tempElement.removeAttribute("v-for");
                    tempElement.querySelectorAll('[data-object]').forEach(el => {
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
                    compileComponent(tempElement, itemData);
                    fragment.appendChild(tempElement);
                });
                parent.replaceWith(fragment);
            } else {
                console.warn(`v-for error: "${listName}" is not an array`);
            }
        }
    });
}

const evaluateExpression = (expr, data) => {
    const arrayMethodMatch = expr.match(/^(\w+)\[(\d+)\]\.(\w+)\.(\w+)\((.*?)\)$/);
    if (arrayMethodMatch) {
        const [_, arrayName, index, property, method] = arrayMethodMatch;
        const array = getNestedValue(data, arrayName);
        if (Array.isArray(array) && array[index]) {
            const value = array[index][property];
            if (typeof value === 'string' && typeof String.prototype[method] === 'function') {
                return value[method]();
            }
        }
        return undefined;
    }

    const arrayMatch = expr.match(/^(\w+)\[(\d+)\](\.[\w]+)?$/);
    if (arrayMatch) {
        const [_, arrayName, index, property] = arrayMatch;
        const array = getNestedValue(data, arrayName);
        if (Array.isArray(array) && array[index]) {
            return property 
                ? getNestedValue(array[index], property.slice(1)) 
                : array[index];
        }
        return undefined;
    }

    return getNestedValue(data, expr);
};