//this is contact.js

//this is my email.js public key to use
const publicKey = 'KmamiCc6sWkpv5wli';

// EmailJS ya está inicializado en el HTML, no necesitamos inicializarlo aquí

// Contact form handling
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!validateForm(form)) {
        alert('Por favor, complete todos los campos requeridos correctamente.');
        return;
    }
    
    // Mostrar estado de carga
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    
    // Preparar datos para EmailJS
    const templateParams = {
        from_name: form.nombre.value + ' ' + form.apellido.value,
        from_email: form.email.value,
        phone: form.telefono.value || 'No proporcionado',
        subject: form.asunto.value,
        message: form.mensaje.value,
        to_name: 'Ramiro Moscoso', // Nombre del destinatario
        to_email: 'ramiromoscosoz@hotmail.com' // Email del destinatario
    };
    
    // Enviar email usando EmailJS
    emailjs.send('service_np0ungc', 'template_y4bk5hn', templateParams)
        .then(function(response) {
            console.log('Email enviado exitosamente:', response);
            alert('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');
            form.reset();
            
            // Restaurar botón
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Mensaje';
            
            // Remover clases focused de los form groups
            const formGroups = form.querySelectorAll('.form-group');
            formGroups.forEach(group => group.classList.remove('focused'));
            
        })
        .catch(function(error) {
            console.error('Error al enviar email:', error);
            alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente o contacta directamente a ramiromoscosoz@hotmail.com');
            
            // Restaurar botón
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Mensaje';
        });
}

// Función de validación
function validateForm(form) {
    const requiredFields = ['nombre', 'apellido', 'email', 'asunto', 'mensaje'];
    let isValid = true;
    
    requiredFields.forEach(fieldName => {
        const field = form[fieldName];
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    // Validar email
    const emailField = form.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField.value && !emailRegex.test(emailField.value)) {
        emailField.classList.add('error');
        isValid = false;
    }
    
    return isValid;
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