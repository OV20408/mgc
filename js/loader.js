document.addEventListener('DOMContentLoaded', function() {
    const loader = document.querySelector('.page-transition-loader');
    const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="javascript:"]):not([href*=".pdf"]):not([href*=".doc"]):not([href*=".docx"])');
    
    // Ocultar loader inmediatamente al inicio
    if (loader) {
        loader.classList.remove('active');
    }
    
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
                
                // Usar sessionStorage para marcar que estamos navegando
                sessionStorage.setItem('navigationInProgress', 'true');
                
                setTimeout(() => {
                    window.location.href = this.href;
                }, 1000);
            }
        });
    });
    
    // Ocultar loader cuando la página termine de cargar
    window.addEventListener('load', function() {
        setTimeout(hideLoader, 300);
    });
    
    // SOLUCIÓN MEJORADA: Manejar navegación hacia atrás en móviles
    window.addEventListener('pageshow', function(event) {
        // Verificar si es una navegación desde caché (como al presionar atrás)
        if (event.persisted) {
            hideLoader();
        }
    });
    
    // SOLUCIÓN ADICIONAL: Manejar el evento popstate (botón atrás)
    window.addEventListener('popstate', function() {
        hideLoader();
    });
    
    // SOLUCIÓN DE RESPALDO: Verificar estado de navegación al cargar
    document.addEventListener('DOMContentLoaded', function() {
        // Si no hay navegación en progreso, ocultar loader
        if (sessionStorage.getItem('navigationInProgress') !== 'true') {
            hideLoader();
        }
        sessionStorage.removeItem('navigationInProgress');
    });
    
    // SOLUCIÓN DE RESERVA: Ocultar loader si está visible después de cierto tiempo
    setTimeout(function() {
        if (loader && loader.classList.contains('active')) {
            hideLoader();
        }
    }, 3000);
    
    // SOLUCIÓN EXTRA: Detectar visibilidad de la página
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            hideLoader();
        }
    });
});