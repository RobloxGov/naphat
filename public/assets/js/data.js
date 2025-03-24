document.addEventListener('DOMContentLoaded', function() {
    // หาปุ่มที่มี data-reg="2568"
    const button = document.querySelector('button[data-reg="2568"]');
    
    if (button) {
        // เพิ่ม event listener เมื่อคลิก
        button.addEventListener('click', function() {
            window.location.href = '/meeting/e-registration';
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // หาปุ่มที่มี data-meet="2568"
    const button = document.querySelector('button[data-meet="2568"]');
    
    if (button) {
        // เพิ่ม event listener เมื่อคลิก
        button.addEventListener('click', function() {
            window.location.href = '/meeting/';
        });
    }
});

        document.addEventListener('DOMContentLoaded', function() {
            const buttonReg = document.querySelector('button[data-reg="2568"]');
            const buttonMeet = document.querySelector('button[data-meet="2568"]');
            
            const targetDateReg = new Date('2025-04-30T12:00:00'); // วันที่ 30 เมษายน 2568 เวลา 12.00 น.
            const targetDateMeet = new Date('2025-04-30T06:00:00'); // วันที่ 30 เมษายน 2568 เวลา 06.00 น.
            
            const currentDate = new Date(); // เวลาปัจจุบัน

            // ตรวจสอบเวลาปัจจุบันว่าอยู่ในช่วงที่ต้องการหรือไม่
            if (currentDate >= targetDateReg) {
                buttonReg.style.display = 'none'; // ซ่อน button[data-reg="2568"] หลังจากวันที่ 30 เมษายน 2568 เวลา 12.00 น.
            } else {
                buttonReg.style.display = 'block'; // แสดง button[data-reg="2568"] ถ้ายังไม่ถึงเวลา
            }

            if (currentDate >= targetDateMeet) {
                buttonMeet.style.display = 'block'; // แสดง button[data-meet="2568"] หลังจากวันที่ 30 เมษายน 2568 เวลา 06.00 น.
            } else {
                buttonMeet.style.display = 'none'; // ซ่อน button[data-meet="2568"] ถ้ายังไม่ถึงเวลา
            }
        });
