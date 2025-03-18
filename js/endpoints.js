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

    "carousel-blog": ENV === "development"
        ? "/data/carousel-blog.json"
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

    "features-education": ENV === "development"
        ? "/data/features-education.json"
        : "https://api.miosito.com/features-education",

    "features-steps": ENV === "development"
        ? "/data/features-steps.json"
        : "https://api.miosito.com/features-education",

    "competence-perks": ENV === "development"
        ? "/data/competence-perks.json"
        : "https://api.miosito.com/competence-perks",
    
    "services-testimonials": ENV === "development"
        ? "/data/services-testimonials.json"
        : "https://api.miosito.com/services-testimonials",

    "contact-incentivo": ENV === "development"
        ? "/data/contact-incentivo.json"
        : "https://api.miosito.com/contact-incentivo",

    "hero-service": ENV === "development"
        ? "/data/hero-service.json"
        : "https://api.miosito.com/services/1",

    "kpi1-service-detail": ENV === "development"
        ? "/data/kpi1-service-detail.json"
        : "https://api.miosito.com/services/kpi/1",

    "carousel-website-contents": ENV === "development"
        ? "/data/carousel-website-contents.json"
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

    "hero-investment": ENV === "development"
        ? "/data/hero-investment.json"
        : "https://api.miosito.com/hero-investment/hero",

    "hero-competence": ENV === "development"
        ? "/data/hero-competence.json"
        : "https://api.miosito.com/hero-competence/hero",

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

    "kpi-detail-competence": ENV === "development"
        ? "/data/kpi-detail-competence.json"
        : "https://api.miosito.com/services/kpi/1",

    "carousel-competence": ENV === "development"
        ? "/data/carousel-competence.json"
        : "https://api.miosito.com/services/kpi/1",

    "technologies-hero": ENV === "development"
        ? "/data/technologies-hero.json"
        : "https://api.miosito.com/technologies/hero",

    "hero-technology": ENV === "development"
        ? "/data/hero-technology.json"
        : "https://api.miosito.com/technology/1/hero",

    "processes": ENV === "development"
        ? "/data/processes.json"
        : "https://api.miosito.com/technology/1/processes",

    "single-slider-events": ENV === "development"
        ? "/data/single-slider-events.json"
        : "https://api.miosito.com/slider/events",

    "financings": ENV === "development"
        ? "/data/financings.json"
        : "https://api.miosito.com/investment/financings",

    "statistics": ENV === "development"
        ? "/data/statistics.json"
        : "https://api.miosito.com/events/statistics",

    "statistics-tenders": ENV === "development"
        ? "/data/statistics-tenders.json"
        : "https://api.miosito.com/events/statistics-tenders",
    
    "statistics-success-projects": ENV === "development"
        ? "/data/statistics-success-projects.json"
        : "https://api.miosito.com/events/statistics-success-projects",

    "cards-event": ENV === "development"
        ? "/data/cards-event.json"
        : "https://api.miosito.com/events/cards",

    "competence-center-banner": ENV === "development"
        ? "/data/competence-center-banner.json"
        : "https://api.miosito.com/events/competence-center",

    "consulenti-link": ENV === "development"
        ? "/data/consulenti-link.json"
        : "https://api.miosito.com/consulenti",

    "moments": ENV === "development"
        ? "/data/moments.json"
        : "https://api.miosito.com/events/moments",

    "hero-projects": ENV === "development"
        ? "/data/hero-projects.json"
        : "https://api.miosito.com/projects-success/hero",

    "projects-groups-slider": ENV === "development"
        ? "/data/projects-groups-slider.json"
        : "https://api.miosito.com/projects-success/group-slider",

    "projects-double-card-slider": ENV === "development"
        ? "/data/projects-double-card-slider.json"
        : "https://api.miosito.com/projects-success/projects-double-card-slider",
        
    "hero-news": ENV === "development"
        ? "/data/hero-news.json"
        : "https://api.miosito.com/news/hero",

    "slider-tenders": ENV === "development"
        ? "/data/slider-tenders.json"
        : "https://api.miosito.com/tenders/slider",

    "hero-tenders": ENV === "development"
        ? "/data/hero-tenders.json"
        : "https://api.miosito.com/tenders/hero",

    "news": ENV === "development"
        ? "/data/news.json"
        : "https://api.miosito.com/news",

    "protagonists": ENV === "development"
        ? "/data/protagonists.json"
        : "https://api.miosito.com/protagonists",

    "sectors": ENV === "development"
        ? "/data/sectors.json"
        : "https://api.miosito.com/sectors",

    "hero-innovation": ENV === "development"
        ? "/data/hero-innovation.json"
        : "https://api.miosito.com/sectors",

    "hero-competence-center": ENV === "development"
        ? "/data/hero-competence-center.json"
        : "https://api.miosito.com/competence-center/hero",

    "statistics-2": ENV === "development"
        ? "/data/statistics-2.json"
        : "https://api.miosito.com/competence-center/statistics",

    "contact-incentivo-2": ENV === "development"
        ? "/data/contact-incentivo-2.json"
        : "https://api.miosito.com/contact-incentivo-2",

    "carousel-competence-center": ENV === "development"
        ? "/data/carousel-competence-center.json"
        : "https://api.miosito.com/services/kpi/1",

        
};
