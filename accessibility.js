(() => {
  const labels = {
    hh: 'Horas', mm: 'Minutos', h: 'Respuesta', q: 'Cociente', r: 'Resto',
    'h-single': 'Resultado',
  };

  function enhance(root = document) {
    root.querySelectorAll('.answer-display, .div-input, .digital-box, .sum-input').forEach((field) => {
      if (field.dataset.accessibilityReady) return;
      field.dataset.accessibilityReady = 'true';
      field.setAttribute('role', 'textbox');
      field.setAttribute('aria-readonly', 'true');
      field.setAttribute('tabindex', '0');
      const id = field.dataset.id || field.id;
      field.setAttribute('aria-label', labels[id] || `Casilla ${id || ''}`.trim());

      const updateValue = () => {
        const value = field.value ?? field.textContent.trim();
        field.setAttribute('aria-valuetext', value || 'Vacío');
      };
      updateValue();
      new MutationObserver(updateValue).observe(field, { childList: true, characterData: true, subtree: true });
      field.addEventListener('input', updateValue);
      field.addEventListener('focus', () => {
        if (typeof window.setFocus === 'function') window.setFocus(field);
      });
    });
  }

  enhance();
  new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) enhance(node);
  }))).observe(document.documentElement, { childList: true, subtree: true });
})();
