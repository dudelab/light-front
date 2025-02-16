async function fetchData(key, useAjax = false) {
  const url = API_ENDPOINTS[key];

  if (!url) {
      console.error(`❌ Nessun endpoint trovato per '${key}'`);
      return null;
  }

  // **Se siamo in sviluppo, carichiamo il file JSON locale**
  if (ENV === "development") {
      return fetchLocalJson(url);
  }

  // **Se richiesto, usa AJAX invece di fetch**
  if (useAjax) {
      return fetchFromApiWithAjax(url);
  }

  return fetchFromApi(url);
}

async function fetchLocalJson(filePath) {
  try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
      return await response.json();
  } catch (error) {
      console.error(`❌ Errore nel recupero del file JSON '${filePath}':`, error);
      return null;
  }
}

async function fetchFromApi(apiUrl) {
  try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
      return await response.json();
  } catch (error) {
      console.error(`❌ Errore nella chiamata API '${apiUrl}':`, error);
      return null;
  }
}

async function fetchFromApiWithAjax(apiUrl) {
  return new Promise((resolve, reject) => {
      $.ajax({
          url: apiUrl,
          method: "GET",
          dataType: "json",
          success: function (data) {
              resolve(data);
          },
          error: function (xhr, status, error) {
              console.error(`❌ Errore AJAX per ${apiUrl}:`, error);
              reject(error);
          }
      });
  });
}
