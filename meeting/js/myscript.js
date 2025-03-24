    function formatInput(event) {
      let input = event.target.value;
      let successElement = document.getElementById("success");
      
      // ลบอักขระที่ไม่ใช่ตัวเลข
      input = input.replace(/\D/g, "");

      // ฟอร์แมตตัวเลขตามที่ต้องการ
      let formattedInput = "";
      
      // แบ่งตัวเลขเป็นกลุ่มแล้วแทรก - ตามตำแหน่งที่ต้องการ
      if (input.length > 0) {
        formattedInput += input.slice(0, 1); // ตัวแรก
      }
      if (input.length > 1) {
        formattedInput += "-" + input.slice(1, 5); // หลักที่ 2 ถึง 5
      }
      if (input.length > 5) {
        formattedInput += "-" + input.slice(5, 10); // หลักที่ 6 ถึง 10
      }
      if (input.length > 10) {
        formattedInput += "-" + input.slice(10, 12); // หลักที่ 11 ถึง 12
      }
      if (input.length > 12) {
        formattedInput += "-" + input.slice(12, 13); // หลักที่ 13
      }

      // อัพเดตค่าใน input
      event.target.value = formattedInput;

      // ตรวจสอบจำนวนหลัก และแสดงข้อความใน success div
      if (input.length === 13) {
        successElement.textContent = "(ถูกต้อง)";
        successElement.style.color = "#0b9c23";  // สีเขียว
      } else {
        successElement.textContent = "(ไม่ถูกต้อง)";
        successElement.style.color = "#ea0c42";  // สีแดง
      }
    }
