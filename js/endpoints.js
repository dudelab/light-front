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

    "kpi1-homepage": ENV === "development"
        ? "/data/kpi1-homepage.json"
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

    "slider-announcements": ENV === "development"
        ? "/data/slider-announcements.json"
        : "https://api.miosito.com/announcements",

    "technologies": ENV === "development"
        ? "/data/technologies.json"
        : "https://api.miosito.com/technologies",

    "services-hero": ENV === "development"
        ? "/data/services-hero.json"
        : "https://api.miosito.com/services-hero",

    "services-features": ENV === "development"
        ? "/data/services-features.json"
        : "https://api.miosito.com/services-features",

    "competence-features": ENV === "development"
        ? "/data/competence-features.json"
        : "https://api.miosito.com/competence-features",

    "competence-perks": ENV === "development"
        ? "/data/competence-perks.json"
        : "https://api.miosito.com/competence-perks",
    
    "services-testimonials": ENV === "development"
        ? "/data/services-testimonials.json"
        : "https://api.miosito.com/services-testimonials",

    "contact-incentivo": ENV === "development"
        ? "/data/contact-incentivo.json"
        : "https://api.miosito.com/contact-incentivo",

    "service-1": ENV === "development"
        ? "/data/service-1.json"
        : "https://api.miosito.com/services/1",

    "kpi1-service-detail": ENV === "development"
        ? "/data/kpi1-service-detail.json"
        : "https://api.miosito.com/services/kpi/1",

    "related-contents-service-1": ENV === "development"
        ? "/data/related-contents-service-1.json"
        : "https://api.miosito.com/services/contents/1",

    "service-faq": ENV === "development"
        ? "/data/service-faq.json"
        : "https://api.miosito.com/services/faq/1",

    "slider-sustainability": ENV === "development"
        ? "/data/slider-sustainability.json"
        : "https://api.miosito.com/services/contents/1",

    "objectives-service": ENV === "development"
        ? "/data/objectives-service.json"
        : "https://api.miosito.com/services/objectives/1",

    "investment": ENV === "development"
        ? "/data/investment.json"
        : "https://api.miosito.com/investment/hero",

    "investment-kpi": ENV === "development"
        ? "/data/investment-kpi.json"
        : "https://api.miosito.com/investment/kpi",

    "objectives-investment": ENV === "development"
        ? "/data/objectives-investment.json"
        : "https://api.miosito.com/investment/objectives",

    "europe-link": ENV === "development"
        ? "/data/europe-link.json"
        : "https://api.miosito.com/investment/europe-link",

    "comments": ENV === "development"
        ? "/data/comments.json"
        : "https://api.miosito.com/investment/comments",
        
};
