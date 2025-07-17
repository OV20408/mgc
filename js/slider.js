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
  const prevBtn     = document.querySelector('.hero-control.prev');
  const nextBtn     = document.querySelector('.hero-control.next');
  const playPauseBtn= document.querySelector('.hero-control.pause-play'); // opcional
  if (!slides.length || !prevBtn || !nextBtn) return;   // no hay carrusel
  /* ------------------------------------ */

  let index          = 0;      // slide actual
  let autoTimer      = null;   // id del setInterval
  let locked         = false;  // evita clics durante la animación
  let playing        = true;   // estado de autoplay

  /* ============  FUNCTIONS  ============ */
  const lock = () => { locked = true; setTimeout(() => locked = false, FADE_TIME); };

  const updateUI = () => {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    indicators.forEach((d, i) => d.classList.toggle('active', i === index));
  };

  const goTo = i => {
    if (locked || i === index) return;
    lock();
    index = (i + slides.length) % slides.length;
    updateUI();
  };

  const next  = () => goTo(index + 1);
  const prev  = () => goTo(index - 1);

  const startAuto = () => {
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

  const resetAuto = () => playing && startAuto();

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
  /* ===================================== */

  /* -----------  EVENTOS  --------------- */
  nextBtn .addEventListener('click', e => { e.preventDefault(); next();  resetAuto(); });
  prevBtn .addEventListener('click', e => { e.preventDefault(); prev();  resetAuto(); });

  // indicadores
  indicators.forEach((dot, i) =>
    dot.addEventListener('click', e => { e.preventDefault(); goTo(i); resetAuto(); })
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
    if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
    if (e.key === 'ArrowRight') { next(); resetAuto(); }
    if (e.code === 'Space' && playPauseBtn) { e.preventDefault(); playPauseBtn.click(); }
  });

  // pausa / reanuda al cambiar de pestaña
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAuto() : startAuto();
  });

  // pausa / reanuda al pasar el ratón
  if (PAUSE_ON_HOVER) {
    const hero = document.querySelector('.hero');
    hero.addEventListener('mouseenter', stopAuto);
    hero.addEventListener('mouseleave', startAuto);
  }
  /* ------------------------------------ */

  /* -------- INICIALIZACIÓN ------------ */
  updateUI();
  startAuto();
  /* ------------------------------------ */
});
