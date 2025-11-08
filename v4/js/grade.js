let globalData = []; // เก็บข้อมูลทั้งหมด

// ฟังก์ชันดึงข้อมูลข่าวจาก API และแสดงผลในหน้าเว็บ
async function fetchNews() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzBF5EnlRpaiR77oQ450OXn7ZyU7FdFKBdm-KYCYP_YGk8p49s8P-pQR-1Jo_hhZaVk9g/exec');
        const data = await response.json();

        globalData = data; // เก็บไว้ให้ select ใช้

        if (data.length > 0) {
            populateSelects(data);
            renderNews(data);
        } else {
            console.error('ไม่มีข้อมูลข่าว');
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    }
}

// ✅ ใส่ option ให้ select (ไม่มีซ้ำ)
function populateSelects(data) {
    const degreeSelect = document.getElementById('degreeSelect');
    const levelSelect = document.getElementById('levelSelect');

    // ✅ ดึงค่า degree ไม่ซ้ำ
    const uniqueDegrees = [...new Set(data.map(item => item.degree))];

    uniqueDegrees.forEach(deg => {
        degreeSelect.insertAdjacentHTML('beforeend', `<option value="${deg}">${deg}</option>`);
    });

    // ✅ เมื่อเลือก degree → filter level ให้ตรงระดับที่เลือก
    degreeSelect.addEventListener('change', () => {
        const selectedDegree = degreeSelect.value;

        const filteredLevels = [...new Set(
            data
                .filter(item => selectedDegree === "" || item.degree === selectedDegree)
                .map(item => item.level || item.lavel) // รองรับกรณีสะกดผิด
        )];

        levelSelect.innerHTML = `<option value="">-- เลือกระดับชั้น --</option>`;

        filteredLevels.forEach(level => {
            levelSelect.insertAdjacentHTML('beforeend', `<option value="${level}">${level}</option>`);
        });

        filterNews();
    });

    // ✅ เมื่อเลือก level ก็ filter ด้วย
    levelSelect.addEventListener('change', filterNews);
}

// ✅ ฟิลเตอร์ข้อมูลตาม select แล้วแสดงผล
function filterNews() {
    const degree = document.getElementById('degreeSelect').value;
    const level = document.getElementById('levelSelect').value;

    const filtered = globalData.filter(item =>
        (degree === "" || item.degree === degree) &&
        (level === "" || item.level === level || item.lavel === level)
    );

    renderNews(filtered);
}

// ✅ แสดงผลข่าวในหน้าเว็บ
function renderNews(newsData) {
    const newsContainer = document.getElementById('grade-box');
    newsContainer.innerHTML = '';

    newsData.forEach(({ no, degree, level, lavel, term, subject, credit, type, grade }) => {
        const row = `
            <div class="news-item" style="padding:10px; border-bottom:1px solid #ddd;">
                <div><b>${no}. ${subject}</b></div>
                <div>ระดับ: ${degree} / ${level || lavel}</div>
                <div>ภาคเรียน: ${term}</div>
                <div>หน่วยกิต: ${credit} | ประเภท: ${type} | เกรด: ${grade}</div>
            </div>
        `;
        newsContainer.insertAdjacentHTML('beforeend', row);
    });

    if (newsData.length === 0) {
        newsContainer.innerHTML = "<p>ไม่พบข้อมูล</p>";
    }
}

// ✅ โหลดเมื่อเปิดหน้า
document.addEventListener('DOMContentLoaded', fetchNews);
