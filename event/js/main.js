// ฟังก์ชันตรวจสอบการล็อกอิน
function isLoggedIn() {
  return localStorage.getItem('authenticated') === 'true';
}

// ฟังก์ชันล็อกเอาท์
function logout() {
  localStorage.removeItem('authenticated');
  localStorage.removeItem('username');
  updateAuthUI(false);
  window.location.reload();
}

// อัปเดต UI ตามสถานะการล็อกอิน
function updateAuthUI(loggedIn) {
  const uploadLink = document.getElementById('uploadLink');
  const loginLink = document.getElementById('loginLink');
  const logoutLink = document.getElementById('logoutLink');

  if (loggedIn) {
    if (uploadLink) uploadLink.style.display = 'inline-block';
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'inline-block';
  } else {
    if (uploadLink) uploadLink.style.display = 'none';
    if (loginLink) loginLink.style.display = 'inline-block';
    if (logoutLink) logoutLink.style.display = 'none';
  }
}

// ฟังก์ชันแสดงรูปภาพ
function displayImages(images) {
  const gallery = document.getElementById('imageGallery');
  if (!gallery) return;

  gallery.innerHTML = images.length === 0 
    ? '<p class="no-images">ไม่พบรูปภาพ</p>'
    : '';

  const loggedIn = isLoggedIn();
  updateAuthUI(loggedIn);

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
        ${loggedIn ? `
          <div class="image-actions">
            <a href="edit.html?id=${image.id || ''}" class="edit-link">แก้ไข</a>
            <button class="delete-btn" data-id="${image.id}" data-public-id="${image.public_id}">ลบ</button>
          </div>
        ` : ''}
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

  // เพิ่ม Event สำหรับปุ่มลบ (ถ้ามี)
  if (loggedIn) {
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', handleDeleteImage);
    });
  }
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

// ฟังก์ชันจัดการการลบรูปภาพ
async function handleDeleteImage(e) {
  e.stopPropagation();
  const id = e.target.dataset.id;
  const publicId = e.target.dataset.publicId;

  if (confirm('คุณแน่ใจที่จะลบรูปภาพนี้吗?')) {
    try {
      // ลบจาก Cloudinary ก่อน
      if (publicId) {
        const deleteResponse = await fetch(
          `${SCRIPT_URL}?action=deleteCloudinaryImage&publicId=${publicId}`
        );
        await deleteResponse.json();
      }

      // ลบข้อมูลจาก Google Sheets
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'deleteImage',
          id: id
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('ลบรูปภาพสำเร็จ');
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
}

// ฟังก์ชันดึงข้อมูลรูปภาพ
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

// ฟังก์ชันกรองหมวดหมู่
function populateCategories(images) {
  if (!Array.isArray(images)) return;

  const categories = [...new Set(images
    .filter(img => img && img.location)
    .map(img => img.location)
  )];

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
    // โหลดและแสดงรูปภาพ
    const images = await fetchImages();
    displayImages(images);
    populateCategories(images);

    // ตั้งค่าปุ่มล็อกอิน/ล็อกเอาท์
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');

    if (loginLink) {
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'login.html';
      });
    }

    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }

    // กรองหมวดหมู่
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        filterImagesByCategory(e.target.value, images);
      });
    }

    // Lazy loading สำหรับรูปภาพ
    if ('IntersectionObserver' in window) {
      const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
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
  } catch (error) {
    console.error('Initialization error:', error);
    alert('เกิดข้อผิดพลาดในการโหลดหน้า: ' + error.message);
  }
});

// ฟังก์ชันอัปโหลดรูปภาพ (สำหรับหน้า upload.html)
async function uploadImage(imageData) {
  try {
    // อัปโหลดรูปไปยัง Cloudinary ก่อน
    const formData = new FormData();
    formData.append('file', imageData.file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );
    
    const cloudinaryResult = await uploadResponse.json();

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

// ฟังก์ชันอัปเดตรูปภาพ (สำหรับหน้า edit.html)
async function updateImage(imageData) {
  try {
    let imageUrl = imageData.currentImageUrl;
    let publicId = imageData.currentPublicId;

    // หากมีรูปภาพใหม่ให้อัปโหลด
    if (imageData.newFile) {
      const formData = new FormData();
      formData.append('file', imageData.newFile);
      formData.append('upload_preset', cloudinaryConfig.uploadPreset);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      
      const cloudinaryResult = await uploadResponse.json();
      imageUrl = cloudinaryResult.secure_url;
      publicId = cloudinaryResult.public_id;

      // ลบรูปภาพเก่าออก (ถ้ามี)
      if (imageData.currentPublicId) {
        await fetch(
          `${SCRIPT_URL}?action=deleteCloudinaryImage&publicId=${imageData.currentPublicId}`
        );
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
