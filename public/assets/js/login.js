async function login(event) {
    event.preventDefault(); // ป้องกันการรีโหลดหน้า

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorElement = document.getElementById("error");

    if (!username || !password) {
        errorElement.textContent = "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน";
        return;
    }

    try {
        const response = await fetch("/public/data/employees.json");

        if (!response.ok) {
            throw new Error("ไม่สามารถโหลดข้อมูลพนักงานได้");
        }

        const employees = await response.json();

        // ค้นหาพนักงานที่ username และ password ตรงกัน
        const employee = employees.find(emp => emp.username === username && emp.password === password);

        if (employee) {
            // ✅ บันทึกข้อมูลผู้ใช้ไว้ใน localStorage
            localStorage.setItem("loggedInUser", JSON.stringify(employee)); 

            // ✅ เปลี่ยนเส้นทางไปหน้า Dashboard
            window.location.href = "/public/dashboard/index"; 
        } else {
            errorElement.textContent = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
        }
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        errorElement.textContent = "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่";
    }
}
