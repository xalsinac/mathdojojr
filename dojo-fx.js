// dojo-fx.js · Efectos visuales, confeti y celebraciones para Math Dojo Junior
(() => {
  const DojoFX = {
    // Ráfaga de confeti multicolor con física de gravedad
    confetti(duration = 2400) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.inset = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99999';
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      let width = (canvas.width = window.innerWidth * dpr);
      let height = (canvas.height = window.innerHeight * dpr);

      const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#06b6d4', '#f43f5e', '#fbbf24'];
      const particles = [];
      const particleCount = Math.min(80, Math.floor(window.innerWidth / 10));

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: (width / 2) + (Math.random() - 0.5) * (width * 0.4),
          y: height * 0.4 + (Math.random() - 0.5) * (height * 0.2),
          vx: (Math.random() - 0.5) * 14 * dpr,
          vy: (Math.random() * -12 - 4) * dpr,
          size: (Math.random() * 8 + 5) * dpr,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          opacity: 1,
          shape: Math.random() > 0.4 ? 'rect' : 'circle'
        });
      }

      const start = performance.now();
      function render(now) {
        const elapsed = now - start;
        const progress = elapsed / duration;

        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35 * dpr; // gravedad
          p.vx *= 0.98; // fricción aire
          p.rotation += p.rotationSpeed;
          p.opacity = Math.max(0, 1 - progress);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });

        if (progress < 1) {
          requestAnimationFrame(render);
        } else {
          canvas.remove();
        }
      }

      requestAnimationFrame(render);
    },

    // Efecto de chispa flotante en acierto
    sparkle(targetElement) {
      if (!targetElement || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = targetElement.getBoundingClientRect();
      const spark = document.createElement('div');
      spark.className = 'dojo-sparkle-fx';
      spark.textContent = '✨';
      spark.style.position = 'fixed';
      spark.style.left = `${rect.left + rect.width / 2}px`;
      spark.style.top = `${rect.top}px`;
      spark.style.transform = 'translate(-50%, -50%) scale(0.6)';
      spark.style.pointerEvents = 'none';
      spark.style.zIndex = '9999';
      spark.style.fontSize = '2.2rem';
      spark.style.transition = 'all 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
      document.body.appendChild(spark);

      requestAnimationFrame(() => {
        spark.style.transform = 'translate(-50%, -100%) scale(1.3)';
        spark.style.opacity = '0';
      });

      setTimeout(() => spark.remove(), 650);
    }
  };

  window.DojoFX = DojoFX;
})();
