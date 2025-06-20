// แสดงผลรูปภาพ
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
            <a href="edit.html?id=${image.id}" class="edit-link">แก้ไข</a>
            <button class="delete-btn" data-id="${image.id}" data-public-id="${image.public_id}">ลบ</button>
          </div>
        ` : ''}
      </div>
    `;
    
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a') && !e.target.closest('button')) {
        showImagePopup(image);
      }
    });
    
    gallery.appendChild(card);
  });
  
  // จัดการปุ่มลบ
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (confirm('คุณแน่ใจที่จะลบรูปภาพนี้吗?')) {
        const result = await deleteImage(btn.dataset.id, btn.dataset.publicId);
        if (result.success) {
          const images = await fetchImages();
          displayImages(images);
        }
      }
    });
  });
}

// แสดง Popup รูปภาพ
function showImagePopup(image) {
  const popup = document.getElementById('imagePopup');
  if (!popup) return;
  
  const imageUrl = image.image_url || 
    `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${image.public_id}`;
  
  document.getElementById('popupImage').src = imageUrl;
  document.getElementById('popupTitle').textContent = image.title || 'ไม่มีชื่อ';
  document.getElementById('popupDescription').textContent = image.description || '';
  document.getElementById('popupLocation').textContent = `สถานที่: ${image.location || 'ไม่ระบุ'}`;
  document.getElementById('popupDate').textContent = `วันที่: ${image.uploadDate ? new Date(image.uploadDate).toLocaleDateString() : 'ไม่ระบุ'}`;
  
  popup.style.display = 'block';
  
  document.querySelector('.close-btn').onclick = () => {
    popup.style.display = 'none';
  };
  
  popup.onclick = (e) => {
    if (e.target === popup) popup.style.display = 'none';
  };
}

// กรองหมวดหมู่
function populateCategories(images) {
  if (!Array.isArray(images)) return;
  
  const categories = [...new Set(images.map(img => img.location).filter(Boolean)];
  const elements = [
    document.getElementById('categoryFilter'),
    document.getElementById('locations'),
    document.getElementById('editLocations')
  ].filter(Boolean);
  
  elements.forEach(el => {
    el.innerHTML = el.id === 'categoryFilter' 
      ? '<option value="">ทั้งหมด</option>'
      : '';
      
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      el.appendChild(option);
    });
  });
}

// กรองรูปภาพ
function filterImagesByCategory(category, images) {
  if (!Array.isArray(images)) return;
  
  const filtered = category 
    ? images.filter(img => img.location === category)
    : images;
  
  displayImages(filtered);
}

// เริ่มต้นระบบ
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // หน้า Gallery
    if (document.getElementById('imageGallery')) {
      const images = await fetchImages();
      displayImages(images);
      populateCategories(images);
      
      document.getElementById('categoryFilter').addEventListener('change', (e) => {
        filterImagesByCategory(e.target.value, images);
      });
    }
    
    // หน้า Upload
    if (document.getElementById('uploadForm')) {
      document.getElementById('uploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = document.getElementById('imageFile').files[0];
        if (!file) return alert('กรุณาเลือกรูปภาพ');
        
        try {
          const result = await uploadToCloudinary(file);
          const saveResult = await saveImageData({
            title: document.getElementById('imageTitle').value,
            description: document.getElementById('imageDescription').value,
            location: document.getElementById('imageLocation').value,
            image_url: result.secure_url,
            public_id: result.public_id,
            uploadDate: new Date().toISOString()
          });
          
          if (saveResult.success) {
            alert('อัปโหลดสำเร็จ');
            document.getElementById('uploadForm').reset();
          }
        } catch (error) {
          alert('อัปโหลดไม่สำเร็จ: ' + error.message);
        }
      });
    }
    
    // หน้า Edit
    if (document.getElementById('editForm')) {
      const imageId = new URLSearchParams(window.location.search).get('id');
      if (imageId) {
        const response = await fetch(`${SCRIPT_URL}?action=getImage&id=${imageId}`);
        if (response.ok) {
          const image = await response.json();
          document.getElementById('imageId').value = image.id;
          document.getElementById('editImageTitle').value = image.title;
          document.getElementById('editImageDescription').value = image.description;
          document.getElementById('editImageLocation').value = image.location;
          document.getElementById('currentImage').src = image.image_url;
          document.getElementById('editForm').dataset.publicId = image.public_id;
        }
      }
      
      document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const result = await updateImage({
          id: form.imageId.value,
          title: form.editImageTitle.value,
          description: form.editImageDescription.value,
          location: form.editImageLocation.value,
          currentImageUrl: document.getElementById('currentImage').src,
          currentPublicId: form.dataset.publicId,
          newFile: form.newImageFile.files[0]
        });
        
        if (result.success) window.location.href = 'index.html';
      });
    }
    
    // Lazy Loading
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        observer.observe(img);
      });
    }
  } catch (error) {
    console.error('Initialization error:', error);
  }
});
