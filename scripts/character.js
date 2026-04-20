document.addEventListener('DOMContentLoaded', () => {
  const utils = new GameUtils();
  const token = localStorage.getItem('token');
  if (!token) window.location.href = 'auth.html';

  let selectedClass = 'Code Mage';
  let selectedAvatar = 'blue';

  const classCards = document.querySelectorAll('.class-card');
  classCards.forEach(card => {
    card.addEventListener('click', () => {
      utils.playSound('click');
      classCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedClass = card.getAttribute('data-class');
    });
  });

  const avatarCircles = document.querySelectorAll('.avatar-circle');
  avatarCircles.forEach(circle => {
    circle.addEventListener('click', () => {
      utils.playSound('click');
      avatarCircles.forEach(c => c.classList.remove('selected'));
      circle.classList.add('selected');
      selectedAvatar = circle.getAttribute('data-color');
    });
  });

  document.getElementById('begin-quest-btn').addEventListener('click', async () => {
    utils.playSound('levelup');
    const heroName = document.getElementById('hero-name').value || 'Hero';

    try {
      const res = await fetch('http://localhost:3000/api/progress/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          heroName,
          heroClass: selectedClass,
          heroAvatar: selectedAvatar
        })
      });

      if (res.ok) {
        setTimeout(() => {
          window.location.href = 'world-map.html';
        }, 1000);
      } else {
        console.error('Failed to save hero');
      }
    } catch (err) {
      console.error(err);
    }
  });
});
