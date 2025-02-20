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


$(document).ready(function () {
    loadAllComponents($('body'))
});

const loadedScripts = new Set();
const loadedStyles = new Set();

function loadAllComponents($component, data) {
    $component.children().each((_, child) => {
        const $child = $(child);

        const componentName = $child.attr("data-component");

        if (componentName) {
           
            // const componentName = $child.prop("tagName").toLowerCase();
            // if (!Object.keys(COMPONENTS).includes(componentName)) return;
            const fullPath = getComponentFullPath(componentName);

            loadScript(`${fullPath}.js`, () => {
                mountComponentSafely(componentName, $child, data);
            });

            loadCSS(`${fullPath}.css`);
            return;
        };
        if ($child.children().length) loadAllComponents($child, data);
    });
}

const getComponentFullPath = (name) => `${COMPONENTS[name]}/${name}/${name}`
function loadScript(src, callback = () => {}) {
    if (loadedScripts.has(src)) return callback(); // Skip if already loaded

    $.getScript(src)
        .done(callback)
        .fail(callback);

    loadedScripts.add(src);
}
const loadCSS = (href) => !$(`link[href="${href}"]`).length && $("<link>", { rel: "stylesheet", type: "text/css", href }).appendTo("head");

async function loadTemplate(path, callback) {
    try {
        const response = await fetch(`${path}.html`);
        if (!response.ok) throw new Error(`Errore nel caricamento di ${path}`);
        callback(await response.text());
    } catch (error) {
        // console.error(`Errore nel recupero del template '${path}':`, error);
    }
}

function mountComponentSafely(...args) {
    try {
        return mountComponent(...args);
    } catch (error) {
        console.error(`Failed to mount component:`, error);
        return $(`<div class="component-error">Component failed to load</div>`);
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
                const $node = $(node);
                const instance = $node.data("componentInstance");
                if (instance) {
                    instance.callHook(LIFECYCLE.BEFORE_DESTROY);
                }
                
                // Check removed children components too
                $node.find("[data-component]").each(function() {
                    const childInstance = $(this).data("componentInstance");
                    if (childInstance) {
                        childInstance.callHook(LIFECYCLE.BEFORE_DESTROY);
                    }
                });
            }
        });
    });
});

$(document).ready(() => {
    componentObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});

