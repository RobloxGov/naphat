let map;
let markers = [];

// Initialize map
function initMap() {
  map = L.map('map').setView([13.7563, 100.5018], 10); // ตั่งค่าจุดเริ่มต้นที่กรุงเทพ
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  loadPlaces();
}

// Load places from Firestore
function loadPlaces() {
  db.collection('places')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      clearMarkers();
      
      snapshot.forEach(doc => {
        const place = doc.data();
        const position = place.location;
        
        const marker = L.marker([position.latitude, position.longitude], {
          icon: L.divIcon({
            className: 'place-marker',
            html: `<div style="background-color: #4285F4; color: white; padding: 5px; border-radius: 50%;">${place.imageCount}</div>`,
            iconSize: [30, 30]
          })
        }).addTo(map);
        
        marker.on('click', () => showPlaceDetails(doc.id, place));
        markers.push({ id: doc.id, marker, place });
      });
    });
}

function clearMarkers() {
  markers.forEach(m => m.marker.remove());
  markers = [];
}

function showPlaceDetails(docId, place) {
  const details = document.getElementById('placeDetails');
  const detailName = document.getElementById('detailName');
  const detailAddress = document.getElementById('detailAddress');
  const detailDate = document.getElementById('detailDate');
  const detailDescription = document.getElementById('detailDescription');
  const detailImages = document.getElementById('detailImages');
  
  detailName.textContent = place.name;
  detailAddress.textContent = place.address;
  detailDate.textContent = `${place.date} ${place.time}`;
  detailDescription.textContent = place.description || '-';
  
  // Clear previous images
  detailImages.innerHTML = '';
  
  // Load images
  if (place.imageUrls && place.imageUrls.length > 0) {
    place.imageUrls.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.onclick = () => window.open(url, '_blank');
      detailImages.appendChild(img);
    });
  } else {
    // Fallback: Load images from Storage if URLs not in Firestore
    loadImagesFromStorage(docId, detailImages);
  }
  
  details.style.display = 'block';
  map.setView([place.location.latitude, place.location.longitude], 15);
}

async function loadImagesFromStorage(docId, container) {
  try {
    const storageRef = storage.ref(`places/${docId}`);
    const result = await storageRef.listAll();
    
    const urls = await Promise.all(
      result.items.map(item => item.getDownloadURL())
    );
    
    urls.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.onclick = () => window.open(url, '_blank');
      container.appendChild(img);
    });
  } catch (error) {
    console.error('Error loading images:', error);
    container.innerHTML = '<p>ไม่สามารถโหลดรูปภาพได้</p>';
  }
}

// Initialize when page loads
window.onload = initMap;
