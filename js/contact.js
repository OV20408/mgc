// contact.js - Versión con medidas de seguridad

const publicKey = 'KmamiCc6sWkpv5wli';
const SERVICE_ID = 'service_lrhelaq';
const TEMPLATE_ID = 'template_osnvavd';

// ========== MEDIDAS DE SEGURIDAD ==========

// 1. Rate Limiting - Prevenir spam
let lastSubmissionTime = 0;
let submissionCount = 0;
const RATE_LIMIT_MS = 60000; // 1 minuto entre envíos
const MAX_SUBMISSIONS_PER_HOUR = 3; // Máximo 3 envíos por hora
const HOUR_MS = 3600000;

// 2. Validación de contenido sospechoso
const SUSPICIOUS_PATTERNS = [
    /viagra/gi,
    /casino/gi,
    /lottery/gi,
    /winner/gi,
    /congratulations/gi,
    /click here/gi,
    /urgent/gi,
    /act now/gi,
    /(http|https):\/\/[^\s]+/gi, // URLs sospechosas
    /\$\d+/g, // Menciones de dinero
    /bitcoin/gi,
    /crypto/gi
];

// 3. Honeypot (campo invisible para bots)
function createHoneypot() {
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.display = 'none';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    return honeypot;
}

// 4. Verificar que EmailJS esté disponible
function checkEmailJSReady() {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS no está cargado. Verifica que el script esté incluido.');
        return false;
    }
    return true;
}

// 5. Validar contenido contra patrones sospechosos
function validateContent(content) {
    const suspiciousCount = SUSPICIOUS_PATTERNS.reduce((count, pattern) => {
        const matches = content.match(pattern);
        return count + (matches ? matches.length : 0);
    }, 0);
    
    // Si hay más de 2 patrones sospechosos, rechazar
    return suspiciousCount <= 2;
}

// 6. Rate limiting inteligente
function checkRateLimit() {
    const now = Date.now();
    
    // Verificar tiempo mínimo entre envíos
    if (now - lastSubmissionTime < RATE_LIMIT_MS) {
        const waitTime = Math.ceil((RATE_LIMIT_MS - (now - lastSubmissionTime)) / 1000);
        return {
            allowed: false,
            message: `Por favor espera ${waitTime} segundos antes de enviar otro mensaje.`
        };
    }
    
    // Verificar límite por hora (usar localStorage si está disponible)
    try {
        const hourlyData = JSON.parse(localStorage.getItem('mcg_submissions') || '{"count": 0, "timestamp": 0}');
        
        if (now - hourlyData.timestamp > HOUR_MS) {
            // Reset contador cada hora
            hourlyData.count = 0;
            hourlyData.timestamp = now;
        }
        
        if (hourlyData.count >= MAX_SUBMISSIONS_PER_HOUR) {
            return {
                allowed: false,
                message: `Has alcanzado el límite de ${MAX_SUBMISSIONS_PER_HOUR} mensajes por hora. Intenta más tarde.`
            };
        }
        
        return { allowed: true, hourlyData };
    } catch (e) {
        // Si localStorage no está disponible, solo usar rate limit básico
        return { allowed: true };
    }
}

// 7. Validación de formulario mejorada
function validateForm(form) {
    const requiredFields = ['nombre_completo', 'email', 'asunto', 'mensaje'];
    let isValid = true;
    
    // Verificar honeypot
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) {
        console.warn('Honeypot detectado - posible bot');
        return false;
    }
    
    // Validar campos requeridos
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
    
    // Validar longitud mínima del mensaje
    const messageField = form.mensaje;
    if (messageField.value.trim().length < 10) {
        messageField.classList.add('error');
        isValid = false;
    }
    
    // Validar contenido sospechoso
    const fullContent = `${form.asunto.value} ${form.mensaje.value}`;
    if (!validateContent(fullContent)) {
        alert('El contenido del mensaje contiene elementos sospechosos. Por favor, revisa tu mensaje.');
        return false;
    }
    
    return isValid;
}

// 8. Función principal de envío con todas las protecciones
function handleSubmit(event) {
    event.preventDefault();
    
    if (!checkEmailJSReady()) {
        alert('Error: Servicio de correo no disponible. Por favor, recarga la página.');
        return;
    }
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Verificar rate limiting
    const rateLimitResult = checkRateLimit();
    if (!rateLimitResult.allowed) {
        alert(rateLimitResult.message);
        return;
    }
    
    // Validar formulario
    if (!validateForm(form)) {
        alert('Por favor, complete todos los campos requeridos correctamente.');
        return;
    }
    
    // Deshabilitar botón y mostrar estado de carga
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    
    // Preparar datos para EmailJS
    const templateParams = {
        name: form.nombre_completo.value,        
        from_name: form.nombre_completo.value,   
        from_email: form.email.value,
        phone: form.telefono.value || 'No proporcionado',
        subject: form.asunto.value,
        message: form.mensaje.value,
        timestamp: new Date().toLocaleString('es-ES'),
        user_agent: navigator.userAgent.substring(0, 100) // Info básica del navegador
    };
    
    console.log('Enviando mensaje seguro...');
    
    // Enviar email usando EmailJS
    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            
            // Actualizar rate limiting
            lastSubmissionTime = Date.now();
            
            // Actualizar contador por hora
            try {
                const rateLimitResult = checkRateLimit();
                if (rateLimitResult.hourlyData) {
                    rateLimitResult.hourlyData.count++;
                    localStorage.setItem('mcg_submissions', JSON.stringify(rateLimitResult.hourlyData));
                }
            } catch (e) {
                // Continuar sin localStorage
            }
            

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
            
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Mensaje';
        });
}

// 9. Inicialización con medidas de seguridad
document.addEventListener('DOMContentLoaded', function() {
    // Verificar configuración
    if (SERVICE_ID === 'TU_SERVICE_ID_CORRECTO' || TEMPLATE_ID === 'TU_TEMPLATE_ID_CORRECTO') {
        console.error('⚠️ ADVERTENCIA: Debes configurar los IDs correctos del dashboard');
        alert('Error de configuración: Los IDs de EmailJS no están configurados correctamente.');
        return;
    }
    
    if (!checkEmailJSReady()) {
        console.error('EmailJS no está disponible');
        return;
    }
    
    // Agregar honeypot al formulario
    const form = document.getElementById('contactForm');
    if (form) {
        const honeypot = createHoneypot();
        form.appendChild(honeypot);
    }
    
    // Mejorar UX de los campos
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
    
    console.log('✅ Formulario de contacto inicializado con medidas de seguridad');
});

// 10. Función de prueba para desarrollo
function testEmailJS() {
    const testParams = {
        name: 'Test User',
        from_name: 'Test User',
        from_email: 'test@example.com',
        phone: '123456789',
        subject: 'Test Subject',
        message: 'This is a test message',
        timestamp: new Date().toLocaleString('es-ES')
    };
    
    emailjs.send(SERVICE_ID, TEMPLATE_ID, testParams)
        .then(function(response) {
            console.log('Test SUCCESS!', response);
        })
        .catch(function(error) {
            console.error('Test FAILED...', error);
        });
}