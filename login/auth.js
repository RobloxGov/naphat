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

// ตรวจสอบสถานะการล็อกอินและ redirect
auth.onAuthStateChanged(user => {
    if (user) {
        // ถ้าอยู่ในหน้า login และล็อกอินแล้ว ให้ไป dashboard
        if (window.location.pathname.includes('index.html') || 
            window.location.pathname === '/') {
            window.location.href = 'dashboard.html';
        }
    } else {
        // ถ้าอยู่ในหน้า dashboard และยังไม่ล็อกอิน ให้ไปหน้า login
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'index.html';
        }
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

// ฟังก์ชันสมัครสมาชิก (ปรับปรุงแล้ว)
function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    // ตรวจสอบว่ามีการกรอกข้อมูลครบถ้วน
    if (!name || !email || !password) {
        alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // อัปเดตชื่อผู้ใช้
            return userCredential.user.updateProfile({
                displayName: name
            });
        })
        .then(() => {
            alert('สมัครสมาชิกสำเร็จ!');
            // หลังจากสมัครสำเร็จจะถูก redirect โดยอัตโนมัติจาก onAuthStateChanged
        })
        .catch((error) => {
            // จัดการข้อผิดพลาดเฉพาะกรณี
            if (error.code === 'auth/email-already-in-use') {
                alert('อีเมลนี้ถูกใช้งานโดยบัญชีอื่นแล้ว\nกรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบด้วยอีเมลนี้');
            } else if (error.code === 'auth/invalid-email') {
                alert('รูปแบบอีเมลไม่ถูกต้อง');
            } else if (error.code === 'auth/weak-password') {
                alert('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
            } else {
                alert('เกิดข้อผิดพลาด: ' + error.message);
            }
        });
}

// ฟังก์ชันเข้าสู่ระบบ (ปรับปรุงแล้ว)
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('กรุณากรอกอีเมลและรหัสผ่าน');
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            // หลังจากล็อกอินสำเร็จจะถูก redirect โดยอัตโนมัติจาก onAuthStateChanged
        })
        .catch((error) => {
            if (error.code === 'auth/user-not-found') {
                alert('ไม่พบผู้ใช้งานนี้\nกรุณาตรวจสอบอีเมลหรือสมัครสมาชิกใหม่');
            } else if (error.code === 'auth/wrong-password') {
                alert('รหัสผ่านไม่ถูกต้อง');
            } else if (error.code === 'auth/invalid-email') {
                alert('รูปแบบอีเมลไม่ถูกต้อง');
            } else {
                alert('เกิดข้อผิดพลาด: ' + error.message);
            }
        });
}

// ฟังก์ชันเข้าสู่ระบบด้วย Google
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(() => {
            // หลังจากล็อกอินสำเร็จจะถูก redirect โดยอัตโนมัติจาก onAuthStateChanged
        })
        .catch((error) => {
            alert('เกิดข้อผิดพลาด: ' + error.message);
        });
}

// ฟังก์ชันออกจากระบบ
function logout() {
    auth.signOut()
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            alert('เกิดข้อผิดพลาด: ' + error.message);
        });
}
