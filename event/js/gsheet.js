// gsheet.js

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyrvyVtSQZ5P3VGro_W5v34leeWdsFXLK1yVVjfeYlswFZjtrjT8I70JH2L0guXwjgD/exec';

// อัปโหลดรูปภาพไปยัง Cloudinary
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );
    return await response.json();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

// ลบรูปภาพจาก Cloudinary
async function deleteFromCloudinary(publicId) {
  try {
    const response = await fetch(
      `${SCRIPT_URL}?action=generateSignature&publicId=${publicId}`
    );
    const { signature, timestamp } = await response.json();
    
    const deleteResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_id: publicId,
          signature,
          timestamp,
          api_key: cloudinaryConfig.apiKey
        })
      }
    );
    return await deleteResponse.json();
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

// ดึงข้อมูลรูปภาพทั้งหมด
async function fetchImages() {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getImages`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

// บันทึกข้อมูลรูปภาพ
async function saveImageData(imageData) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        action: 'uploadImage',
        ...imageData
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Save error:', error);
    return { success: false, error: error.message };
  }
}

// ลบรูปภาพ
async function deleteImage(imageId, publicId) {
  try {
    await deleteFromCloudinary(publicId);
    
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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

// อัปเดตรูปภาพ
async function updateImage(imageData) {
  try {
    let imageUrl = imageData.currentImageUrl;
    let publicId = imageData.currentPublicId;
    
    if (imageData.newFile) {
      const cloudinaryResult = await uploadToCloudinary(imageData.newFile);
      imageUrl = cloudinaryResult.secure_url;
      publicId = cloudinaryResult.public_id;
      
      if (imageData.currentPublicId) {
        await deleteFromCloudinary(imageData.currentPublicId);
      }
    }
    
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        action: 'updateImage',
        id: imageData.id,
        title: imageData.title,
        description: imageData.description,
        location: imageData.location,
        image_url: imageUrl,
        public_id: publicId
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Update error:', error);
    return { success: false, error: error.message };
  }
}
