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

function displayImages(images) {
  const gallery = document.getElementById('imageGallery');
  gallery.innerHTML = '';
  
  images.forEach(image => {
    const card = document.createElement('div');
    card.className = 'image-card';
    
    card.innerHTML = `
      <img src="${image.image}" alt="${image.title}">
      <div class="image-info">
        <h3>${image.title}</h3>
        <p>${image.description}</p>
        <div class="image-meta d-flex flex-col">
          <span>สถานที่: ${image.location}</span>
          <span>วันที่: ${new Date(image.uploadDate).toLocaleDateString()}</span>
        </div>
        ${window.location.pathname.includes('index.html') ? 
          `<a href="edit.html?id=${image.id}">แก้ไข</a>` : ''}
      </div>
    `;
    
    gallery.appendChild(card);
  });
}

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
  gallery.innerHTML = '';
  
  images.forEach(image => {
    const card = document.createElement('div');
    card.className = 'image-card';
    
    card.innerHTML = `
      <img src="${image.image}" alt="${image.title}">
      <div class="image-info">
        <h3>${image.title}</h3>
        <p>${image.description}</p>
        <div class="image-meta">
          <span>สถานที่: ${image.location}</span>
          <span>วันที่: ${new Date(image.uploadDate).toLocaleDateString()}</span>
        </div>
        ${window.location.pathname.includes('index.html') ? 
          `<a href="edit.html?id=${image.id}">แก้ไข</a>` : ''}
      </div>
    `;
    
    // Add click event to show popup
    card.addEventListener('click', (e) => {
      // Prevent triggering when clicking on edit link
      if (!e.target.closest('a')) {
        showImagePopup(image);
      }
    });
    
    gallery.appendChild(card);
  });
}
