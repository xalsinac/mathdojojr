(() => {
  const avatarKey = 'mathjr_avatar';
  const avatars = [
    { id: 'zorro', name: 'Zorrito', src: 'fox-mark.svg' },
    { id: 'gato', name: 'Gatito Ninja', src: 'avatars/gato.svg' },
    { id: 'rana', name: 'Ranita', src: 'avatars/rana.svg' },
    { id: 'oso', name: 'Osito', src: 'avatars/oso.svg' },
    { id: 'buho', name: 'Búho Sabio', src: 'avatars/buho.svg' },
    { id: 'dragon', name: 'Dragón', src: 'avatars/dragon.svg' },
  ];

  const openButton = document.getElementById('avatar-open');
  const dialog = document.getElementById('avatar-dialog');
  const grid = document.getElementById('avatar-grid');
  const status = document.getElementById('avatar-status');
  const heroImage = document.getElementById('dojo-avatar');
  const buttonImage = document.getElementById('avatar-button-icon');
  const closeButton = document.getElementById('avatar-close');
  if (!openButton || !dialog || !grid || !heroImage || !buttonImage) return;

  let selectedId = 'zorro';
  try {
    const savedId = localStorage.getItem(avatarKey);
    if (avatars.some(avatar => avatar.id === savedId)) selectedId = savedId;
  } catch (_) {}

  function renderSelection() {
    const selected = avatars.find(avatar => avatar.id === selectedId) || avatars[0];
    heroImage.src = selected.src;
    buttonImage.src = selected.src;
    openButton.setAttribute('aria-label', `Elegir avatar. Actual: ${selected.name}`);
    grid.querySelectorAll('.avatar-choice').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.avatar === selected.id));
    });
  }

  avatars.forEach(avatar => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'avatar-choice';
    button.dataset.avatar = avatar.id;
    button.setAttribute('aria-label', avatar.name);
    button.setAttribute('aria-pressed', 'false');
    const image = document.createElement('img');
    image.src = avatar.src;
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    const name = document.createElement('span');
    name.textContent = avatar.name;
    button.append(image, name);
    button.addEventListener('click', () => {
      selectedId = avatar.id;
      try { localStorage.setItem(avatarKey, selectedId); } catch (_) {}
      renderSelection();
      status.textContent = `¡${avatar.name} ya está en tu equipo!`;
      if (window.DojoAudio) DojoAudio.play('correct');
      if (window.DojoFX) DojoFX.sparkle(button);
      setTimeout(() => dialog.close(), 350);
    });
    grid.append(button);
  });

  renderSelection();
  openButton.addEventListener('click', () => {
    const chosen = grid.querySelector(`[data-avatar="${selectedId}"]`);
    dialog.showModal();
    chosen?.focus();
  });
  closeButton?.addEventListener('click', () => dialog.close());
})();
