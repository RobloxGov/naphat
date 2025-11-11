const eventsUrl = "https://script.google.com/macros/s/AKfycbyrcc3Pfuf6iX9Re87D_1bTz58Hh6aPnOfucCJ3eC6O-AzniK0E_HcJAj8wf-m4XJ8t/exec";

// ------------ สร้างปฏิทิน ----------------
function generateCalendar(year, month, events) {
    const calendarEl = document.getElementById('box-calendar');
    const monthNames = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    const titleEl = document.getElementById("calendar-title");
    if (titleEl) {
        titleEl.innerText = monthNames[month] + " " + (year + 543);
    }

    const today = new Date();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let html = '<table><tr><th>อา</th><th>จ</th><th>อ</th><th>พ</th><th>พฤ</th><th>ศ</th><th>ส</th></tr><tr>';

    // ช่องว่างก่อนวันแรก
    for (let i = 0; i < firstDay.getDay(); i++) html += '<td></td>';

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateStr = `${day}/${month + 1}/${year}`;
        const isToday = (today.getDate() === day && today.getMonth() === month && today.getFullYear() === year);
        const hasEvent = events.some(ev => ev.day === dateStr);

        html += `<td${isToday ? ' class="today"' : ''}${hasEvent ? ' style="font-weight:bold;"' : ''}>${day}</td>`;

        if ((day + firstDay.getDay()) % 7 === 0) html += '</tr><tr>';
    }

    html += '</tr></table>';
    calendarEl.innerHTML = html;
}

// ------------ สร้างรายการเหตุการณ์ + countdown ----------------
function generateEventList(events) {
    const listEl = document.getElementById('eventList');
    const today = new Date();
    let html = '';

    events.forEach((ev, idx) => {
        // เตรียม id แบบเฉพาะตัวสำหรับแต่ละ event
        const idBase = `countdown-${idx}`;
        // ถ้า ev.time ไม่มี ให้เป็น 00:00
        const timeStr = ev.time && ev.time.trim() ? ev.time.trim() : "00:00";
        // แสดงวันที่/เวลาและช่อง countdown (days hours minutes seconds)
        html += `
        <div class="col-4" id="event-${idx}">
            <div class="single-news-item">
                <div class="info mt-3">
                    <h5>${ev.detail}</h5>
                    <div class="writer mb-3 mt-3">
                        <span class="date d-inline-block">${ev.date}</span>
                        <div class="author d-inline-block" id="${idBase}">
                            <span id="${idBase}-days">--</span> วัน
                            <span id="${idBase}-hours">--</span> : 
                            <span id="${idBase}-minutes">--</span> : 
                            <span id="${idBase}-seconds">--</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        // เรียก startCountdown สำหรับเหตุการณ์นี้ (ไม่ต้องรอ)
        startCountdown(idx, ev.day, timeStr);
    });

    listEl.innerHTML = html;
}

// ------------ ดึงข้อมูลแล้ว render ----------------
function loadEventsAndRender() {
    fetch(eventsUrl)
        .then(res => res.json())
        .then(events => {
            const now = new Date();
            generateCalendar(now.getFullYear(), now.getMonth(), events);
            generateEventList(events);
        })
        .catch(err => console.error("Error fetching events:", err));
}

loadEventsAndRender();

// ------------ ระบบตรวจเดือนใหม่ทุก 10 วินาที ----------------
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

setInterval(() => {
    const now = new Date();

    if (now.getMonth() !== currentMonth || now.getFullYear() !== currentYear) {
        // อัปเดตเดือนใหม่
        currentMonth = now.getMonth();
        currentYear = now.getFullYear();

        loadEventsAndRender();
    }
}, 10000);


// ------------ ฟังก์ชันนับถอยหลังแบบเต็ม ----------------
const countdownIntervals = {}; // เก็บ interval id ถ้าต้องการ clear ทีหลัง

function startCountdown(index, countdownDay, countdownTime) {
    // ป้องกัน interval ซ้ำ ถ้ามีอยู่แล้ว ให้เคลียร์ก่อน
    if (countdownIntervals[index]) {
        clearInterval(countdownIntervals[index]);
    }

    const [day, month, year] = countdownDay.split("/").map(Number);
    const [hours = 0, minutes = 0] = (countdownTime || "00:00").split(":").map(v => Number(v));

    // สร้าง targetDate เป็น local time (ลดปัญหา timezone/NaN)
    const targetDate = new Date(year, month - 1, day, hours || 0, minutes || 0, 0);

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        const baseId = `countdown-${index}`;
        const baseEl = document.getElementById(baseId);
        if (!baseEl) {
            // ถ้า element ถูกลบ/ยังไม่สร้าง ให้หยุด interval
            if (countdownIntervals[index]) {
                clearInterval(countdownIntervals[index]);
                delete countdownIntervals[index];
            }
            return;
        }

        if (diff <= 0) {
            baseEl.innerHTML = "<b>ถึงกำหนดเวลาแล้ว</b>";
            if (countdownIntervals[index]) {
                clearInterval(countdownIntervals[index]);
                delete countdownIntervals[index];
            }
            return;
        }

        const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutesLeft = Math.floor((diff / (1000 * 60)) % 60);
        const secondsLeft = Math.floor((diff / 1000) % 60);

        const daysEl = document.getElementById(`${baseId}-days`);
        const hoursEl = document.getElementById(`${baseId}-hours`);
        const minutesEl = document.getElementById(`${baseId}-minutes`);
        const secondsEl = document.getElementById(`${baseId}-seconds`);

        if (daysEl) daysEl.textContent = daysLeft;
        if (hoursEl) hoursEl.textContent = String(hoursLeft).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutesLeft).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(secondsLeft).padStart(2, '0');
    }

    // เรียกอัปเดตทันทีแล้วตั้ง interval
    updateCountdown();
    countdownIntervals[index] = setInterval(updateCountdown, 1000);
}
