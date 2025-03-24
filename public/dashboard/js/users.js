document.addEventListener("DOMContentLoaded", function () {
    const activeUsersElement = document.getElementById("active-users");
    let currentUsers = Math.floor(Math.random() * 128) + 1; // เริ่มต้นสุ่มค่า 1-128

    function updateActiveUsers() {
        let change = Math.floor(Math.random() * 21) - 10; // สุ่มเปลี่ยนแปลงในช่วง -10 ถึง +10
        currentUsers = Math.max(1, Math.min(128, currentUsers + change)); // จำกัดค่าระหว่าง 1 ถึง 128
        activeUsersElement.textContent = currentUsers;
    }

    activeUsersElement.textContent = currentUsers;
    setInterval(updateActiveUsers, 60000); // อัปเดตทุก 1 นาที
});
