

// **Initialize the component with fetched news**
function populateNewsFiltered($newsFiltered, articles) {
  const $tagsContainer = $newsFiltered.find(".news-tags");
  const $newsList = $newsFiltered.find(".news-list");

  // **Extract unique tags from the news**
  const allTags = [...new Set(articles.flatMap(article => article.tags))];

  // **Create tags**
  allTags.forEach(tag => {
    const $tag = $("<span>").addClass("news-tag").text(tag);
    $tag.on("click", function () {
        $(this).toggleClass("active"); // ✅ Toggle selection
        filterNews($newsList, articles); // ✅ Pass all active tags
    });
    $tagsContainer.append($tag);
  });

  // **Render all news initially**
  renderNews($newsList, articles);
}

// **Filter news based on multiple selected tags**
function filterNews($newsList, articles) {
  const selectedTags = $(".news-tag.active").map(function () {
      return $(this).text();
  }).get(); // Get an array of selected tags

  if (selectedTags.length === 0) {
      // **No tag selected → Show all news**
      renderNews($newsList, articles);
  } else {
      // **Filter news based on selected tags**
      const filteredArticles = articles.filter(article =>
          article.tags.some(tag => selectedTags.includes(tag))
      );
      renderNews($newsList, filteredArticles);
  }
}

// **Render the news items**
function renderNews($newsList, articles) {
  $newsList.empty();
  articles.forEach(article => {
      const $newsItem = $("<div>").addClass("news-item");
      const $image = $("<img>").attr("src", article.image).attr("alt", article.title);;
      const $content = $("<div>").addClass("news-item-content");
      const $title = $("<h3>").addClass("news-item-title").text(article.title);
      const $description = $("<p>").addClass("news-item-description").text(article.description);
      const $tags = $("<p>").addClass("news-item-tags").text(article.tags.join(", "));

      $content.append($title, $description, $tags);
      $newsItem.append($image, $content);
      $newsList.append($newsItem);
  });
}
