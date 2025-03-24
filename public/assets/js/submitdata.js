const scriptURL = 'https://script.google.com/macros/s/AKfycbzAp1EPJUfLISq2LWzIt4bPshieewU3r0SDqCGly0o41FcZ5zqhInNIRFON6MTLoyq7/exec';
const form = document.forms['hello-sheet'];

form.addEventListener('submit', e => {
  e.preventDefault(); // Prevents the default form submission

  fetch(scriptURL, {
    method: 'POST',
    body: new FormData(form)
  })
  .then(response => {
    if (response.ok) { // Check if response status is OK (status 200)
      alert("บันทึกข้อมูลเรียบร้อยแล้ว.."); // Success message in Thai
      window.location.href = "https://naphat.pages.dev/public/success"; // Redirect to success page
    } else {
      throw new Error('Failed to submit data');
    }
  })
  .catch(error => {
    console.error('Error!', error.message); // Log any errors
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล'); // Show error message in Thai
  });
});
