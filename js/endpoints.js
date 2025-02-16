const ENV = "development"; // Cambia in "production" per usare le API

const API_ENDPOINTS = {
    "menu": ENV === "development"
        ? "/data/menu.json"
        : "https://api.miosito.com/menu",

    "latest-news": ENV === "development"
        ? "/data/latest-news.json"
        : "https://api.miosito.com/news/latest",
    
    "homepage-hero": ENV === "development"
        ? "/data/homepage-hero.json"
        : "https://api.miosito.com/hero/homepage",

    "kpis": ENV === "development"
        ? "/data/kpis.json"
        : "https://api.miosito.com/kpi-1",

    "partners": ENV === "development"
        ? "/data/partners.json"
        : "https://api.miosito.com/partners",

    "features-home": ENV === "development"
        ? "/data/features-home.json"
        : "https://api.miosito.com/features",

    "news-articles": ENV === "development"
        ? "/data/news-articles.json"
        : "https://api.miosito.com/news",

    "single-card-slider": ENV === "development"
        ? "/data/single-card-slider.json"
        : "https://api.miosito.com/announcements",

    "technologies": ENV === "development"
        ? "/data/technologies.json"
        : "https://api.miosito.com/technologies"
};
