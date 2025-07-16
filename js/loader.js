document.addEventListener('DOMContentLoaded', function() {
    const loader = document.querySelector('.page-transition-loader');
    const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="javascript:"]):not([href*=".pdf"]):not([href*=".doc"]):not([href*=".docx"])');
   
    // Función para ocultar el loader
    function hideLoader() {
        if (loader) {
            loader.classList.remove('active');
        }
    }
    
    // Función para mostrar el loader
    function showLoader() {
        if (loader) {
            loader.classList.add('active');
        }
    }
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Solo activar para enlaces que llevan a otras páginas del mismo sitio
            if (this.href && this.href.indexOf(window.location.hostname) !== -1 &&
                this.href !== window.location.href) {
                e.preventDefault();
                showLoader();
               
                setTimeout(() => {
                    window.location.href = this.href;
                }, 1000);
            }
        });
    });
   
    // Ocultar loader cuando la página termine de cargar
    window.addEventListener('load', function() {
        setTimeout(() => {
            hideLoader();
        }, 300);
    });
    
    // SOLUCIÓN: Ocultar loader cuando se navega con el botón atrás/adelante
    window.addEventListener('pageshow', function(event) {
        // Se ejecuta cuando la página se muestra, incluyendo navegación con botón atrás
        hideLoader();
    });
    
    // SOLUCIÓN ADICIONAL: Manejar el evento popstate (botón atrás)
    window.addEventListener('popstate', function(event) {
        hideLoader();
    });
    
    // SOLUCIÓN DE RESPALDO: Ocultar loader si está visible después de cierto tiempo
    setTimeout(() => {
        if (loader && loader.classList.contains('active')) {
            hideLoader();
        }
    }, 3000); // 3 segundos de respaldo
    
    // SOLUCIÓN EXTRA: Detectar visibilidad de la página
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // La página se volvió visible, ocultar loader si está activo
            hideLoader();
        }
    });
});