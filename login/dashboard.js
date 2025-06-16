// เมื่อหน้า dashboard โหลดเสร็จ
document.addEventListener('DOMContentLoaded', function() {
    const user = firebase.auth().currentUser;
    
    if (user) {
        // แสดงข้อมูลผู้ใช้
        document.getElementById('user-name').textContent = user.displayName || 'ผู้ใช้';
        document.getElementById('user-email').textContent = user.email;
        
        // แสดงรูปโปรไฟล์ (ถ้ามี)
        if (user.photoURL) {
            document.getElementById('user-photo').src = user.photoURL;
        } else {
            // ถ้าไม่มีรูป ให้ใช้รูปเริ่มต้น
            document.getElementById('user-photo').src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
        }
    }
});
