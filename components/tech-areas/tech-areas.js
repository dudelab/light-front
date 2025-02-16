


/*
// **Funzione per popolare le tech-areas**
function populateTechAreas($section, data) {


    const items = data.items || []; 
    const $itemsContainer = $section.find(".tech-areas-container");
    $itemsContainer.empty(); 


    loadTechs($section, items);


}



function loadTechs($section, items) {

  loadTemplate("/components/tech-areas/components/tech-item", function (template) {
      $techContainer = $section.find(".tech-areas-container")
      items.forEach((ft, index) => {
          if(index>1) return;
          const $card = $(template);

          //$card.find(".tech-item-id").text(ft.id || "");
          //$card.find(".tech-item-name").text(ft.name || "");
          //$card.find(".tech-item-description").text(ft.description || "");
          //$card.find(".tech-item-link").html('<i class="fa-solid fa-arrow-up rotate-45"></i>').attr("href", ft.link);
          //$card.find(".tech-item-image").css("background-image", `url(${ft.image})`);



          if (ft.tags) {
              const $tags = $card.find(".tech-item-tags");
              ft.tags.forEach((tag, index) => {
                const isLast = index === ft.tags.length - 1;
                const newTag = `
                    <span class="tech-item-tag">${tag}</span>
                    ${isLast ? '' : '<div style="color:#3E5177;margin:0 8px 0 8px">•</div>'}
                `;
                $tags.append(newTag);
            });
          }

          $techContainer.append($card);
      });

  });
}

    */
