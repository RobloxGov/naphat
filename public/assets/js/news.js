// ฟังก์ชันดึงข้อมูลข่าวจาก API และแสดงผลในหน้าเว็บ
async function fetchNews() {
    try {
        // ดึงข้อมูลจาก API
        const response = await fetch('https://script.google.com/macros/s/AKfycbzY7Z4hY8ak-UsQ6Qc_F9vGj2-1M8dttbxPSyIP_QXZrRnzZfBYNNdiUKD_Qc7S7F8j/exec');
        const data = await response.json();

        // ตรวจสอบว่ามีข้อมูลหรือไม่
        if (data.length > 0) {
            renderNews(data); // เรียกฟังก์ชันแสดงข้อมูล
        } else {
            console.error('ไม่มีข้อมูลข่าว');
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    }
}

// ฟังก์ชันแสดงข้อมูลข่าวในหน้าเว็บ
function renderNews(newsData) {
    const newsContainer = document.getElementById('news'); // ค้นหา element id="news"
    newsContainer.innerHTML = ''; // ล้างเนื้อหาเก่า

    // สร้าง HTML สำหรับแต่ละข่าว
    newsData.forEach(({ link, img, datePost, details }) => {
        const newsItem = `
            <div class="col-4">
                <div class="single-news-item">
                    <a href="${link}" class="image">
                        <img fetchpriority="high" decoding="async" src="${img}" alt="" class="img-fluid">
                    </a>
                    <div class="info mt-3">
                        <div class="writer mb-3">
                            <span class="date d-inline-block">${datePost}</span>
                            <a href="${link}" class="author d-inline-block">โดย NaphatDev</a>
                        </div>
                        <h5>
                            <a href="${link}">${details}</a>
                        </h5>
                        <a href="${link}" class="d-inline-block mt-3 mb-5">อ่านต่อ</a>
                    </div>
                </div>
            </div>`;
        newsContainer.insertAdjacentHTML('beforeend', newsItem); // เพิ่ม HTML ลงในหน้า
    });
}

// เรียกฟังก์ชันเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', fetchNews);
