// contact.js - Versión simplificada para enviar al endpoint

function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    const payload = {
        nombreCompleto: form.nombre_completo.value,
        correoElectronico: form.email.value,
        telefono: form.telefono.value,
        asunto: form.asunto.value,
        mensaje: form.mensaje.value
    };

    fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(async response => {
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al enviar el mensaje');
        }
        alert('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');
        form.reset();
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Mensaje';
    })
    .catch(error => {
        console.error('FAILED...', error);
        alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Mensaje';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});