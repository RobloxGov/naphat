
    document.addEventListener("DOMContentLoaded", function () {
        const targetDate = new Date("April 30, 2025 10:30:00").getTime();
        const now = new Date().getTime();

        if (now >= targetDate) {
            document.documentElement.innerHTML = `
            <html lang="th">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Naphat Dev</title>
                <link rel="icon" href="/public/assets/images/NAPHAT_DEV.png">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
                <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600&family=Prompt:wght@300;400;600&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="style.css">
            </head>
            <body>
                <div class="container">
                    <img src="/public/assets/images/logo.png" height="200px">
                    <h1></h1>
                    <div class="language-buttons">
                        <button onclick="setLanguage('th')">à¹€à¸‚à¹‰à¸²à¸ªà¸¹à¹ˆà¹€à¸§à¹‡à¸šà¹„à¸‹à¸•à¹Œ</button>
                        <button onclick="setLanguage('en')">Enter Site</button>
                        <button onclick="setLanguage('cn')">è¿›å…¥ç½‘ç«™</button>
                    </div>
                </div>
                <script src="script.js"></script>
            </body>
            </html>
            `;
        }
    });
