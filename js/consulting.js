// consultoria.js
document.addEventListener('DOMContentLoaded', function() {
    // Configurar acordeón
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
    
    // Mejoras de seguridad básicas según OWASP
    // 1. Protección contra XSS en formularios (si los hay)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Validación básica de campos
            const inputs = form.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                // Limpieza básica de entradas
                if (input.value) {
                    input.value = input.value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }
                
                // Validación requerida
                if (input.required && !input.value.trim()) {
                    input.classList.add('error');
                    isValid = false;
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Por favor complete todos los campos requeridos.');
            }
        });
    });
    
    // 2. Protección contra clickjacking
    if (self == top) {
        document.documentElement.style.visibility = 'visible';
    } else {
        top.location = self.location;
    }

});