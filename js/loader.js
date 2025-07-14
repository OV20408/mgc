document.addEventListener('DOMContentLoaded', function() {
    const loader = document.querySelector('.page-transition-loader');
    const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="javascript:"]):not([href*=".pdf"]):not([href*=".doc"]):not([href*=".docx"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Solo activar para enlaces que llevan a otras páginas del mismo sitio
            if (this.href && this.href.indexOf(window.location.hostname) !== -1 && 
                this.href !== window.location.href) {
                e.preventDefault();
                loader.classList.add('active');
                
                setTimeout(() => {
                    window.location.href = this.href;
                }, 1000);
            }
        });
    });
    
    // Ocultar loader cuando la página termine de cargar
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.classList.remove('active');
        }, 300);
    });
});