
    function formatInput(event) {
      let input = event.target.value;
      
      // ลบอักขระที่ไม่ใช่ตัวเลข
      input = input.replace(/\D/g, "");

      // เพิ่ม "-" ตามรูปแบบ
      let formattedInput = input.replace(/^(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})$/, "$1-$2-$3-$4-$5");

      // อัพเดตค่าใน input
      event.target.value = formattedInput;
    }
