document.addEventListener('DOMContentLoaded', async () => {
  // Load images for gallery page
  if (document.getElementById('imageGallery')) {
    const images = await fetchImages();
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
            uploadDate: new Date().toISOString()
          };
          
          const result = await uploadImage(imageData);
          
          if (result.success) {
            alert('อัปโหลดรูปภาพสำเร็จ');
            document.getElementById('uploadForm').reset();
          } else {
            alert('เกิดข้อผิดพลาดในการอัปโหลด');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  // Similar handlers for edit page
});

function populateCategories(images) {
  const categories = [...new Set(images.map(img => img.location))];
  const filterSelect = document.getElementById('categoryFilter') || 
                      document.getElementById('editImageLocation').previousElementSibling;
  
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    filterSelect.appendChild(option);
  });
  
  // For datalist in upload/edit forms
  const datalist = document.getElementById('locations') || 
                   document.getElementById('editLocations');
  if (datalist) {
    datalist.innerHTML = '';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      datalist.appendChild(option);
    });
  }
}

function filterImagesByCategory(category, allImages) {
  const filtered = category ? 
    allImages.filter(img => img.location === category) : 
    allImages;
  displayImages(filtered);
}

// Function to display image in popup
function showImagePopup(imageData) {
  const popup = document.getElementById('imagePopup');
  const popupImg = document.getElementById('popupImage');
  const popupTitle = document.getElementById('popupTitle');
  const popupDesc = document.getElementById('popupDescription');
  const popupLoc = document.getElementById('popupLocation');
  const popupDate = document.getElementById('popupDate');
  
  // Set popup content
  popupImg.src = imageData.image;
  popupImg.alt = imageData.title;
  popupTitle.textContent = imageData.title;
  popupDesc.textContent = imageData.description;
  popupLoc.textContent = `สถานที่: ${imageData.location}`;
  popupDate.textContent = `วันที่: ${new Date(imageData.uploadDate).toLocaleDateString()}`;
  
  // Show popup
  popup.style.display = 'block';
  
  // Close popup when clicking X
  document.querySelector('.close-btn').onclick = function() {
    popup.style.display = 'none';
  };
  
  // Close popup when clicking outside
  popup.onclick = function(event) {
    if (event.target === popup) {
      popup.style.display = 'none';
    }
  };
}

// Modify displayImages function to add click event
function displayImages(images) {
  const gallery = document.getElementById('imageGallery');
  
  // ตรวจสอบว่า images เป็น Array
  if (!Array.isArray(images)) {
    console.error('displayImages: images is not an array', images);
    gallery.innerHTML = '<p>ไม่สามารถโหลดรูปภาพได้</p>';
    return;
  }
  
  // ถ้าไม่มีรูปภาพ
  if (images.length === 0) {
    gallery.innerHTML = '<p>ไม่พบรูปภาพ</p>';
    return;
  }
  
  gallery.innerHTML = '';
  
  images.forEach(image => {
    const card = document.createElement('div');
    card.className = 'image-card';
    
    // ตรวจสอบว่ามีข้อมูลครบถ้วน
    if (!image.image || !image.title) {
      console.warn('Invalid image data:', image);
      return; // ข้ามรูปภาพที่ไม่สมบูรณ์
    }
    
    card.innerHTML = `
      <img src="${image.image}" alt="${image.title}">
      <div class="image-info">
        <h3>${image.title}</h3>
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

async function fetchImages() {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getImages`);
    
    // ตรวจสอบว่าการร้องขอสำเร็จ
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // ตรวจสอบว่าเป็น JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error("Response is not JSON");
    }
    
    const data = await response.json();
    
    // ตรวจสอบว่า data เป็น Array
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', data);
      return []; // ส่งคืน array ว่างหากข้อมูลไม่ถูกต้อง
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    return []; // ส่งคืน array ว่างหากเกิด error
  }
}

