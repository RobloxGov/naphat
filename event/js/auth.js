// ตรวจสอบการล็อกอิน
function isLoggedIn() {
  return localStorage.getItem('authenticated') === 'true';
}

// ฟังก์ชันล็อกอิน
async function login(username, password) {
  try {
    const response = await fetch('/member.json');
    const users = await response.json();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('username', username);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

// ฟังก์ชันล็อกเอาท์
function logout() {
  localStorage.removeItem('authenticated');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}

// ตรวจสอบสิทธิ์เมื่อโหลดหน้า
function checkAuth() {
  const currentPage = window.location.pathname.split('/').pop();
  const isLoginPage = currentPage === 'login.html';
  
  if (!isLoggedIn() && !isLoginPage) {
    window.location.href = 'login.html';
    return false;
  }
  
  if (isLoggedIn() && isLoginPage) {
    window.location.href = 'index.html';
    return true;
  }
  
  return isLoggedIn();
}

// ตรวจสอบการตั้งค่า Cloudinary
function checkCloudinaryConfig() {
  return CLOUDINARY_CONFIG.cloudName && 
         CLOUDINARY_CONFIG.uploadPreset && 
         CLOUDINARY_CONFIG.apiKey;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // ตั้งค่า Cloudinary Global
  window.cloudinaryConfig = CLOUDINARY_CONFIG;
  
  // ฟอร์มล็อกอิน
  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      if (await login(username, password)) {
        window.location.href = 'index.html';
      } else {
        alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    });
  }
  
  // ปุ่มล็อกเอาท์
  if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
  
  checkAuth();
});
