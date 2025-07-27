// --------- ตัวช่วยสุ่ม ---------
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// --------- โจทย์ฟังก์ชันตรีโกณ ---------
let funcType = randChoice(['sin', 'cos']);
let A = randInt(1, 5); // ค่าสูงสุด - ค่าต่ำสุด = 2A
let D = randInt(-3, 3); // ค่าเฉลี่ย
let B = (Math.PI * 2) / randInt(2, 6); // คาบยาว
let C = randInt(-3, 3);

let startShape = randChoice([
    'ลดลงแบบเว้าขึ้น',
    'เพิ่มขึ้นแบบเว้าขึ้น',
    'ลดลงแบบเว้าลง',
    'เพิ่มขึ้นแบบเว้าลง'
]);

let yMax = A + D;
let yMin = -A + D;
let yIntercept = (funcType === 'sin') ? D : A * Math.cos(0 - C) + D;
yIntercept = Math.round(yIntercept * 100) / 100;

let trigQuestion = `จงหาฟังก์ชันรูป ${funcType} ที่มีค่าเฉลี่ยเป็น ${D}, ค่าสูงสุดคือ ${yMax}, ค่าต่ำสุดคือ ${yMin}, จุดตัดแกนตั้งอยู่ที่ ${yIntercept}, เริ่มต้นด้วยค่าที่ ${startShape}, มีคาบยาวประมาณ ${(2 * Math.PI / B).toFixed(2)}, แกนนอนคือ x แกนตั้งคือ y`;

document.getElementById("trig-question").innerText = trigQuestion;

// ตรวจฟังก์ชัน sin/cos
function checkTrig() {
    let ans = document.getElementById("trig-answer").value;
    ans = ans.replace(/\s+/g, '').toLowerCase();

    let expectedFunc = `y=${A}${funcType}(${B.toFixed(2)}x-${C})+${D}`;
    let regex = new RegExp(`${funcType}\$begin:math:text$(.*?)\\$end:math:text$`, 'i');
    if (ans.includes(funcType)) {
        document.getElementById("trig-result").innerText = "✅ รูปแบบสมเหตุสมผล (ไม่ตรวจละเอียด)";
    } else {
        document.getElementById("trig-result").innerText = "❌ คำตอบไม่ถูกต้อง หรือไม่ใช่ฟังก์ชัน " + funcType;
    }
}

// --------- โจทย์สมการควอดราติก ---------
let points = [
    [randInt(-5, 5), randInt(-5, 20)],
    [randInt(-5, 5), randInt(-5, 20)],
    [randInt(-5, 5), randInt(-5, 20)]
];
let quadQuestion = `จงหาสมการควอดราติกที่ผ่านจุด (${points[0]}), (${points[1]}), (${points[2]})`;
document.getElementById("quad-question").innerText = quadQuestion;

// ตรวจสมการควอดราติกแบบเบื้องต้น
function checkQuad() {
    let ans = document.getElementById("quad-answer").value;
    if (!ans.toLowerCase().includes("x")) {
        document.getElementById("quad-result").innerText = "❌ สมการควรมีตัวแปร x";
        return;
    }
    document.getElementById("quad-result").innerText = "✅ ตรวจแล้ว: สมเหตุสมผล (ระบบไม่ตรวจค่าทางคณิต)";
}
