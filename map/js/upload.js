// เพิ่มโค้ดนี้ก่อนดำเนินการอัพโหลด
auth.onAuthStateChanged(user => {
  if (!user) {
    alert('กรุณาล็อกอินก่อนอัพโหลดข้อมูล');
    window.location.href = 'login.html'; // เปลี่ยนเส้นทางไปหน้าล็อกอิน
    return;
  }
  
  // ดำเนินการอัพโหลดต่อเมื่อล็อกอินแล้ว
});

document.getElementById('uploadForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const placeName = document.getElementById('placeName').value;
  const placeAddress = document.getElementById('placeAddress').value;
  const placeDate = document.getElementById('placeDate').value;
  const placeTime = document.getElementById('placeTime').value;
  const placeDescription = document.getElementById('placeDescription').value;
  const images = document.getElementById('placeImages').files;
  
  if (images.length === 0) {
    alert('กรุณาเลือกรูปภาพอย่างน้อย 1 รูป');
    return;
  }
  
  try {
    // 1. Geocode ที่อยู่เพื่อรับพิกัด latitude/longitude (ใช้ Google Maps API หรืออื่นๆ)
    const coordinates = await geocodeAddress(placeAddress);
    
    // 2. สร้างเอกสารใน Firestore
    const placeRef = await db.collection('places').add({
      name: placeName,
      address: placeAddress,
      location: new firebase.firestore.GeoPoint(coordinates.lat, coordinates.lng),
      date: placeDate,
      time: placeTime,
      description: placeDescription,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      imageCount: images.length
      userId: auth.currentUser.uid // เพิ่ม field userId สำหรับตรวจสอบสิทธิ์ใน Rules
    });
    
    // 3. อัพโหลดรูปภาพไปยัง Storage
    const uploadPromises = [];
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const storageRef = storage.ref(`places/${placeRef.id}/${file.name}`);
      const uploadTask = storageRef.put(file);
      
      uploadPromises.push(
        uploadTask.then(snapshot => snapshot.ref.getDownloadURL())
      );
    }
    
    // 4. บันทึก URL ของรูปภาพใน Firestore
    const imageUrls = await Promise.all(uploadPromises);
    await placeRef.update({ imageUrls });
    
    alert('อัพโหลดสำเร็จ!');
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error uploading:', error);
    alert('เกิดข้อผิดพลาดในการอัพโหลด: ' + error.message);
  }
});

// ฟังก์ชันแปลงที่อยู่เป็นพิกัด (ตัวอย่างใช้ Nominatim OpenStreetMap)
async function geocodeAddress(address) {
  if (!address) return { lat: 0, lng: 0 };
  
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
  const data = await response.json();
  
  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  }
  return { lat: 0, lng: 0 };
}

// แสดงตัวอย่างรูปภาพก่อนอัพโหลด
document.getElementById('placeImages').addEventListener('change', function(e) {
  const preview = document.getElementById('imagePreview');
  preview.innerHTML = '';
  
  for (let file of e.target.files) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxHeight = '100px';
      preview.appendChild(img);
    }
    reader.readAsDataURL(file);
  }
});
