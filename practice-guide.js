(() => {
  const examples = {
    'mental.html': {
      'blanco-sumas': ['Sumar hasta 12', '8 + 4 = 12', 'Piensa en llegar primero a 10: 8 + 2 = 10 y todavía faltan 2.'],
      'blanco-restas': ['Restar hasta 12', '12 − 5 = 7', 'Empieza en 12 y cuenta cinco pasos hacia atrás.'],
      naranja: ['Sumas y restas', '27 + 18 = 45', 'Puedes separar 18 en 10 y 8: 27 + 10 = 37; 37 + 8 = 45.'],
      azul: ['Cuatro operaciones', '6 × 7 = 42', 'Recuerda las tablas. En las divisiones del nivel, el reparto es exacto.'],
      negro: ['Cuatro operaciones', '96 ÷ 8 = 12', 'Piensa qué número multiplicado por 8 da 96: 8 × 12 = 96.'],
    },
    'sumas.html': {
      blanco: ['Suma sin llevadas', '23 + 14 = 37', 'Suma unidades: 3 + 4 = 7. Después, decenas: 2 + 1 = 3.'],
      naranja: ['Suma con llevadas', '268 + 157 = 425', '8 + 7 = 15: escribe 5 y lleva 1 decena. Luego suma las decenas y esa llevada.'],
      azul: ['Suma de cinco cifras', '24 381 + 13 206 = 37 587', 'Alinea unidades con unidades y suma cada columna de derecha a izquierda.'],
      negro: ['Sumar cuatro números', '12 345 + 23 456 + 14 321 + 31 111 = 81 233', 'Alinea las cuatro filas y suma una columna cada vez.'],
    },
    'restas.html': {
      blanco: ['Restar sin préstamos', '58 − 23 = 35', 'Unidades: 8 − 3 = 5. Decenas: 5 − 2 = 3.'],
      naranja: ['Restar con préstamos', '402 − 178 = 224', 'Empieza por las unidades. Si no alcanza, cambia una decena por 10 unidades.'],
      azul: ['Restas de cuatro cifras', '3 204 − 1 178 = 2 026', 'Resuelve cada columna de derecha a izquierda y anota dónde haces un préstamo.'],
      negro: ['Restas de cinco cifras', '24 302 − 8 176 = 16 126', 'Alinea las cifras y comprueba cada préstamo antes de bajar al resultado.'],
    },
    'multiplicaciones.html': {
      blanco: ['Tablas básicas', '4 × 5 = 20', 'Puedes pensar en cuatro grupos de cinco.'],
      naranja: ['Multiplicar por una cifra', '321 × 3 = 963', 'Calcula de derecha a izquierda: 3×1, 3×2 decenas y 3×3 centenas.'],
      azul: ['Multiplicar por dos cifras', '45 × 23 = 1 035', 'Separa 23 en 20 y 3: 45×3=135 y 45×20=900; después suma.'],
      negro: ['Multiplicar decimales', '12,4 × 3,5 = 43,40', 'Multiplica como si no hubiera comas y coloca dos cifras decimales en el resultado.'],
    },
    'divisiones.html': {
      blanco: ['Repartos exactos', '15 ÷ 3 = 5', 'Reparte 15 en 3 grupos iguales: cada grupo recibe 5.'],
      naranja: ['División con resto', '47 ÷ 5 = 9 y sobra 2', '5×9=45; sobran 2. El resto siempre es menor que el divisor.'],
      azul: ['Divisiones de tres cifras', '156 ÷ 4 = 39', 'Busca cuántas veces cabe el divisor y baja la cifra siguiente para continuar.'],
      negro: ['Dividir entre dos cifras', '1 248 ÷ 24 = 52', 'Prueba cuántas veces cabe 24 en cada parte del dividendo y comprueba el resultado.'],
    },
    'geometria.html': {
      blanco: ['Figuras planas', 'Un triángulo tiene 3 lados', 'Cuenta los lados y compara la figura con las opciones.'],
      naranja: ['Ángulos y líneas', 'Un ángulo de 90° es recto', 'Menos de 90° es agudo; más de 90° y menos de 180° es obtuso.'],
      azul: ['Cuerpos 3D', 'Un cubo tiene 6 caras', 'Las caras son las superficies; los vértices son las esquinas.'],
      negro: ['Área y perímetro', 'Rectángulo 5 m × 3 m: área 15 m², perímetro 16 m', 'Área: base por altura. Perímetro: suma los cuatro lados.'],
    },
    'reloj.html': {
      blanco: ['En punto', 'La aguja corta en el 3 y la larga en el 12: son las 3:00', 'La aguja corta señala la hora; la larga, los minutos.'],
      naranja: ['Horas y minutos', 'La aguja larga en el 5 son 25 minutos', 'Cada número del reloj equivale a cinco minutos para la aguja larga.'],
      azul: ['Mueve las agujas', 'Para las 4:25, hora en el 4 y minutos en el 5', 'Arrastra una aguja o enfócala y usa las flechas del teclado.'],
      negro: ['La hora en catalán', '4:15 se dice «un quart de cinc»', 'En catalán se cuentan los cuartos hacia la hora que viene: 4:15 es un cuarto de cinco.'],
    },
    'leer-numeros.html': {
      blanco: ['Lee hasta 2 cifras', '47', 'Léelo con un adulto: cuatro decenas y siete unidades. Pulsa «Siguiente número» cuando lo hayáis leído.'],
      naranja: ['Lee hasta 4 cifras', '3 482', 'Separa millares, centenas, decenas y unidades: 3 000 + 400 + 80 + 2. Léelo con un adulto y pasa al siguiente.'],
      negro: ['Del nombre a la cifra', 'Trescientos cuarenta y dos → 342', 'Busca primero las centenas, después las decenas y al final las unidades. El botón de pista te puede ayudar si dudas.'],
    },
  };

  const gameFile = location.pathname.split('/').pop() || 'index.html';
  const guide = document.createElement('dialog');
  guide.className = 'practice-guide';
  guide.setAttribute('aria-labelledby', 'practice-guide-title');
  guide.setAttribute('aria-describedby', 'practice-guide-example practice-guide-tip');
  guide.innerHTML = '<div class="practice-guide__content"><p class="practice-guide__eyebrow">ANTES DE EMPEZAR</p><h2 id="practice-guide-title"></h2><p id="practice-guide-example" class="practice-guide__example"></p><p id="practice-guide-tip" class="practice-guide__tip"></p><div class="practice-guide__actions"><button class="practice-guide__start" type="button">Empezar a practicar</button><button class="practice-guide__back" type="button">Volver a los niveles</button></div></div>';
  document.body.append(guide);

  let selectedButton = null;
  let replayingSelection = false;
  const beltSelector = '#level-selector .belt-btn, .level-selector .belt-btn';
  const levelSelector = document.querySelector('.level-selector');

  function startSelectedLevel() {
    if (!selectedButton) return;
    const gameHeader = document.querySelector('.game-header');
    const scoreBoard = gameHeader?.querySelector('.score-board');
    if (gameHeader && scoreBoard) {
      let badge = gameHeader.querySelector('.active-level');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'active-level';
        gameHeader.insertBefore(badge, scoreBoard);
      }
      const levelName = selectedButton.querySelector('.belt-text').childNodes[0].textContent.trim();
      badge.textContent = `🥋 ${levelName}`;
    }
    replayingSelection = true;
    guide.close();
    selectedButton.click();
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest(beltSelector);
    if (!button) return;
    if (replayingSelection) {
      replayingSelection = false;
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    selectedButton = button;
    const level = button.dataset.level;
    const [title, example, tip] = examples[gameFile]?.[level] || [
      'Un ejemplo para empezar', 'Mira cómo se resuelve el ejercicio.', 'Prueba cada paso con calma y luego inténtalo tú.',
    ];
    guide.querySelector('#practice-guide-title').textContent = `${title} · ${button.querySelector('.belt-text').childNodes[0].textContent.trim()}`;
    guide.querySelector('.practice-guide__example').textContent = example;
    guide.querySelector('.practice-guide__tip').textContent = tip;
    guide.showModal();
  }, true);

  guide.querySelector('.practice-guide__start').addEventListener('click', startSelectedLevel);
  guide.querySelector('.practice-guide__back').addEventListener('click', () => {
    guide.close();
    selectedButton?.focus();
  });
  guide.addEventListener('close', () => {
    if (selectedButton && levelSelector?.contains(selectedButton)) selectedButton.focus();
  });
})();
