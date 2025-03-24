async function checkLogin() {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        alert("กรุณาเข้าสู่ระบบ");
        window.location.href = "/public/login"; 
        return;
    }

    const user = JSON.parse(loggedInUser);

    try {
        const response = await fetch("/public/data/employees.json");

        if (!response.ok) {
            throw new Error("ไม่สามารถโหลดข้อมูลพนักงานได้");
        }

        const employees = await response.json();
        const employee = employees.find(emp => emp.username === user.username && emp.password === user.password);

        if (employee) {
            displayUserInfo(employee);
        } else {
            localStorage.removeItem("loggedInUser");
            alert("ข้อมูลผู้ใช้ไม่ตรงกัน กรุณาล็อกอินใหม่");
            window.location.href = "/public/login.html";
        }
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูลพนักงาน");
    }
}

// ฟังก์ชันแสดงข้อมูลผู้ใช้
function displayUserInfo(user) {
    const userInfo = document.getElementById("userInfo");
    if (userInfo) {
        userInfo.innerHTML = `
            <img src="${user.img}" alt="Profile Picture">
            <div class="user-details">
                <h3>${user.fname} ${user.lname}</h3>
                <p>ตำแหน่ง: ${user.position}</p>
                <p>มหาวิทยาลัย: ${user.education}</p>
            </div>
        `;
    }
}

// ตรวจสอบข้อมูลใหม่ทุก 10 วินาที
setInterval(checkLogin, 10000);

// ปุ่มออกจากระบบ
document.getElementById("logoutBtn").addEventListener("click", function() {
    localStorage.removeItem("loggedInUser");
    alert("ออกจากระบบเรียบร้อย");
    window.location.href = "/public/login.html";
});

// เรียกใช้ฟังก์ชันตรวจสอบการล็อกอิน
checkLogin();


function updateLayout() { let content = document.querySelector("[data-ml], [data-ml-240]"); if (window.innerWidth <= 500) { content.removeAttribute("data-ml-240"); content.setAttribute("data-ml", ""); } } document.querySelector("[data-logo]").addEventListener("click", function() { let sidebar = document.querySelector(".sidebar"); sidebar.classList.toggle("active"); let content = document.querySelector("[data-ml], [data-ml-240]"); if (window.innerWidth > 500) { if (content.hasAttribute("data-ml")) { content.removeAttribute("data-ml"); content.setAttribute("data-ml-240", ""); } else { content.removeAttribute("data-ml-240"); content.setAttribute("data-ml", ""); } } }); window.addEventListener("resize", updateLayout); updateLayout();
function startCountdown(id, targetDate) { function updateCountdown() { const now = new Date().getTime(); const timeRemaining = targetDate - now; if (timeRemaining <= 0) { document.getElementById(id).innerHTML = "ถึงเวลาแล้ว!"; clearInterval(interval); return; } const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24)); const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)); const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000); document.getElementById(id).innerHTML = `${days} วัน ${hours} ชม. ${minutes} นาที ${seconds} วินาที`; } updateCountdown(); const interval = setInterval(updateCountdown, 1000); } const reportDate = new Date("April 29, 2025 08:30:00").getTime(); const openDate = new Date("June 30, 2025 00:00:00").getTime(); startCountdown("kmitl1-countdown", reportDate); startCountdown("kmitl-open-countdown", openDate);
