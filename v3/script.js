document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const navLinks = document.querySelector("[data-nav-links]");
    const icon = menuToggle.querySelector("[data-icon]");

    if (!menuToggle || !navLinks || !icon) {
        console.error("Element not found!");
        return;
    }

    menuToggle.addEventListener("click", function () {
        // สลับค่า data-icon ระหว่าง "0" และ "1"
        const currentIcon = icon.getAttribute("data-icon");
        icon.setAttribute("data-icon", currentIcon === "0" ? "1" : "0");

        // สลับ data-nav-links เป็น data-nav-links-active
        if (navLinks.hasAttribute("data-nav-links")) {
            navLinks.setAttribute("data-nav-links-active", "");
            navLinks.removeAttribute("data-nav-links");
        } else {
            navLinks.setAttribute("data-nav-links", "");
            navLinks.removeAttribute("data-nav-links-active");
        }

        console.log("Icon data-icon:", icon.getAttribute("data-icon"));
        console.log("Nav attribute:", navLinks.hasAttribute("data-nav-links") ? "data-nav-links" : "data-nav-links-active");
    });
});

// NEWS

document.addEventListener("DOMContentLoaded", async function () {
    const apiUrl = "https://script.google.com/macros/s/AKfycbyHNShaLwgNfTLJxnQE4syG8e7vwcTHslZV8kOUUoPc-sXk8cdQ25aqGax5DAUeQwkVQA/exec";
    const container = document.querySelector(".news-boxes");
    const loadMoreContainer = document.createElement("div");
    loadMoreContainer.classList.add("load-more-container");
    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.textContent = "ดูเพิ่มเติม";
    loadMoreBtn.classList.add("load-more");
    loadMoreContainer.appendChild(loadMoreBtn);

    let allData = [];
    let currentIndex = 0;
    const itemsPerPage = 3;

    try {
        const response = await fetch(apiUrl);
        allData = await response.json();
        loadMoreData();
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    function loadMoreData() {
        // ลบปุ่มเดิมก่อนเพิ่มใหม่
        if (container.contains(loadMoreContainer)) {
            container.removeChild(loadMoreContainer);
        }

        const nextItems = allData.slice(currentIndex, currentIndex + itemsPerPage);
        nextItems.forEach(item => {
            const box = document.createElement("div");
            box.classList.add("box");
            box.innerHTML = `
                <img src="${item.img}" alt="">
                <h2>${item.title}</h2>
                <div class="categories">
                    <p>${item.categories1 || ""}</p>
                    <p>${item.categories2 || ""}</p>
                    <p style="background: ${item.color};">${item.status}</p>
                </div>
                <p>${item.details}</p>
            `;
            container.appendChild(box);
        });
        currentIndex += itemsPerPage;

        if (currentIndex < allData.length) {
            container.appendChild(loadMoreContainer); // เพิ่มใหม่ที่ล่างสุด
        }
    }

    loadMoreBtn.addEventListener("click", loadMoreData);
});


// ลบ Banner TOP
let bannerRemoved = false; // ตรวจว่าเคยลบ banner แล้วหรือยัง

// กรณี 1: เลื่อนเกิน 100vh แล้วลบ .banner-top และ scroll ไป top
window.addEventListener('scroll', function () {
  if (bannerRemoved) return; // ถ้าเคยลบแล้ว ให้หยุดทันที

  const banner = document.querySelector('.banner-top');
  const header = document.getElementById('header');
  const scrolled = window.scrollY || window.pageYOffset;

  if (scrolled > window.innerHeight) {
    if (banner) banner.remove();

    if (header) header.style.top = '0';

    window.scrollTo({ top: 0, behavior: 'smooth' });

    bannerRemoved = true; // ตั้งค่าว่าเคยลบแล้ว
  }
});

// กรณี 2: คลิก .last-icon แล้วลบ .banner-top และ scroll ไป top
document.addEventListener('DOMContentLoaded', function () {
  const lastIcon = document.querySelector('.last-icon');
  const header = document.querySelector('#header');

  if (lastIcon && header) {
    lastIcon.addEventListener('click', function () {
      if (bannerRemoved) return; // ถ้าเคยลบแล้ว ให้หยุดทันที

      const banner = document.querySelector('.banner-top');
      if (banner) banner.remove();

      setTimeout(function () {
        header.style.top = '0';
        window.scrollTo({ top: 0, behavior: 'smooth' });

        bannerRemoved = true; // ตั้งค่าว่าเคยลบแล้ว
      }, 100);
    });
  }
});


// performance

document.addEventListener("DOMContentLoaded", async function () {
    const apiUrl = "https://script.google.com/macros/s/AKfycbyhakX9jMyeMHT-mv74JsJxaY8aCHJNmmCNoZKa3hiHXbvYNev_n9OGGtM9v7foXdAX/exec";
    const container = document.querySelector(".performance-boxes");
    const loadMoreContainer = document.createElement("div");
    loadMoreContainer.classList.add("load-more-container");
    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.textContent = "ดูเพิ่มเติม";
    loadMoreBtn.classList.add("load-more");
    loadMoreContainer.appendChild(loadMoreBtn);

    let allData = [];
    let currentIndex = 0;
    const itemsPerPage = 3;

    try {
        const response = await fetch(apiUrl);
        allData = await response.json();
        loadMoreData();
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    function loadMoreData() {
        // ลบ loadMoreContainer ถ้ามีอยู่แล้ว เพื่อให้มันไปอยู่ล่างสุด
        if (container.contains(loadMoreContainer)) {
            container.removeChild(loadMoreContainer);
        }

        const nextItems = allData.slice(currentIndex, currentIndex + itemsPerPage);
        nextItems.forEach(item => {
            const box = document.createElement("div");
            box.classList.add("box");
            box.innerHTML = `
                <a href="${item.url}">
                    <img src="${item.image}" alt="">
                    <h2>${item.certificate}</h2>
                    <p>${item.yearReceived}</p>
                </a>`;
            container.appendChild(box);
        });

        currentIndex += itemsPerPage;

        if (currentIndex < allData.length) {
            container.appendChild(loadMoreContainer); // ใส่ไว้ท้ายสุดใหม่
        }
    }

    loadMoreBtn.addEventListener("click", loadMoreData);
});

