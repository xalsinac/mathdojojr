// dojo-progress.js · Sistema de pasaporte de cinturones, rondas y progreso de Math Dojo Junior
(() => {
  const PROGRESS_KEY = 'mathjr_progress_v2';
  const AVATAR_KEY = 'mathjr_avatar';

  const avatarsData = [
    { id: 'zorro', name: 'Zorrito', src: 'fox-mark.svg' },
    { id: 'gato', name: 'Gatito Ninja', src: 'avatars/gato.svg' },
    { id: 'rana', name: 'Ranita', src: 'avatars/rana.svg' },
    { id: 'oso', name: 'Osito', src: 'avatars/oso.svg' },
    { id: 'buho', name: 'Búho Sabio', src: 'avatars/buho.svg' },
    { id: 'dragon', name: 'Dragón', src: 'avatars/dragon.svg' },
  ];

  const DojoProgress = {
    getAll() {
      try {
        const raw = localStorage.getItem(PROGRESS_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (_) {
        return {};
      }
    },

    getGameBelt(gameId, beltId) {
      const all = this.getAll();
      return (all[gameId] && all[gameId][beltId]) || { stars: 0, rounds: 0, bestScore: 0 };
    },

    saveRound(gameId, beltId, stars, correctCount, totalCount) {
      const all = this.getAll();
      if (!all[gameId]) all[gameId] = {};
      const current = all[gameId][beltId] || { stars: 0, rounds: 0, bestScore: 0 };

      current.rounds = (current.rounds || 0) + 1;
      current.stars = Math.max(current.stars || 0, stars);
      current.bestScore = Math.max(current.bestScore || 0, correctCount);

      all[gameId][beltId] = current;
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
      } catch (_) {}
      return current;
    },

    getAvatar() {
      try {
        const id = localStorage.getItem(AVATAR_KEY) || 'zorro';
        return avatarsData.find(a => a.id === id) || avatarsData[0];
      } catch (_) {
        return avatarsData[0];
      }
    }
  };

  // Clase para gestionar rondas de preguntas
  class DojoRoundManager {
    constructor({ gameId, beltId, beltName, totalQuestions = 8, onNext, onRestart }) {
      this.gameId = gameId;
      this.beltId = beltId;
      this.beltName = beltName;
      this.totalQuestions = totalQuestions;
      this.currentIndex = 0;
      this.correctCount = 0;
      this.onNext = onNext;
      this.onRestart = onRestart;
      this.initModal();
    }

    start() {
      this.currentIndex = 0;
      this.correctCount = 0;
      this.updateProgressIndicator();
    }

    recordAnswer(isCorrect) {
      if (isCorrect) this.correctCount++;
      this.currentIndex++;
      this.updateProgressIndicator();

      if (this.currentIndex >= this.totalQuestions) {
        this.finishRound();
        return true; // ronda terminada
      }
      return false; // continúa
    }

    updateProgressIndicator() {
      const el = document.getElementById('round-progress-indicator');
      if (!el) return;
      const step = Math.min(this.currentIndex + 1, this.totalQuestions);
      el.innerHTML = `
        <span class="round-step">Pregunta <b>${step}</b> de <b>${this.totalQuestions}</b></span>
        <div class="round-dots">
          ${Array.from({ length: this.totalQuestions }, (_, i) => {
            let cls = 'round-dot';
            if (i < this.currentIndex) cls += ' done';
            if (i === this.currentIndex) cls += ' current';
            return `<span class="${cls}"></span>`;
          }).join('')}
        </div>
      `;
    }

    finishRound() {
      const ratio = this.correctCount / this.totalQuestions;
      let stars = 1;
      if (ratio >= 0.99) stars = 3;
      else if (ratio >= 0.7) stars = 2;

      DojoProgress.saveRound(this.gameId, this.beltId, stars, this.correctCount, this.totalQuestions);

      // Lanzar fanfarria y confeti
      if (window.DojoAudio) window.DojoAudio.play('fanfare');
      if (window.DojoFX) window.DojoFX.confetti();

      this.showCompleteModal(stars);
    }

    initModal() {
      if (document.getElementById('dojo-round-modal')) return;
      const dialog = document.createElement('dialog');
      dialog.id = 'dojo-round-modal';
      dialog.className = 'dojo-modal-round';
      dialog.innerHTML = `
        <div class="modal-card">
          <div class="modal-avatar-bubble">
            <img id="modal-avatar-img" src="fox-mark.svg" alt="" aria-hidden="true">
          </div>
          <h2 id="modal-round-title" class="modal-title">¡Ronda Completada!</h2>
          <p id="modal-round-subtitle" class="modal-subtitle">Has entrenado con fuerza en el Dojo.</p>
          
          <div class="modal-stars" id="modal-stars-container">
            <span class="star-slot" data-index="1">⭐</span>
            <span class="star-slot" data-index="2">⭐</span>
            <span class="star-slot" data-index="3">⭐</span>
          </div>

          <div class="modal-stats" id="modal-stats-text">
            <b>8</b> de <b>8</b> aciertos · Cinturón 🥋
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-modal-action btn-play-again" id="modal-btn-replay">
              🔄 Otra Ronda
            </button>
            <button type="button" class="btn-modal-action btn-change-belt" id="modal-btn-levels">
              🥋 Niveles
            </button>
            <a href="index.html" class="btn-modal-action btn-home">
              🏠 Portada
            </a>
          </div>
        </div>
      `;
      document.body.appendChild(dialog);

      dialog.querySelector('#modal-btn-replay').addEventListener('click', () => {
        dialog.close();
        if (typeof this.onRestart === 'function') this.onRestart();
      });

      dialog.querySelector('#modal-btn-levels').addEventListener('click', () => {
        dialog.close();
        const changeLevelBtn = document.querySelector('.change-level-btn');
        if (changeLevelBtn) changeLevelBtn.click();
      });
    }

    showCompleteModal(stars) {
      const dialog = document.getElementById('dojo-round-modal');
      if (!dialog) return;

      const avatar = DojoProgress.getAvatar();
      const avatarImg = dialog.querySelector('#modal-avatar-img');
      if (avatarImg) avatarImg.src = avatar.src;

      const title = dialog.querySelector('#modal-round-title');
      const subtitle = dialog.querySelector('#modal-round-subtitle');
      const stats = dialog.querySelector('#modal-stats-text');

      if (stars === 3) {
        title.textContent = '¡IMPRESIONANTE! 🌟';
        subtitle.textContent = `¡${avatar.name} está orgulloso de ti! ¡Puntuación perfecta!`;
      } else if (stars === 2) {
        title.textContent = '¡Muy bien hecho! 👏';
        subtitle.textContent = `¡Casi perfecto! Sigue practicando para las 3 estrellas.`;
      } else {
        title.textContent = '¡Buen entrenamiento! 💪';
        subtitle.textContent = `Cada ronda te hace más fuerte. ¡A por la siguiente!`;
      }

      stats.innerHTML = `<b>${this.correctCount}</b> de <b>${this.totalQuestions}</b> correctas en <b>${this.beltName || 'Cinturón'}</b>`;

      const starSlots = dialog.querySelectorAll('.star-slot');
      starSlots.forEach((slot, idx) => {
        slot.classList.remove('active');
        if (idx < stars) {
          setTimeout(() => {
            slot.classList.add('active');
            if (window.DojoAudio) window.DojoAudio.play('star');
          }, (idx + 1) * 350);
        }
      });

      dialog.showModal();
    }
  }

  window.DojoProgress = DojoProgress;
  window.DojoRoundManager = DojoRoundManager;
})();
