document.addEventListener('DOMContentLoaded', function() {
    // หาปุ่มที่มี data-reg="2568"
    const button = document.querySelector('button[data-reg="2568"]');
    
    if (button) {
        // เพิ่ม event listener เมื่อคลิก
        button.addEventListener('click', function() {
            window.location.href = '/meeting/e-registration';
        });
    }
});

// document.addEventListener('DOMContentLoaded', function() {
//     // หาปุ่มที่มี data-meet="2568"
//     const button = document.querySelector('button[data-meet="2568"]');
    
//     if (button) {
//         // เพิ่ม event listener เมื่อคลิก
//         button.addEventListener('click', function() {
//             window.location.href = '/meeting/';
//         });
//     }
// });

      
