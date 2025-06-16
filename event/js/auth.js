const USER_DATA = 'member.json';

async function checkAuth() {
  const isLoginPage = window.location.pathname.includes('login.html');
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';
  
  if (!isAuthenticated && !isLoginPage) {
    window.location.href = 'login.html';
  }
  
  if (isAuthenticated && isLoginPage) {
    window.location.href = 'upload.html';
  }
}

async function login(username, password) {
  try {
    const response = await fetch(USER_DATA);
    const users = await response.json();
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem('authenticated', 'true');
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

function logout() {
  localStorage.removeItem('authenticated');
  window.location.href = 'login.html';
}

// Event listeners for login and logout
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      const success = await login(username, password);
      
      if (success) {
        window.location.href = 'upload.html';
      } else {
        alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    });
  }
  
  if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
  
  checkAuth();
});