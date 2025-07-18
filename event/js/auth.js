// auth.js

// ฟังก์ชันตรวจสอบการล็อกอิน
function isLoggedIn() {
  return localStorage.getItem('authenticated') === 'true';
}

// ฟังก์ชันตรวจสอบ Cloudinary Config
function checkCloudinaryConfig() {
  return window.cloudinaryConfig && 
         window.cloudinaryConfig.cloudName && 
         window.cloudinaryConfig.uploadPreset;
}

// ฟังก์ชันล็อกอิน (แก้ไขเพิ่มการตรวจสอบ Cloudinary)
async function login(username, password) {
  try {
    const response = await fetch('/event/member.json');
    if (!response.ok) throw new Error('Failed to fetch user data');
    
    const users = await response.json();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      // ตรวจสอบการตั้งค่า Cloudinary
      if (!checkCloudinaryConfig()) {
        console.warn('Cloudinary config is not properly set');
      }
      
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

// ตรวจสอบการล็อกอินเมื่อโหลดหน้า
function checkAuth() {
  const currentPage = window.location.pathname.split('/').pop();
  const isLoginPage = currentPage === 'login.html';
  const isIndexPage = currentPage === 'index' || currentPage === 'index.html';
  const isUploadPage = currentPage === 'upload' || currentPage === 'upload.html';
  const isAuthenticated = isLoggedIn();

  // ถ้าอยู่หน้า upload แต่ยังไม่ล็อกอิน → ไป login
  if (isUploadPage && !isAuthenticated) {
    window.location.href = 'login.html';
    return false;
  }

  // ถ้าอยู่หน้า login แล้วล็อกอินแล้ว → ไป index
  if (isLoginPage && isAuthenticated) {
    window.location.href = 'index.html';
    return true;
  }

  return isAuthenticated;
}



// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
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
  
  if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
  
  checkAuth();
});
