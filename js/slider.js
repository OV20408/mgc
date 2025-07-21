// js/slider.js
document.addEventListener('DOMContentLoaded', () => {
  /* -----------  CONSTANTES  ----------- */
  const DELAY          = 5000;           // ms entre cambios automáticos
  const FADE_TIME      = 1000;           // ms de la transición CSS (opacity)
  const PAUSE_ON_HOVER = true;           // ponlo en false si no lo quieres
  /* ------------------------------------ */

  /* -----------  ELEMENTOS  ------------ */
  const slides      = [...document.querySelectorAll('.hero-slide')];
  const indicators  = [...document.querySelectorAll('.indicator')];
  const subtitles   = [...document.querySelectorAll('.hero-subtitle')];
  const prevBtn     = document.querySelector('.hero-control.prev');
  const nextBtn     = document.querySelector('.hero-control.next');
  const playPauseBtn= document.querySelector('.hero-control.pause-play');
  
  if (!slides.length || !prevBtn || !nextBtn) return;   // no hay carrusel
  /* ------------------------------------ */

  let index          = 0;      // slide actual
  let autoTimer      = null;   // id del setInterval
  let locked         = false;  // evita clics durante la animación
  let playing        = true;   // estado de autoplay
  let imagesLoaded   = false;  // control de carga de imágenes

  /* ============  PRELOAD IMAGES  ============ */
  const preloadImages = () => {
    return new Promise((resolve) => {
      const images = slides.map(slide => slide.querySelector('img')).filter(img => img);
      let loadedCount = 0;
      const totalImages = images.length;

      if (totalImages === 0) {
        resolve();
        return;
      }

      const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          imagesLoaded = true;
          resolve();
        }
      };

      images.forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
          checkAllLoaded();
        } else {
          img.addEventListener('load', checkAllLoaded);
          img.addEventListener('error', checkAllLoaded); // También cuenta los errores
        }
      });
    });
  };

  /* ============  FUNCTIONS  ============ */
  const lock = () => { 
    locked = true; 
    setTimeout(() => locked = false, FADE_TIME); 
  };

  const updateUI = () => {
    // Actualizar slides
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    
    // Actualizar indicadores
    indicators.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    
    // Actualizar textos dinámicos
    subtitles.forEach((subtitle, i) => {
      subtitle.classList.toggle('active', i === index);
    });
  };

  const goTo = i => {
    if (locked || i === index || !imagesLoaded) return;
    lock();
    index = (i + slides.length) % slides.length;
    updateUI();
  };

  const next  = () => goTo(index + 1);
  const prev  = () => goTo(index - 1);

  const startAuto = () => {
    if (!imagesLoaded) return; // No iniciar hasta que las imágenes estén cargadas
    clearInterval(autoTimer);
    autoTimer = setInterval(next, DELAY);
    playing = true;
    togglePlayPauseIcon();
  };

  const stopAuto = () => {
    clearInterval(autoTimer);
    playing = false;
    togglePlayPauseIcon();
  };

  const resetAuto = () => {
    if (playing && imagesLoaded) {
      startAuto();
    }
  };

  const togglePlayPauseIcon = () => {
    if (!playPauseBtn) return;
    const icon = playPauseBtn.querySelector('i');
    if (playing) {
      icon.className = 'fas fa-pause';
      playPauseBtn.setAttribute('aria-label', 'Pausar carrusel');
    } else {
      icon.className = 'fas fa-play';
      playPauseBtn.setAttribute('aria-label', 'Reanudar carrusel');
    }
  };

  /* ============  INITIALIZATION  ============ */
  const initCarousel = async () => {
    // Mostrar loader opcional (puedes agregar un elemento de carga)
    const hero = document.querySelector('.hero');
    hero.classList.add('loading');

    try {
      // Precargar todas las imágenes
      await preloadImages();
      
      // Una vez cargadas, inicializar el carrusel
      updateUI();
      
      // Pequeño delay para asegurar que el CSS se haya aplicado
      setTimeout(() => {
        startAuto();
        hero.classList.remove('loading');
      }, 100);
      
    } catch (error) {
      console.warn('Error al cargar algunas imágenes:', error);
      // Aún así inicializar el carrusel
      imagesLoaded = true;
      updateUI();
      startAuto();
      hero.classList.remove('loading');
    }
  };

  /* -----------  EVENTOS  --------------- */
  nextBtn.addEventListener('click', e => { 
    e.preventDefault(); 
    next(); 
    resetAuto(); 
  });
  
  prevBtn.addEventListener('click', e => { 
    e.preventDefault(); 
    prev(); 
    resetAuto(); 
  });

  // indicadores
  indicators.forEach((dot, i) =>
    dot.addEventListener('click', e => { 
      e.preventDefault(); 
      goTo(i); 
      resetAuto(); 
    })
  );

  // play / pause opcional
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', e => {
      e.preventDefault();
      playing ? stopAuto() : startAuto();
    });
  }

  // teclado (← → y barra espaciadora)
  document.addEventListener('keydown', e => {
    if (!imagesLoaded) return; // No permitir navegación hasta que esté listo
    
    if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
    if (e.key === 'ArrowRight') { next(); resetAuto(); }
    if (e.code === 'Space' && playPauseBtn) { 
      e.preventDefault(); 
      playPauseBtn.click(); 
    }
  });

  // pausa / reanuda al cambiar de pestaña
  document.addEventListener('visibilitychange', () => {
    if (!imagesLoaded) return;
    document.hidden ? stopAuto() : startAuto();
  });

  // pausa / reanuda al pasar el ratón
  if (PAUSE_ON_HOVER) {
    const hero = document.querySelector('.hero');
    hero.addEventListener('mouseenter', () => {
      if (imagesLoaded) stopAuto();
    });
    hero.addEventListener('mouseleave', () => {
      if (imagesLoaded) startAuto();
    });
  }

  // Manejar cambio de tamaño de ventana
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (imagesLoaded) {
        updateUI();
      }
    }, 250);
  });

  /* -------- INICIALIZACIÓN ------------ */
  initCarousel();
  /* ------------------------------------ */
});