// ไม่ต้องแก้ไขหลัก แต่สามารถเพิ่มฟังก์ชันตรวจสอบ Cloudinary Upload Preset ได้
async function checkCloudinaryConfig() {
  if (!window.cloudinaryConfig) {
    console.error('Cloudinary config is missing');
    return false;
  }
  return true;
}

// ตัวอย่างการเรียกใช้ในฟังก์ชัน login
async function login(username, password) {
  // ...โค้ดเดิม...
  
  if (user) {
    // ตรวจสอบการตั้งค่า Cloudinary ด้วย
    const cloudinaryReady = await checkCloudinaryConfig();
    if (!cloudinaryReady) {
      alert('ระบบอัปโหลดรูปภาพยังไม่พร้อมใช้งาน');
      return false;
    }
    
    localStorage.setItem('authenticated', 'true');
    return true;
  }
  // ...โค้ดเดิม...
}
