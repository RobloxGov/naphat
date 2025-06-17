const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxyqZ1SuTMNddVFLom6B-jXxDV-WQOOKl_8XolTQkDYv6z0bzDFL9QMoikWl1kjWGFW/exec';

async function fetchImages() {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getImages`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
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
    return { error: error.message };
  }
}

// Similar functions for updateImage and deleteImage
async function getImageById(id) {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getImage&id=${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}

async function getCategories() {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getCategories`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
