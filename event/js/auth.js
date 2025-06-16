/**
 * Authentication Module
 * หน้าที่: จัดการการเข้าสู่ระบบ, การตรวจสอบสิทธิ์, และการออกจากระบบ
 */

// ตัวแปรเก็บสถานะการล็อกอิน
let isAuthenticated = false;

// ฟังก์ชันตรวจสอบการล็อกอิน
async function checkAuth() {
  try {
    // ตรวจสอบ path ปัจจุบัน
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isLoginPage = currentPage === 'login.html';
    
    // อ่านค่าจาก localStorage
    const authStatus = localStorage.getItem('authenticated');
    isAuthenticated = authStatus === 'true';

    console.log(`Auth Check: Page=${currentPage}, isLogin=${isLoginPage}, isAuth=${isAuthenticated}`);

    // กรณียังไม่ล็อกอิน และไม่อยู่หน้า login
    if (!isAuthenticated && !isLoginPage) {
      console.log('Redirecting to login page');
      window.location.href = 'login.html';
      return false;
    }

    // กรณีล็อกอินแล้ว แต่มาหน้า login
    if (isAuthenticated && isLoginPage) {
      console.log('Redirecting to index page');
      window.location.href = 'index.html';
      return true;
    }

    return isAuthenticated;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
}

// ฟังก์ชันล็อกอิน
async function login(username, password) {
  try {
    console.log('Attempting login...');
    
    // ดึงข้อมูลสมาชิก
    const response = await fetch('/member.json');
    if (!response.ok) throw new Error('Failed to fetch user data');
    
    const users = await response.json();
    console.log('Loaded users:', users);

    // ตรวจสอบผู้ใช้
    const user = users.find(u => 
      u.username === username && 
      u.password === password
    );

    if (user) {
      console.log('Login successful for user:', username);
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('username', username);
      isAuthenticated = true;
      
      // Redirect ไปหน้าหลัก
      window.location.href = 'index.html';
      return true;
    } else {
      console.log('Login failed - invalid credentials');
      alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ: ' + error.message);
    return false;
  }
}

// ฟังก์ชันล็อกเอาท์
function logout() {
  console.log('Logging out...');
  localStorage.removeItem('authenticated');
  localStorage.removeItem('username');
  isAuthenticated = false;
  window.location.href = 'login.html';
}

// ฟังก์ชันตรวจสอบว่าล็อกอินหรือไม่
function isLoggedIn() {
  return localStorage.getItem('authenticated') === 'true';
}

// ฟังก์ชันรับชื่อผู้ใช้ปัจจุบัน
function getCurrentUser() {
  return localStorage.getItem('username') || '';
}

// Initialize Authentication System
document.addEventListener('DOMContentLoaded', function() {
  // สำหรับหน้า login
  if (document.getElementById('loginForm')) {
    console.log('Initializing login form...');
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      await login(username, password);
    });
  }

  // สำหรับปุ่ม logout
  if (document.getElementById('logoutBtn')) {
    console.log('Initializing logout button...');
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }

  // ตรวจสอบการล็อกอินเมื่อโหลดหน้า (ยกเว้นหน้า login)
  if (!window.location.pathname.includes('login.html')) {
    console.log('Running auth check...');
    checkAuth();
  }
});

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkAuth,
    login,
    logout,
    isLoggedIn,
    getCurrentUser
  };
}
