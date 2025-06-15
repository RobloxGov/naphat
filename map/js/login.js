// ตรวจสอบสถานะการล็อกอิน
auth.onAuthStateChanged(user => {
  if (user) {
    // ถ้าล็อกอินแล้วให้ redirect ไปหน้าแรก
    window.location.href = 'index.html';
  }
});

// ล็อกอินด้วยอีเมล/รหัสผ่าน
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('errorMessage');
  
  try {
    errorMessage.textContent = '';
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    
    // ล็อกอินสำเร็จ - redirect ไปหน้าแรก
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Login error:', error);
    
    // แสดงข้อความผิดพลาดที่เป็นภาษาไทย
    switch(error.code) {
      case 'auth/invalid-email':
        errorMessage.textContent = 'รูปแบบอีเมลไม่ถูกต้อง';
        break;
      case 'auth/user-disabled':
        errorMessage.textContent = 'บัญชีนี้ถูกระงับการใช้งาน';
        break;
      case 'auth/user-not-found':
        errorMessage.textContent = 'ไม่พบผู้ใช้งานนี้';
        break;
      case 'auth/wrong-password':
        errorMessage.textContent = 'รหัสผ่านไม่ถูกต้อง';
        break;
      default:
        errorMessage.textContent = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ: ' + error.message;
    }
  }
});

// ล็อกอินด้วย Google
document.getElementById('googleLogin').addEventListener('click', async () => {
  try {
    // ต้องเพิ่ม Firebase Google Auth Provider ในไฟล์ firebase.js ก่อน
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    
    // ล็อกอินสำเร็จ - redirect ไปหน้าแรก
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Google login error:', error);
    document.getElementById('errorMessage').textContent = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google';
  }
});

// ล็อกอินด้วย Facebook
document.getElementById('facebookLogin').addEventListener('click', async () => {
  try {
    // ต้องเพิ่ม Firebase Facebook Auth Provider ในไฟล์ firebase.js ก่อน
    const provider = new firebase.auth.FacebookAuthProvider();
    const result = await auth.signInWithPopup(provider);
    
    // ล็อกอินสำเร็จ - redirect ไปหน้าแรก
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Facebook login error:', error);
    document.getElementById('errorMessage').textContent = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Facebook';
  }
});
