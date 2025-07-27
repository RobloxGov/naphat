// ---------- ฟังก์ชันสุ่ม ----------
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ---------- ฟังก์ชันแปลง pi เป็น π ----------
function replacePi(inputId) {
    const input = document.getElementById(inputId);
    input.addEventListener('input', () => {
        input.value = input.value.replace(/\bpi\b/gi, "π");
    });
}

// ---------- สร้างโจทย์ฟังก์ชันตรีโกณ ----------
let funcLabel = randChoice(['ไซน์', 'โคไซน์']);
let funcType = funcLabel === 'ไซน์' ? 'sin' : 'cos';
let A = randInt(1, 5);
let D = randInt(-3, 3);
let period = randInt(2, 6);
let B = (2 * Math.PI) / period;
let C = randInt(-3, 3);

let yMax = A + D;
let yMin = -A + D;
let yIntercept = funcType === 'sin'
    ? A * Math.sin(-C) + D
    : A * Math.cos(-C) + D;
yIntercept = Math.round(yIntercept);

// ---------- คัดกรอง startShape ให้ถูกต้อง ----------
let validShapes;
if (funcType === 'sin') {
    // sin(x) เริ่มที่กลาง → เพิ่มแบบเว้าลง หรือ ลดแบบเว้าขึ้น
    validShapes = ['เพิ่มขึ้นแบบเว้าลง', 'ลดลงแบบเว้าขึ้น'];
} else {
    // cos(x) เริ่มที่สูงสุด → ลดแบบเว้าลง, ต่ำสุด → เพิ่มเว้าขึ้น
    let startY = A * Math.cos(C) + D;
    if (startY > D) {
        validShapes = ['ลดลงแบบเว้าลง'];
    } else if (startY < D) {
        validShapes = ['เพิ่มขึ้นแบบเว้าขึ้น'];
    } else {
        validShapes = ['เพิ่มขึ้นแบบเว้าลง', 'ลดลงแบบเว้าขึ้น']; // กลางกราฟ
    }
}

let startShape = randChoice(validShapes);

let trigQuestion = `จงหาฟังก์ชันรูป${funcLabel} ที่มีค่าเฉลี่ยเป็น ${D}, ค่าสูงสุดคือ ${yMax}, ค่าต่ำสุดคือ ${yMin}, จุดตัดแกนตั้งอยู่ที่ ${yIntercept}, เริ่มต้นด้วยค่าที่ ${startShape}, มีคาบยาวประมาณ ${period}, แกนนอนคือ x แกนตั้งคือ y`;
document.getElementById("trig-question").innerText = trigQuestion;

// ---------- ตรวจคำตอบฟังก์ชันตรีโกณ ----------
function checkTrig() {
    let ans = document.getElementById("trig-answer").value.trim().toLowerCase();
    ans = ans.replace(/\s+/g, '');

    if (!ans.startsWith("y=")) {
        document.getElementById("trig-result").innerText = "❌ คำตอบควรขึ้นต้นด้วย y =";
        return;
    }
    if (!ans.includes(funcType)) {
        document.getElementById("trig-result").innerText = `❌ ควรใช้ฟังก์ชัน ${funcType} ในสมการ`;
        return;
    }

    document.getElementById("trig-result").innerText = "✅ ตรวจเบื้องต้นผ่าน (ไม่ตรวจตัวเลขละเอียด)";

    // log เฉลย
    let trigFuncText = `y = ${A}${funcType}(${B.toFixed(2)}x + ${C}) + ${D}`;
    console.log("📌 เฉลยฟังก์ชันตรีโกณ:", trigFuncText);
}

// ---------- สร้างโจทย์ควอดราติก ----------
let points = [
    [randInt(-5, 5), randInt(-5, 15)],
    [randInt(-5, 5), randInt(-5, 15)],
    [randInt(-5, 5), randInt(-5, 15)]
];
let quadQuestion = `จงหาสมการควอดราติกที่ผ่านจุด (${points[0]}), (${points[1]}), (${points[2]})`;
document.getElementById("quad-question").innerText = quadQuestion;

// ---------- ตรวจคำตอบควอดราติก ----------
function checkQuad() {
    let ans = document.getElementById("quad-answer").value.trim().toLowerCase();
    if (!ans.includes("x")) {
        document.getElementById("quad-result").innerText = "❌ คำตอบควรมีตัวแปร x";
        return;
    }
    document.getElementById("quad-result").innerText = "✅ ตรวจเบื้องต้นผ่าน (ยังไม่ตรวจค่าจริง)";
    console.log("📌 จุดควอดราติก:", points);
}

// ---------- เรียกใช้แปลง pi ใน input ----------
replacePi("trig-answer");
replacePi("quad-answer");
