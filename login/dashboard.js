// เมื่อหน้า Dashboard โหลด
document.addEventListener('DOMContentLoaded', function() {
  console.log("กำลังตรวจสอบการล็อกอิน...");
  
  // แสดง loading state
  document.body.innerHTML = '<div class="loading">กำลังโหลด...</div>';
  
  const unsubscribe = firebase.auth().onAuthStateChanged(user => {
    unsubscribe(); // ยกเลิกการ subscribe
    
    if (user) {
      console.log("พบผู้ใช้ล็อกอิน:", user);
      // แสดงข้อมูลผู้ใช้
    } else {
      console.log("ไม่พบผู้ใช้ล็อกอิน");
      window.location.href = 'index.html';
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  
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
