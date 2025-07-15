// contact.js - Versión corregida

const publicKey = 'KmamiCc6sWkpv5wli';
const SERVICE_ID = 'service_lrhelaq';
const TEMPLATE_ID = 'template_osnvavd';

// Verificar que EmailJS esté disponible
function checkEmailJSReady() {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS no está cargado. Verifica que el script esté incluido.');
        return false;
    }
    return true;
}

// Contact form handling
function handleSubmit(event) {
    event.preventDefault();
    
    // Verificar EmailJS
    if (!checkEmailJSReady()) {
        alert('Error: Servicio de correo no disponible. Por favor, recarga la página.');
        return;
    }
    
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
    
    // Preparar datos para EmailJS - CORREGIDO para coincidir con el template
    const templateParams = {
        name: form.nombre.value + ' ' + form.apellido.value,        // Para From Name
        from_name: form.nombre.value + ' ' + form.apellido.value,   // Para contenido
        from_email: form.email.value,
        phone: form.telefono.value || 'No proporcionado',
        subject: form.asunto.value,
        message: form.mensaje.value
    };
    
    // Debug: mostrar los datos que se enviarán
    console.log('Enviando datos:', templateParams);
    console.log('Service ID:', SERVICE_ID);
    console.log('Template ID:', TEMPLATE_ID);
    
    // Enviar email usando EmailJS
    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
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
            console.error('FAILED...', error);
            
            // Mostrar error más específico
            let errorMessage = 'Hubo un error al enviar el mensaje. ';
            
            if (error.status === 400) {
                errorMessage += 'Error de configuración del servicio. ';
            } else if (error.status === 401) {
                errorMessage += 'Error de autenticación. ';
            } else if (error.status === 402) {
                errorMessage += 'Límite de envío excedido. ';
            } else if (error.status === 403) {
                errorMessage += 'Acceso denegado. ';
            } else if (error.status === 404) {
                errorMessage += 'Servicio no encontrado. ';
            }
            
            errorMessage += 'Por favor, intenta nuevamente o contacta directamente a ramiromoscosoz@hotmail.com';
            
            alert(errorMessage);
            
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
            console.log(`Campo requerido vacío: ${fieldName}`);
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
        console.log('Email inválido:', emailField.value);
    }
    
    return isValid;
}

// Add form styles for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Verificar configuración
    console.log('Configuración EmailJS:');
    console.log('- Public Key:', publicKey);
    console.log('- Service ID:', SERVICE_ID);
    console.log('- Template ID:', TEMPLATE_ID);
    
    // Verificar que los IDs estén configurados
    if (SERVICE_ID === 'TU_SERVICE_ID_CORRECTO' || TEMPLATE_ID === 'TU_TEMPLATE_ID_CORRECTO') {
        console.error('⚠️ ADVERTENCIA: Debes configurar los IDs correctos del dashboard');
        alert('Error de configuración: Los IDs de EmailJS no están configurados correctamente. Revisa el archivo contact.js');
    } else {
        console.log('✅ IDs configurados correctamente');
    }
    
    // Verificar que EmailJS esté disponible al cargar la página
    if (!checkEmailJSReady()) {
        console.error('EmailJS no está disponible');
    } else {
        console.log('EmailJS está listo');
    }
    
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

// Función para probar la configuración
function testEmailJS() {
    const testParams = {
        name: 'Test User',
        from_name: 'Test User',
        from_email: 'test@example.com',
        phone: '123456789',
        subject: 'Test Subject',
        message: 'This is a test message'
    };
    
    emailjs.send(SERVICE_ID, TEMPLATE_ID, testParams)
        .then(function(response) {
            console.log('Test SUCCESS!', response);
        })
        .catch(function(error) {
            console.error('Test FAILED...', error);
        });
}