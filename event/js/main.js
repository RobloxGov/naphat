// main.js

// ฟังก์ชันแสดงรูปภาพ
function displayImages(images) {
  const gallery = document.getElementById('imageGallery');
  if (!gallery) return;
  
  gallery.innerHTML = images.length === 0 
    ? '<p class="no-images">ไม่พบรูปภาพ</p>'
    : '';
  
  images.forEach(image => {
    if (!image) return;
    
    const card = document.createElement('div');
    card.className = 'image-card';
    
    // สร้าง URL รูปภาพด้วย Cloudinary Transformation
    const imageUrl = image.image_url || 
      `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/w_600,h_400,c_fill/${image.public_id}`;
    
    card.innerHTML = `
      <img src="${imageUrl}" alt="${image.title || 'ไม่มีชื่อ'}" loading="lazy">
      <div class="image-info">
        <h3>${image.title || 'ไม่มีชื่อ'}</h3>
        <p>${image.description || ''}</p>
        <div class="image-meta">
          <span>สถานที่: ${image.location || 'ไม่ระบุ'}</span>
          <span>วันที่: ${image.uploadDate ? new Date(image.uploadDate).toLocaleDateString() : 'ไม่ระบุ'}</span>
        </div>
        ${isLoggedIn() ? `
          <div class="image-actions">
            <a href="edit.html?id=${image.id || ''}" class="edit-link">แก้ไข</a>
            <button class="delete-btn" data-id="${image.id}" data-public-id="${image.public_id}">ลบ</button>
          </div>
      </div>
    `;
    
    // Event สำหรับแสดง Popup
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a') && !e.target.closest('button')) {
        showImagePopup(image);
      }
    });
    
    gallery.appendChild(card);
  });
  
  // เพิ่ม Event สำหรับปุ่มลบ
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const publicId = btn.dataset.publicId;
      
      if (confirm('คุณแน่ใจที่จะลบรูปภาพนี้吗?')) {
        const result = await deleteImage(id, publicId);
        if (result.success) {
          alert('ลบรูปภาพสำเร็จ');
          const images = await fetchImages();
          displayImages(images);
        } else {
          alert('ลบรูปภาพไม่สำเร็จ: ' + (result.error || ''));
        }
      }
    });
  });
}

// ฟังก์ชันแสดง Popup
function showImagePopup(imageData) {
  const popup = document.getElementById('imagePopup');
  const popupImg = document.getElementById('popupImage');
  const popupTitle = document.getElementById('popupTitle');
  const popupDesc = document.getElementById('popupDescription');
  const popupLoc = document.getElementById('popupLocation');
  const popupDate = document.getElementById('popupDate');
  
  // สร้าง URL รูปภาพขนาดเต็ม
  const imageUrl = imageData.image_url || 
    `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${imageData.public_id}`;
  
  popupImg.src = imageUrl;
  popupImg.alt = imageData.title || '';
  popupTitle.textContent = imageData.title || 'ไม่มีชื่อ';
  popupDesc.textContent = imageData.description || '';
  popupLoc.textContent = `สถานที่: ${imageData.location || 'ไม่ระบุ'}`;
  popupDate.textContent = `วันที่: ${imageData.uploadDate ? new Date(imageData.uploadDate).toLocaleDateString() : 'ไม่ระบุ'}`;
  
  popup.style.display = 'block';
  
  // ปุ่มปิด Popup
  document.querySelector('.close-btn').onclick = () => {
    popup.style.display = 'none';
  };
  
  // คลิกนอก Popup เพื่อปิด
  popup.onclick = (e) => {
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  };
}

// ฟังก์ชันกรองหมวดหมู่
function populateCategories(images) {
  if (!Array.isArray(images)) return;
  
  const categories = [...new Set(images
    .filter(img => img && img.location)
    .map(img => img.location)
  )];
  
  // สำหรับ dropdown กรอง
  const filterSelect = document.getElementById('categoryFilter');
  if (filterSelect) {
    filterSelect.innerHTML = '<option value="">ทั้งหมด</option>';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      filterSelect.appendChild(option);
    });
  }
  
  // สำหรับ datalist ในฟอร์ม
  const datalists = [
    document.getElementById('locations'),
    document.getElementById('editLocations')
  ].filter(Boolean);
  
  datalists.forEach(datalist => {
    datalist.innerHTML = '';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      datalist.appendChild(option);
    });
  });
}

// ฟังก์ชันกรองรูปภาพตามหมวดหมู่
function filterImagesByCategory(category, allImages) {
  if (!Array.isArray(allImages)) return;
  
  const filtered = category 
    ? allImages.filter(img => img && img.location === category)
    : allImages;
  
  displayImages(filtered);
}

// เมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // สำหรับหน้า Gallery
    if (document.getElementById('imageGallery')) {
      const images = await fetchImages();
      displayImages(images);
      populateCategories(images);
      
      document.getElementById('categoryFilter').addEventListener('change', (e) => {
        filterImagesByCategory(e.target.value, images);
      });
    }
    
    // สำหรับหน้า Upload
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
        
        const result = await uploadImage(formData);
        if (result.success) {
          alert('อัปโหลดรูปภาพสำเร็จ');
          document.getElementById('uploadForm').reset();
          // รีเฟรชหน้าหากอยู่ในหน้า Gallery
          if (document.getElementById('imageGallery')) {
            const images = await fetchImages();
            displayImages(images);
            populateCategories(images);
          }
        } else {
          alert('อัปโหลดไม่สำเร็จ: ' + (result.error || ''));
        }
      });
    }
    
    // สำหรับหน้า Edit
    if (document.getElementById('editForm')) {
      // โหลดข้อมูลรูปภาพที่จะแก้ไข
      const imageId = new URLSearchParams(window.location.search).get('id');
      if (imageId) {
        const response = await fetch(`${SCRIPT_URL}?action=getImage&id=${imageId}`);
        if (response.ok) {
          const imageData = await response.json();
          
          document.getElementById('imageId').value = imageData.id;
          document.getElementById('editImageTitle').value = imageData.title;
          document.getElementById('editImageDescription').value = imageData.description;
          document.getElementById('editImageLocation').value = imageData.location;
          document.getElementById('currentImage').src = imageData.image_url;
          document.getElementById('editForm').dataset.publicId = imageData.public_id;
        }
      }
      
      // เมื่อเลือกไฟล์ใหม่
      document.getElementById('newImageFile').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
          const result = await uploadToCloudinary(file);
          document.getElementById('currentImage').src = result.secure_url;
          document.getElementById('editForm').dataset.newPublicId = result.public_id;
        } catch (error) {
          console.error('Image upload error:', error);
          alert('ไม่สามารถอัปโหลดรูปภาพได้: ' + error.message);
        }
      });
      
      // เมื่อส่งฟอร์มแก้ไข
      document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
          id: document.getElementById('imageId').value,
          title: document.getElementById('editImageTitle').value,
          description: document.getElementById('editImageDescription').value,
          location: document.getElementById('editImageLocation').value,
          currentImageUrl: document.getElementById('currentImage').src,
          currentPublicId: document.getElementById('editForm').dataset.publicId,
          newFile: document.getElementById('newImageFile').files[0] || null
        };
        
        const result = await updateImage(formData);
        if (result.success) {
          alert('บันทึกการเปลี่ยนแปลงสำเร็จ');
          window.location.href = 'index.html';
        } else {
          alert('บันทึกไม่สำเร็จ: ' + (result.error || ''));
        }
      });
      
      // ปุ่มลบ
      document.getElementById('deleteBtn').addEventListener('click', async (e) => {
        if (confirm('คุณแน่ใจที่จะลบรูปภาพนี้吗?')) {
          const imageId = document.getElementById('imageId').value;
          const publicId = document.getElementById('editForm').dataset.publicId;
          
          const result = await deleteImage(imageId, publicId);
          if (result.success) {
            alert('ลบรูปภาพสำเร็จ');
            window.location.href = 'index.html';
          } else {
            alert('ลบไม่สำเร็จ: ' + (result.error || ''));
          }
        }
      });
    }
  } catch (error) {
    console.error('Initialization error:', error);
    alert('เกิดข้อผิดพลาดในการโหลดหน้า: ' + error.message);
  }
});

// Lazy loading สำหรับรูปภาพ
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
  
  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src || lazyImage.src;
          lazyImage.classList.add('loaded');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });
    
    lazyImages.forEach((lazyImage) => {
      lazyImageObserver.observe(lazyImage);
    });
  }
});
