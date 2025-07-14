//this is contact.js
// Contact form handling
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    
    // Validate form
    if (!validateForm(form)) {
        alert('Por favor, complete todos los campos requeridos correctamente.');
        return;
    }
    
    // Get form data
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Show success message (in a real implementation, this would send data to server)
    alert('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');
    
    // Reset form
    form.reset();
}

// Add form styles for better UX
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
            }
        });
    });
});

