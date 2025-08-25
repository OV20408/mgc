// contact.js - Versión simplificada para enviar al endpoint
const telefonoInput = document.getElementById('telefono');
        const errorMsg = document.getElementById('error-msg');
        const successMsg = document.getElementById('success-msg');

        // Función para validar el teléfono
        function validarTelefono(valor) {
            // Remover cualquier carácter que no sea número
            const soloNumeros = valor.replace(/[^0-9]/g, '');
            
            // Verificar longitud
            return soloNumeros.length >= 7 && soloNumeros.length <= 12;
        }

        // Validación en tiempo real mientras se escribe
        telefonoInput.addEventListener('input', function(e) {
            let valor = e.target.value;
            
            // Remover cualquier carácter que no sea número
            const valorLimpio = valor.replace(/[^0-9]/g, '');
            
            // Actualizar el valor del input solo con números
            e.target.value = valorLimpio;
            
            // Validar
            if (valorLimpio.length === 0) {
                // Campo vacío
                telefonoInput.classList.remove('valid', 'invalid');
                errorMsg.style.display = 'none';
                successMsg.style.display = 'none';
            } else if (validarTelefono(valorLimpio)) {
                // Válido
                telefonoInput.classList.remove('invalid');
                telefonoInput.classList.add('valid');
                errorMsg.style.display = 'none';
                successMsg.style.display = 'block';
            } else {
                // Inválido
                telefonoInput.classList.remove('valid');
                telefonoInput.classList.add('invalid');
                errorMsg.style.display = 'block';
                successMsg.style.display = 'none';
            }
        });

        // Prevenir pegar contenido no numérico
        telefonoInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const soloNumeros = paste.replace(/[^0-9]/g, '');
            
            if (soloNumeros.length <= 12) {
                e.target.value = soloNumeros;
                // Disparar evento input para validar
                e.target.dispatchEvent(new Event('input'));
            }
        });

        // Prevenir teclas no numéricas (excepto teclas especiales)
        telefonoInput.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.which);
            if (!/[0-9]/.test(char) && !isSpecialKey(e)) {
                e.preventDefault();
            }
        });

        // Función para permitir teclas especiales (backspace, delete, etc.)
        function isSpecialKey(e) {
            return (
                e.key === 'Backspace' ||
                e.key === 'Delete' ||
                e.key === 'Tab' ||
                e.key === 'Enter' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowDown' ||
                (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            );
        }


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
        //modal o minipoopp para aeste alert
        alert('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');
        form.reset();
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Mensaje';
    })
    .catch(error => {
        console.error('FAILED...', error);
        //modal o minipoopp para aeste alert
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