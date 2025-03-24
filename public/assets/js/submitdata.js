
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzUdlTG4-V5UdigjqXPIXVBZoqP8RJFVa3B6MR-N325lEfiv6ZZofKMPDOGXU_en7ML/exec'
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
