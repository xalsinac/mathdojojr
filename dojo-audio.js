// dojo-audio.js · Motor de audio sintético y háptico para Math Dojo Junior
// Basado en Web Audio API (cero dependencias externas, 100% offline, latencia ultra-baja)
(() => {
  let ctx = null;
  const storageKey = 'mathjr_muted';
  let isMuted = false;

  try {
    isMuted = localStorage.getItem(storageKey) === 'true';
  } catch (_) {}

  function getAudioContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  // Despertar AudioContext con la primera interacción del usuario
  ['click', 'touchstart', 'keydown'].forEach(evt => {
    window.addEventListener(evt, () => getAudioContext(), { once: true, passive: true });
  });

  const DojoAudio = {
    isMuted() {
      return isMuted;
    },

    toggleMute() {
      isMuted = !isMuted;
      try {
        localStorage.setItem(storageKey, String(isMuted));
      } catch (_) {}
      this.syncUI();
      if (!isMuted) this.play('tap');
      return isMuted;
    },

    vibrate(pattern = 15) {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(pattern); } catch (_) {}
      }
    },

    play(soundType) {
      if (isMuted) return;
      const ac = getAudioContext();
      if (!ac) return;

      const now = ac.currentTime;

      if (soundType === 'tap') {
        // Pop suave y agradable para botones del teclado
        this.vibrate(8);
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      }
      else if (soundType === 'correct') {
        // Doble campana armónica alegre (Do5 -> Sol5)
        this.vibrate([12, 40, 16]);
        [523.25, 783.99].forEach((freq, idx) => {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          const start = now + idx * 0.09;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.22, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start(start);
          osc.stop(start + 0.36);
        });
      }
      else if (soundType === 'wrong') {
        // Golpe amortiguado suave (no frustrante)
        this.vibrate([35, 30, 25]);
        const osc = ac.createOscillator();
        const gain = ac.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      }
      else if (soundType === 'star') {
        // Campanilla brillante tipo estrella de recompensa
        this.vibrate(18);
        const osc = ac.createOscillator();
        const gain = ac.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.14);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
      else if (soundType === 'fanfare') {
        // Fanfarria triunfal de fin de ronda (Do - Mi - Sol - Do octava)
        this.vibrate([25, 40, 25, 40, 60]);
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          const start = now + idx * 0.11;

          osc.type = idx === notes.length - 1 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.28, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, start + (idx === notes.length - 1 ? 0.6 : 0.28));

          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start(start);
          osc.stop(start + 0.65);
        });
      }
    },

    syncUI() {
      document.querySelectorAll('.sound-toggle-btn').forEach(btn => {
        btn.setAttribute('aria-pressed', String(!isMuted));
        btn.setAttribute('title', isMuted ? 'Activar sonido' : 'Silenciar');
        const icon = btn.querySelector('.sound-icon') || btn;
        if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
      });
    }
  };

  window.DojoAudio = DojoAudio;

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => DojoAudio.syncUI());
  } else {
    DojoAudio.syncUI();
  }
})();
