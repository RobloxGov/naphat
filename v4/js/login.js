// ดึงข้อมูลผู้ใช้จาก Google Script
async function fetchUsers() {
    const url = "https://script.google.com/macros/s/AKfycbxM6DbrDR_mlQm04hvs8HX61KJeWHmN0bfdjFia6kD7Eumf9M-3DknqO346b28-Wx1neg/exec";
    const response = await fetch(url);
    return await response.json();
}

// เลือกรูปตามสถานะ
function getImageByStatus(status) {
    if (status === "naphat") return "image/admin.png";
    if (status === "members") return "image/true.png";
    return "image/default.png";
}

// อัพเดต UI ตามสถานะ login
function updateProfileUI() {
    const profile = document.querySelector('.profile');
    const aside = document.querySelector('aside');
    const img = document.getElementById("profile-image");

    const user = JSON.parse(localStorage.getItem("user"));

    if (!profile) return; // กัน null

    if (user) {
        profile.setAttribute("login", "true");

        // อัปเดตภาพ ถ้ามี element นี้
        if (img) {
            img.src = getImageByStatus(user.status);
        }

        // อัปเดต aside/status
        if (aside) {
            aside.setAttribute("status", user.status || "");
        }

    } else {
        profile.setAttribute("login", "false");

        // รีเซ็ต aside
        if (aside) {
            aside.setAttribute("status", "none");
        }
    }
}
updateProfileUI();

// เปิด/ปิด popup
const trigger = document.getElementById('login');
const overlay = document.getElementById('loginModal');
const closeBtn = document.getElementById('closeBtn');

if (trigger && overlay && closeBtn) {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add("show");
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove("show");
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove("show");
    });
}

// Login submit
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const email = ev.target.email.value.trim();
        const password = ev.target.password.value.trim();

        const users = await fetchUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            return;
        }

        localStorage.setItem("user", JSON.stringify(user));
        updateProfileUI();
        overlay.classList.remove("show");
    });
}

// ลืมรหัสผ่าน
async function forgetPassword() {
    const email = prompt("กรอกอีเมล:");
    const username = prompt("กรอกชื่อผู้ใช้:");

    if (!email || !username) return;

    const users = await fetchUsers();
    const user = users.find(u => u.email === email && u.username === username);

    if (!user) return alert("ไม่พบข้อมูลผู้ใช้!");

    alert(`รหัสผ่านคือ: ${user.password}`);
}

// LOGOUT

document.addEventListener("DOMContentLoaded", () => {
  const profile = document.querySelector('.profile');
  const logoutPopup = document.querySelector('.logout-popup');
  const logoutBtn = document.getElementById('logout');

  // เปิด/ปิด popup เมื่อคลิกโปรไฟล์ (เฉพาะตอน login="true")
  profile.addEventListener("click", (e) => {
    if (profile.getAttribute("login") === "true") {
      e.stopPropagation(); // กันไม่ให้คลิกทะลุ
      if (logoutPopup.getAttribute("hidden") === "") {
        logoutPopup.setAttribute("hidden", "none");
      } else {
        logoutPopup.setAttribute("hidden", "");
      }
    }
  });

  // กันไม่ให้คลิกภายใน popup ปิดมันเอง
  logoutPopup.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // คลิกที่อื่น → ปิด popup
  document.addEventListener("click", () => {
    if (logoutPopup.getAttribute("hidden") === "none") {
      logoutPopup.setAttribute("hidden", "");
    }
  });

  // ปุ่มออกจากระบบ
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");  // ลบข้อมูล user
    location.reload(); // รีเฟรชหน้าให้กลับเป็น login=false
  });
});
