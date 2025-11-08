const news = document.getElementById("news");
const colBtn = document.getElementById("col");
const rowBtn = document.getElementById("row");

// ฟังก์ชันสำหรับอัปเดตโหมด
function setDirection(mode) {
  // เปลี่ยนค่าใน #news
  news.setAttribute("flex-direction", mode);
  news.style.flexDirection = (mode === "col") ? "column" : "row";

  // เปลี่ยนในทุก element ที่มี direction-style
  const directionElements = document.querySelectorAll("[direction-style]");
  directionElements.forEach(el => {
    el.setAttribute("direction-style", mode);
  });
}

// เริ่มต้น
setDirection("col");

// เมื่อกดปุ่ม
colBtn.addEventListener("click", () => setDirection("col"));
rowBtn.addEventListener("click", () => setDirection("row"));