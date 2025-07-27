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
let funcType = randChoice(['ไซน์', 'โคไซน์']);
let A = randInt(1, 5);
let D = randInt(-3, 3);
let period = randInt(2, 6);
let B = (2 * Math.PI) / period;
let C = randInt(-3, 3);

let yMax = A + D;
let yMin = -A + D;
let yIntercept = funcType === 'ไซน์'
    ? A * Math.sin(-C) + D
    : A * Math.cos(-C) + D;
yIntercept = Math.round(yIntercept);

let startShape = randChoice([
    'ลดลงแบบเว้าขึ้น',
    'เพิ่มขึ้นแบบเว้าขึ้น',
    'ลดลงแบบเว้าลง',
    'เพิ่มขึ้นแบบเว้าลง'
]);

let trigQuestion = `จงหาฟังก์ชันรูป${funcType}ที่มีค่าเฉลี่ยเป็น ${D}, ค่าสูงสุดคือ ${yMax}, ค่าต่ำสุดคือ ${yMin}, จุดตัดแกนตั้งอยู่ที่ ${yIntercept}, เริ่มต้นด้วยค่าที่ ${startShape}, มีคาบยาวประมาณ ${period}, แกนนอนคือ x แกนตั้งคือ y`;
document.getElementById("trig-question").innerText = trigQuestion;

// ---------- สร้างโจทย์ควอดราติก ----------
let points = [
    [randInt(-5, 5), randInt(-5, 15)],
    [randInt(-5, 5), randInt(-5, 15)],
    [randInt(-5, 5), randInt(-5, 15)]
];
let quadQuestion = `จงหาสมการควอดราติกที่ผ่านจุด (${points[0]}), (${points[1]}), (${points[2]})`;
document.getElementById("quad-question").innerText = quadQuestion;

// ---------- เรียกใช้แปลง pi ใน input ----------
replacePi("trig-answer");
replacePi("quad-answer");

// ---------- log เฉลยลง console ----------
let trigFuncText = funcType === 'ไซน์'
    ? `y = ${A}sin(${B.toFixed(2)}x + ${C}) + ${D}`
    : `y = ${A}cos(${B.toFixed(2)}x + ${C}) + ${D}`;

console.log("🔍 เฉลยฟังก์ชันตรีโกณ:", trigFuncText);
console.log("🔍 จุดควอดราติก:", points);
