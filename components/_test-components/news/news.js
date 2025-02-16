$(document).ready(async function () {
    const componentName="news"
    mountComponent(componentName, populateNews);
});

// **Funzione per popolare le news**
function populateNews($component, data) {
    const $newsTemplate = $component.find(".news-item").clone();
    $component.empty(); // Svuota la sezione prima di aggiungere le nuove news

    data.forEach(newsItem => {
        const $news = $newsTemplate.clone();

        $news.find(".news-image").attr("src", newsItem.image).attr("alt", newsItem.title);
        $news.find(".news-title").text(newsItem.title);
        $news.find(".news-description").text(newsItem.description);

        // Aggiunge i tag
        const $tagsItemTemplate = $news.find(".news-tags .news-tag").clone();
        const $tagsContainer = $news.find(".news-tags").empty();
        if (newsItem.tags && newsItem.tags.length) {
            newsItem.tags.forEach(tag => {
                const $tagItem = $tagsItemTemplate.clone();
                $tagItem.text(tag)
                $tagsContainer.append($tagItem);
            });
        }

        $component.append($news);
    });
}
