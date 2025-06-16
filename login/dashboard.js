// เมื่อหน้า Dashboard โหลด
document.addEventListener('DOMContentLoaded', function() {
  // วิธีที่ 1: ใช้ข้อมูลจาก localStorage
  const userData = JSON.parse(localStorage.getItem('user'));
  
  // วิธีที่ 2: ใช้ Firebase Auth (แนะนำ)
  const user = firebase.auth().currentUser;

  if (user) {
    // แสดงข้อมูลผู้ใช้
    document.getElementById('user-name').textContent = user.displayName || 'ผู้ใช้';
    document.getElementById('user-email').textContent = user.email;
    
    // แสดงรูปโปรไฟล์ (ถ้ามี)
    if (user.photoURL) {
      document.getElementById('user-photo').src = user.photoURL;
    }
  } else {
    // ถ้าไม่มีผู้ใช้ล็อกอิน ให้กลับไปหน้า Login
    window.location.href = 'index.html';
  }
});

// ฟังก์ชันออกจากระบบ
function logout() {
  firebase.auth().signOut()
    .then(() => {
      // ลบข้อมูลผู้ใช้จาก localStorage
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    })
    .catch((error) => {
      alert('เกิดข้อผิดพลาด: ' + error.message);
    });
}
