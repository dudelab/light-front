
if (typeof ComponentRegistry !== 'undefined') {
    ComponentRegistry.register('news', {
        mounted(element, data) {
            new initNewsComponent(element);
            // new CardsCarousel(element);
        }
    });
}

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.news').forEach(component => new initNewsComponent(component));
    });
})();

class initNewsComponent {
    constructor(component) {
        this.carousel = component.querySelector('.container');
        if (!this.carousel) {
            console.warn('Nessun container trovato nel carosello');
            return;
        }

        this.pageLabel = component.querySelector('.currentPage');
        if (!this.pageLabel) {
            console.warn('Nessun page label trovato nel carosello');
            return;
        }
        this.totPagesLabel = component.querySelector('.totPages');
        if (!this.totPagesLabel) {
            console.warn('Nessun tot pages label trovato nel carosello');
            return;
        }
        
        this.currentPage = 1;
        this.totPagesLabel.innerHTML = this.carousel.children.length;

        this.prevBtn = component.querySelector('#prevBtn');
        if (!this.prevBtn) {
            console.warn('Nessun pulsante prev trovato nel carosello');
            return;
        }
        this.nextBtn = component.querySelector('#nextBtn');
        if (!this.nextBtn) {
            console.warn('Nessun pulsante next trovato nel carosello');
            return;
        }

        this.prevBtn.addEventListener('click', this.prevPage.bind(this));
        this.nextBtn.addEventListener('click', this.nextPage.bind(this));
    
        this.updatePage();
    }

    prevPage() {        
        if(this.currentPage == 1) return;
        this.currentPage--;
        this.updatePage();
    }

    nextPage() {        
        if(this.currentPage == this.carousel.children.length) return;
        this.currentPage++;
        this.updatePage();
    }

    updatePage() {
        const children = this.carousel.children;
        
        for (let i = 1; i <= children.length; i++) {
            children[i-1].classList.remove("visible");
            if(i == this.currentPage){
                children[i-1].classList.add("visible");
            }
        }
        this.pageLabel.innerHTML = this.currentPage;
    }

   

}
