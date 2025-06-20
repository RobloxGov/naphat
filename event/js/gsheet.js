// ตั้งค่า Cloudinary
const cloudinaryConfig = {
  cloudName: 'dk01phng7', // เปลี่ยนเป็นค่าของคุณ
  uploadPreset: 'uploadNaphatDev', // เปลี่ยนเป็นค่าของคุณ
  apiKey: '386419728339566' // เปลี่ยนเป็นค่าของคุณ
};

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyrvyVtSQZ5P3VGro_W5v34leeWdsFXLK1yVVjfeYlswFZjtrjT8I70JH2L0guXwjgD/exec';

// ฟังก์ชันใหม่สำหรับอัปโหลดไปยัง Cloudinary
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

// ฟังก์ชันใหม่สำหรับลบรูปจาก Cloudinary
async function deleteFromCloudinary(publicId) {
  try {
    // ควรเรียกเซิร์ฟเวอร์เพื่อสร้าง signature
    const response = await fetch(
      `${SCRIPT_URL}?action=deleteImage&publicId=${publicId}`
    );
    return await response.json();
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

// ปรับปรุงฟังก์ชัน uploadImage เดิม
async function uploadImage(imageData) {
  try {
    // อัปโหลดไฟล์ไปยัง Cloudinary ก่อน
    const cloudinaryResponse = await uploadToCloudinary(imageData.file);
    
    // เตรียมข้อมูลสำหรับ Google Sheets
    const sheetData = {
      title: imageData.title,
      description: imageData.description,
      location: imageData.location,
      image_url: cloudinaryResponse.secure_url,
      public_id: cloudinaryResponse.public_id,
      uploadDate: new Date().toISOString()
    };
    
    // บันทึกข้อมูลลง Google Sheets
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'uploadImage',
        ...sheetData
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error: error.message };
  }
}

// ฟังก์ชันดึงข้อมูลรูปภาพ (ไม่ต้องแก้ไขมาก)
async function fetchImages() {
  // ...โค้ดเดิม...
}
