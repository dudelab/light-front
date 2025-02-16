// **Dynamically load JavaScript files before running the app**
const config = '/js/endpoints.js';
const api = '/js/api.js';
const script = '/js/script.js';

function loadScript(src) {
  return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
          resolve();
      };
      script.onerror = () => {
          reject(new Error(`Failed to load script: ${src}`));
      };
      document.head.appendChild(script);
  });
}

Promise.all([
  loadScript(config),
  loadScript(api),
  loadScript(script)
]).then(() => {
  // after scripts here
}).catch(error => {
  console.error("❌ Failed to load .js file:", error);
});
