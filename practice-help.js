(() => {
  const feedback = document.getElementById('feedback');
  if (!feedback) return;

  const defaults = {
    'sumas.html': 'Resuelve primero las unidades y después las decenas. Si una columna suma 10 o más, escribe las unidades y lleva una decena.',
    'restas.html': 'Empieza por las unidades. Cuando la cifra de arriba es menor, cambia una decena por 10 unidades.',
    'divisiones.html': 'Comprueba el cociente con la operación inversa: divisor × cociente + resto debe dar el dividendo.',
    'multiplicaciones.html': 'Empieza por las unidades del multiplicador y escribe ese producto parcial antes de sumar las filas.',
    'geometria.html': 'Busca la propiedad que pide la pregunta: lados, esquinas, caras, ángulos o medida.',
    'reloj.html': 'Lee primero la aguja corta para la hora y luego la larga para los minutos. En catalán, los cuartos miran a la hora siguiente.',
  };

  const file = location.pathname.split('/').pop();
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'practice-help-toggle';
  button.textContent = '💡 Ver una pista';
  button.hidden = true;
  button.setAttribute('aria-expanded', 'false');

  const panel = document.createElement('div');
  panel.className = 'practice-help-panel';
  panel.setAttribute('role', 'note');
  panel.hidden = true;
  panel.id = 'practice-help-panel';
  button.setAttribute('aria-controls', panel.id);
  feedback.insertAdjacentElement('afterend', button);
  button.insertAdjacentElement('afterend', panel);

  button.addEventListener('click', () => {
    const opening = panel.hidden;
    if (opening) {
      const hint = typeof window.getPracticeHint === 'function' ? window.getPracticeHint() : '';
      panel.textContent = hint || defaults[file] || 'Prueba una columna cada vez y vuelve a intentarlo.';
    }
    panel.hidden = !opening;
    button.setAttribute('aria-expanded', String(opening));
    button.textContent = opening ? '🙈 Ocultar pista' : '💡 Ver una pista';
  });

  function update() {
    const hasError = feedback.classList.contains('wrong') && feedback.textContent.trim();
    if (hasError) {
      button.hidden = false;
      return;
    }
    button.hidden = true;
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    button.textContent = '💡 Ver una pista';
  }

  new MutationObserver(update).observe(feedback, { attributes: true, childList: true, characterData: true, subtree: true });
})();
