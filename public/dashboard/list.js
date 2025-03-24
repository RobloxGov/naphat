document.querySelectorAll("ul li").forEach(item => {
    item.addEventListener("click", function() {
        const dataKey = Object.keys(this.dataset)[0]; // ดึงชื่อ data-* ออกมา

        if (dataKey === "info") {
            window.location.href = "index.html"; // ถ้าเป็น data-info ให้เข้า index.html
        } else {
            window.location.href = `${dataKey}`; // อื่น ๆ เข้าหน้า *.html ตามชื่อ data-*
        }
    });
});
