// ต้องแก้ไขส่วนที่เกี่ยวข้องกับการแสดงผลและการจัดการรูปภาพ

// แก้ไขฟังก์ชัน displayImages
function displayImages(images) {
  const gallery = document.getElementById('imageGallery');
  gallery.innerHTML = '';
  
  images.forEach(image => {
    const card = document.createElement('div');
    card.className = 'image-card';
    
    // ใช้ image_url จาก Cloudinary แทน image (base64)
    const imageUrl = image.image_url || `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/w_500/${image.public_id}`;
    
    card.innerHTML = `
      <img src="${imageUrl}" alt="${image.title}" loading="lazy">
      <div class="image-info">
        <h3>${image.title}</h3>
        <p>${image.description}</p>
        <div class="image-meta">
          <span>สถานที่: ${image.location}</span>
          <span>วันที่: ${new Date(image.uploadDate).toLocaleDateString()}</span>
        </div>
        ${isLoggedIn() ? `
          <div class="image-actions">
            <a href="edit.html?id=${image.id}" class="edit-link">แก้ไข</a>
            <button class="delete-btn" data-id="${image.id}" data-public-id="${image.public_id}">ลบ</button>
          </div>
        ` : ''}
      </div>
    `;
    
    gallery.appendChild(card);
  });
  
  // เพิ่ม Event Listener สำหรับปุ่มลบ
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const publicId = btn.dataset.publicId;
      
      if (confirm('คุณแน่ใจที่จะลบรูปภาพนี้吗?')) {
        try {
          // ลบจาก Cloudinary ก่อน
          await deleteFromCloudinary(publicId);
          
          // ลบข้อมูลจาก Google Sheets
          const result = await deleteImage(id);
          
          if (result.success) {
            alert('ลบรูปภาพสำเร็จ');
            // รีเฟรชรายการรูปภาพ
            const images = await fetchImages();
            displayImages(images);
          } else {
            alert('ลบรูปภาพไม่สำเร็จ: ' + (result.error || ''));
          }
        } catch (error) {
          console.error('Delete error:', error);
          alert('เกิดข้อผิดพลาดในการลบ: ' + error.message);
        }
      }
    });
  });
}

// แก้ไขฟังก์ชันสำหรับหน้า Upload
if (document.getElementById('uploadForm')) {
  document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('imageFile');
    if (!fileInput.files[0]) {
      alert('กรุณาเลือกรูปภาพ');
      return;
    }

    const formData = {
      title: document.getElementById('imageTitle').value,
      description: document.getElementById('imageDescription').value,
      location: document.getElementById('imageLocation').value,
      file: fileInput.files[0]
    };

    try {
      const result = await uploadImage(formData);
      
      if (result.success) {
        alert('อัปโหลดรูปภาพสำเร็จ');
        document.getElementById('uploadForm').reset();
        // รีเฟรชรายการรูปภาพ
        const images = await fetchImages();
        displayImages(images);
      } else {
        alert('อัปโหลดไม่สำเร็จ: ' + (result.error || ''));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('เกิดข้อผิดพลาด: ' + error.message);
    }
  });
}

// แก้ไขฟังก์ชันสำหรับหน้า Edit
if (document.getElementById('editForm')) {
  // ...โค้ดเดิม...
  
  // เมื่ออัปโหลดรูปภาพใหม่ในหน้า Edit
  document.getElementById('newImageFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const result = await uploadToCloudinary(file);
      document.getElementById('currentImage').src = result.secure_url;
      // บันทึก public_id ใหม่ชั่วคราว
      document.getElementById('editForm').dataset.newPublicId = result.public_id;
    } catch (error) {
      console.error('Image upload error:', error);
      alert('ไม่สามารถอัปโหลดรูปภาพได้: ' + error.message);
    }
  });
}
