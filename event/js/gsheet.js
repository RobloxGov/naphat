// gsheet.js

// ตั้งค่า Cloudinary
const cloudinaryConfig = {
  cloudName: 'dk01phng7', // เปลี่ยนเป็นค่าของคุณ
  uploadPreset: 'uploadNaphatDev', // เปลี่ยนเป็นค่าของคุณ
  apiKey: '386419728339566' // เปลี่ยนเป็นค่าของคุณ
};

// ตั้งค่า Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxwnDU8HV7D4JtZF3Fee-laSwZ6leY3MUnuLbmUsgp0hpnWSwbuhNa24_7boioxlqev/exec';

// ฟังก์ชันอัปโหลดรูปภาพไปยัง Cloudinary
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

// ฟังก์ชันลบรูปภาพจาก Cloudinary
async function deleteFromCloudinary(publicId) {
  try {
    // เรียกไปยัง Google Apps Script เพื่อสร้าง signature
    const response = await fetch(
      `${SCRIPT_URL}?action=deleteImage&publicId=${publicId}`
    );
    return await response.json();
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

// ฟังก์ชันดึงข้อมูลรูปภาพทั้งหมด
async function fetchImages() {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getImages`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

// ฟังก์ชันอัปโหลดข้อมูลรูปภาพ
async function uploadImage(imageData) {
  try {
    // อัปโหลดรูปไปยัง Cloudinary ก่อน
    const cloudinaryResult = await uploadToCloudinary(imageData.file);
    
    // เตรียมข้อมูลสำหรับ Google Sheets
    const sheetData = {
      title: imageData.title,
      description: imageData.description,
      location: imageData.location,
      image_url: cloudinaryResult.secure_url,
      public_id: cloudinaryResult.public_id,
      uploadDate: new Date().toISOString(),
      uploadBy: localStorage.getItem('username') || 'anonymous'
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

// ฟังก์ชันลบรูปภาพ
async function deleteImage(imageId, publicId) {
  try {
    // ลบจาก Cloudinary ก่อน
    await deleteFromCloudinary(publicId);
    
    // ลบข้อมูลจาก Google Sheets
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'deleteImage',
        id: imageId
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: error.message };
  }
}

// ฟังก์ชันอัปเดตรูปภาพ
async function updateImage(imageData) {
  try {
    let imageUrl = imageData.currentImageUrl;
    let publicId = imageData.currentPublicId;
    
    // หากมีรูปภาพใหม่ให้อัปโหลด
    if (imageData.newFile) {
      const cloudinaryResult = await uploadToCloudinary(imageData.newFile);
      imageUrl = cloudinaryResult.secure_url;
      publicId = cloudinaryResult.public_id;
      
      // ลบรูปภาพเก่าออก (ถ้ามี)
      if (imageData.currentPublicId) {
        await deleteFromCloudinary(imageData.currentPublicId);
      }
    }
    
    // เตรียมข้อมูลสำหรับอัปเดต
    const updateData = {
      id: imageData.id,
      title: imageData.title,
      description: imageData.description,
      location: imageData.location,
      image_url: imageUrl,
      public_id: publicId
    };
    
    // อัปเดตข้อมูลใน Google Sheets
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'updateImage',
        ...updateData
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Update error:', error);
    return { success: false, error: error.message };
  }
}
