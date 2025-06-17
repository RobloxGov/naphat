const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxwnDU8HV7D4JtZF3Fee-laSwZ6leY3MUnuLbmUsgp0hpnWSwbuhNa24_7boioxlqev/exec';

// ฟังก์ชันตรวจสอบการล็อกอิน
function isLoggedIn() {
  return localStorage.getItem('authenticated') === 'true';
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load images for gallery page
    if (document.getElementById('imageGallery')) {
      const images = await fetchImages();
      console.log('Fetched images:', images); // Debug log
      
      displayImages(images);
      populateCategories(images);
      
      // Filter by category
      document.getElementById('categoryFilter').addEventListener('change', (e) => {
        const category = e.target.value;
        filterImagesByCategory(category, images);
      });
    }
    
    // Handle image upload
    if (document.getElementById('uploadForm')) {
      document.getElementById('uploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fileInput = document.getElementById('imageFile');
        const file = fileInput.files[0];
        
        if (file) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const imageData = {
              title: document.getElementById('imageTitle').value,
              description: document.getElementById('imageDescription').value,
              location: document.getElementById('imageLocation').value,
              image: event.target.result,
              uploadDate: new Date().toISOString(),
              uploadBy: localStorage.getItem('username') || 'anonymous'
            };
            
            const result = await uploadImage(imageData);
            
            if (result.success) {
              alert('อัปโหลดรูปภาพสำเร็จ');
              document.getElementById('uploadForm').reset();
              // รีเฟรชรายการรูปภาพ
              const images = await fetchImages();
              displayImages(images);
              populateCategories(images);
            } else {
              alert('เกิดข้อผิดพลาดในการอัปโหลด: ' + (result.error || ''));
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  } catch (error) {
    console.error('Initialization error:', error);
    alert('เกิดข้อผิดพลาดในการโหลดหน้า: ' + error.message);
  }
});

async function fetchImages() {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getImages`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error("Response is not JSON");
    }
    
    const data = await response.json();
    
    // ตรวจสอบและแปลงข้อมูลให้เป็น Array
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'object') return [data]; // ถ้าได้ object เดียวให้แปลงเป็น Array
    return []; // กรณีอื่นๆ
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

function displayImages(images) {
  const gallery = document.getElementById('imageGallery');
  if (!gallery) return;
  
  // ตรวจสอบและเตรียมข้อมูล images
  if (!images) images = [];
  if (!Array.isArray(images)) {
    console.warn('Expected array for images, got:', typeof images, images);
    images = [];
  }
  
  gallery.innerHTML = images.length === 0 
    ? '<p class="no-images">ไม่พบรูปภาพ</p>'
    : '';
  
  images.forEach(image => {
    if (!image) return;
    
    const card = document.createElement('div');
    card.className = 'image-card';
    
    card.innerHTML = `
      <img src="${image.image || ''}" alt="${image.title || 'ไม่มีชื่อ'}">
      <div class="image-info">
        <h3>${image.title || 'ไม่มีชื่อ'}</h3>
        <p>${image.description || ''}</p>
        <div class="image-meta">
          <span>สถานที่: ${image.location || 'ไม่ระบุ'}</span>
          <span>วันที่: ${image.uploadDate ? new Date(image.uploadDate).toLocaleDateString() : 'ไม่ระบุ'}</span>
        </div>
        ${isLoggedIn() ? `<a href="edit.html?id=${image.id || ''}" class="edit-link">แก้ไข</a>` : ''}
      </div>
    `;
    
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        showImagePopup(image);
      }
    });
    
    gallery.appendChild(card);
  });
}

function populateCategories(images) {
  if (!Array.isArray(images)) return;
  
  // สร้างรายการ category ที่ไม่ซ้ำกัน
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

function filterImagesByCategory(category, allImages) {
  if (!Array.isArray(allImages)) return;
  
  const filtered = category 
    ? allImages.filter(img => img && img.location === category)
    : allImages;
  
  displayImages(filtered);
}

async function uploadImage(imageData) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'uploadImage',
        ...imageData
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
  }
}