async function mountComponent(componentName, $context, parentData) {
    const $container = $context;
    let objectAttr = $container.attr("data-object");
    const configAttr = $container.attr("data-config");
    let endpoint = $container.attr("data-endpoint");
    let data = null;

    // Get component definition from registry or use empty component
    const componentDef = ComponentRegistry.get(componentName);
    
    // Create new instance for this mount
    const instance = {
        ...componentDef,
        $element: null,
        data: null,
        
        // Method to call lifecycle hooks
        callHook: function(hookName) {
            if (typeof this[hookName] === 'function') {
                this[hookName](this.$element, this.data);
            }
        }
    };

    // Call beforeMount
    instance.callHook(LIFECYCLE.BEFORE_MOUNT);

    // Parse data from data-object if it exists
    if (objectAttr) {
        try {
            // First compile the data-object string to handle nested template variables
            let processedAttr = objectAttr.replace(TEMPLATE_REGEX, (match, key) => {
                if (parentData) {
                    const value = evaluateExpression(key.trim(), parentData);
                    if (typeof value === "object" && value !== null) {
                        return JSON.stringify(value);
                    }
                    return value;
                }
                return '""'; // Return empty string for undefined values
            });
            data = JSON.parse(processedAttr.replace(/'/g, '"'));
        } catch (error) {
            console.error(`❌ Invalid data-object for ${componentName}:`, objectAttr, error);
        }
    }

    // If no data-object or it failed to parse, try endpoint
    if (!data && endpoint) {
        data = await fetchData(endpoint);
    }

    // add the config into the data object
    if (configAttr) {
        try {
            data.config = JSON.parse(configAttr.replace(/'/g, '"'));
        } catch (error) {
            console.error(`❌ Invalid data-config for ${componentName}:`, configAttr, error);
        }
    }
    instance.data = data;

    const nestedComponents = $container.find("[data-component]").detach();
    const fullPath = getComponentFullPath(componentName);

    loadTemplate(fullPath, async (template) => {
        const $component = $(template);
        
        // Preserve classes from the original container
        const originalClasses = $container.attr('class');
        if (originalClasses) {
            $component.addClass(originalClasses);
        }
        
        // Compile the main template with its data
        if (data) {
            compileComponent($component, data);
        }
        
        // Then append nested components
        $component.append(nestedComponents);
        $container.replaceWith($component);
        
        // Store references
        instance.$element = $component;
        $component.data("componentInstance", instance);
        
        if (data) {
            $component.data("componentData", data);
        }
        
        // Call mounted hook
        instance.callHook(LIFECYCLE.MOUNTED);
        
        // Process nested components with the current component's data
        loadAllComponents($component, data);
    });

    return instance;
}


function compileComponent($component, data) {
    processVIf($component, data);
    processVFor($component, data);

    $component.add($component.find("*")).each(function() {
        let $el = $(this);

        // Text Content Replacement
        $el.html($el.html().replace(TEMPLATE_REGEX, (_, expr) => {
            const value = evaluateExpression(expr.trim(), data);
            if (value === undefined || value === null) return _;
            return typeof value === 'object' ? JSON.stringify(value) : value;
        }));

        // Attributes Replacement
        $.each(this.attributes, function() {
            if (this.specified && this.value.includes("{{") && this.name !== "style") {
                $el.attr(this.name, this.value.replace(TEMPLATE_REGEX, (_, expr) => {
                    const value = evaluateExpression(expr.trim(), data);
                    if (value === undefined || value === null) return _;
                    return typeof value === 'object' ? JSON.stringify(value) : value;
                }));
            }
        });

        // Styles Replacement
        let inlineStyle = $el.attr("style");
        if (inlineStyle?.includes("[") || inlineStyle?.includes("{{")) {
            $el.attr("style", inlineStyle
                .replace(STYLE_REGEX, (_, key) => getNestedValue(data, key.trim()) || "")
                .replace(TEMPLATE_REGEX, (_, key) => getNestedValue(data, key.trim()) || "")
            );
        }
    });
}

const getNestedValue = (obj, key) => {
    try {
        return key.split(/[\.\[\]]/).filter(k => k).reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
    } catch (error) {
        console.warn(`Error accessing key: "${key}"`, error);
        return undefined;
    }
};


function processVIf($component, data) {
    $component.find("[v-if]").each(function () {
        const $el = $(this);
        let condition = $el.attr("v-if").trim();

        try {
            let conditionFunction = new Function('data', `with(data) { return ${condition} }`);
            let result = conditionFunction(data);

            if (!result) $el.remove();
        } catch (error) {
            // console.error(`❌ Error evaluating v-if condition: "${condition}"`, error);
        }
    });
}


function processVFor($component, data) {
    $component.find("[v-for]").each(function () {
        const $parent = $(this);
        const vForAttr = $parent.attr("v-for");

        if (vForAttr) {
            const [itemName, listName] = vForAttr.split(" in ").map(s => s.trim());
            const list = getNestedValue(data, listName);

            if (Array.isArray(list)) {
                const $container = $('<div></div>');
                
                list.forEach(item => {
                    let $tempElement = $parent.clone();
                    let itemData = { ...data, [itemName]: item };
                    
                    // Remove v-for attribute to prevent infinite processing
                    $tempElement.removeAttr("v-for");
                    
                    // Special handling for data-object attributes with template syntax
                    $tempElement.find('[data-object]').each(function() {
                        const $this = $(this);
                        const dataObjectAttr = $this.attr('data-object');
                        
                        if (dataObjectAttr.includes('{{')) {
                            const expr = dataObjectAttr.match(/\{\{\s*(.*?)\s*\}\}/)[1].trim();
                            const value = evaluateExpression(expr, itemData);
                            if (value !== undefined && value !== null) {
                                // Properly stringify the object and ensure single quotes
                                const stringified = JSON.stringify(value).replace(/"/g, "'");
                                $this.attr('data-object', stringified);
                            }
                        }
                    });
                    
                    // Process other template variables
                    compileComponent($tempElement, itemData);
                    $container.append($tempElement);
                });

                $parent.replaceWith($container.contents());
            } else {
                console.warn(`v-for error: "${listName}" is not an array`);
            }
        }
    });
}

// Helper function to evaluate expressions
const evaluateExpression = (expr, data) => {
    // First try array access with method
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

    // Then try array access
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

    // Then try simple property access
    return getNestedValue(data, expr);
};