// // **Popola il contenuto della singleCardSlider**
// function populateSingleCardSlider($singleCardSlider, data) {

//     // **Popola title, subtitle e text**
//     $singleCardSlider.find(".single-card-slider-title").text(data.title || "").toggle(!!data.title);
//     $singleCardSlider.find(".single-cardS-sider-subtitle").text(data.subtitle || "").toggle(!!data.subtitle);

   

//     // carica il template della card
//     loadTemplate("single-card-slider/components/card-item", function (template) {
//         const $cards=$singleCardSlider.find(".single-card-slider-cards")
//         const $card=$(template)
//         data.cards.forEach((singlecard)=> {
//             $card.find(".title").text(singlecard.title || "");
//             $card.find(".title-card").text(singlecard.title_card || "");
//             $card.find(".text-card").text(singlecard.text_card || "");
//             $card.find(".single-card-slider-button-announcement").attr("href", singlecard.url_announcement || "");
//             // $card.find(".single-card-slider-button-announcement").href(singlecard.url_announcement || "");

//             $cards.append($card)
//         })
//     });
// }

function timeResponse(data){
    console.log(data);
    
}
