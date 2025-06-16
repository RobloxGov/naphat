// กำหนดค่า Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyBvatGUus20Ei_T1D9UVu-bMHmFfaJQtW0",
    authDomain: "naphat-dev-login.firebaseapp.com",
    projectId: "naphat-dev-login",
    storageBucket: "naphat-dev-login.firebasestorage.app",
    messagingSenderId: "991209084672",
    appId: "1:991209084672:web:bd5bbe12c596198fdb85e5",
    measurementId: "G-L1KJVBFWBT"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ตรวจสอบสถานะการล็อกอิน
auth.onAuthStateChanged(user => {
    if (user) {
        // ผู้ใช้ล็อกอินแล้ว
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
        
        document.getElementById('user-name').textContent = user.displayName || user.email;
        document.getElementById('user-email').textContent = user.email;
    } else {
        // ไม่มีผู้ใช้ล็อกอิน
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('user-info').style.display = 'none';
    }
});

// ฟังก์ชันแสดงฟอร์มสมัครสมาชิก
function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

// ฟังก์ชันแสดงฟอร์มเข้าสู่ระบบ
function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// ฟังก์ชันสมัครสมาชิก
function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // อัปเดตชื่อผู้ใช้
            return userCredential.user.updateProfile({
                displayName: name
            });
        })
        .then(() => {
            alert('สมัครสมาชิกสำเร็จ!');
        })
        .catch((error) => {
            alert('เกิดข้อผิดพลาด: ' + error.message);
        });
}

// ฟังก์ชันเข้าสู่ระบบ
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            alert('เข้าสู่ระบบสำเร็จ!');
        })
        .catch((error) => {
            alert('เกิดข้อผิดพลาด: ' + error.message);
        });
}
// Google
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(() => {
            alert('เข้าสู่ระบบด้วย Google สำเร็จ!');
        })
        .catch((error) => {
            alert('เกิดข้อผิดพลาด: ' + error.message);
        });
}

// ฟังก์ชันออกจากระบบ
function logout() {
    auth.signOut()
        .then(() => {
            alert('ออกจากระบบสำเร็จ');
        })
        .catch((error) => {
            alert('เกิดข้อผิดพลาด: ' + error.message);
        });
}
