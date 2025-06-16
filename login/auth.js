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
            // หลังจากสมัครสำเร็จจะถูก redirect โดยอัตโนมัติจาก onAuthStateChanged
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
            // หลังจากล็อกอินสำเร็จจะถูก redirect โดยอัตโนมัติจาก onAuthStateChanged
        })
        .catch((error) => {
            alert('เกิดข้อผิดพลาด: ' + error.message);
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
