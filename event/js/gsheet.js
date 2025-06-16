const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3sYxhI0I7RP_vl_Zyy-9r7T_jduO_WWTfIBWQj96xl41GEBTZbSideyfCJl5h3xq5/exec';

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