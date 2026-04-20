document.addEventListener('DOMContentLoaded', () => {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const registerFields = document.getElementById('register-fields');
  const authForm = document.getElementById('auth-form');
  const errorMsg = document.getElementById('error-msg');
  const utils = new GameUtils();

  let isLogin = true;

  tabLogin.addEventListener('click', () => {
    utils.playSound('click');
    isLogin = true;
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    registerFields.style.display = 'none';
    errorMsg.style.display = 'none';
  });

  tabRegister.addEventListener('click', () => {
    utils.playSound('click');
    isLogin = false;
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerFields.style.display = 'block';
    errorMsg.style.display = 'none';
  });

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    utils.playSound('click');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { username, email, password };

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) {
        errorMsg.style.display = 'block';
        errorMsg.innerText = data.msg || 'An error occurred';
        utils.playSound('wrong');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      utils.playSound('correct');
      
      setTimeout(() => {
        if(isLogin) {
            window.location.href = 'world-map.html';
        } else {
            window.location.href = 'character-create.html';
        }
      }, 500);

    } catch (err) {
      console.error(err);
      errorMsg.style.display = 'block';
      errorMsg.innerText = 'Server error';
      utils.playSound('wrong');
    }
  });
});
