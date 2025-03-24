
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzAp1EPJUfLISq2LWzIt4bPshieewU3r0SDqCGly0o41FcZ5zqhInNIRFON6MTLoyq7/exec'
        const form = document.forms['hello-sheet']
      
        form.addEventListener('submit', e => {
          e.preventDefault()
          fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                alert("บันทึกข้อมูลเรียบร้อยแล้ว..");
                window.location.href = "https://naphat.pages.dev/public/success"; // Redirect to login page
            })
            .catch(error => console.error('Error!', error.message))
        })
