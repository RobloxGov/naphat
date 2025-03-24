// document.addEventListener("DOMContentLoaded", function () {const menuToggle = document.querySelector(".menu-toggle");const navLinks = document.querySelector(".nav-links");const icon = menuToggle.querySelector("i");if (!menuToggle || !navLinks || !icon) {console.error("Element not found!");return;}menuToggle.addEventListener("click", function () {navLinks.classList.toggle("nav-active");     icon.classList.toggle("fa-bars");icon.classList.toggle("fa-times");console.log("Icon class:", icon.classList);});});
document.querySelector('.btn').addEventListener('click', function() {if (this.hasAttribute('data-log-in')) {window.location.href = '/public/login';}});
window.addEventListener("load", () => {const loader = document.querySelector(".css-1ltj605");document.body.style.overflowY = "hidden";setTimeout(() => {loader.classList.add("css-1ltj605-hidden");loader.addEventListener("transitionend", () => {document.body.removeChild(loader);document.body.style.overflowY = "";});}, 3000);});
document.addEventListener("DOMContentLoaded", async function () {const apiUrl = "https://script.google.com/macros/s/AKfycbyHNShaLwgNfTLJxnQE4syG8e7vwcTHslZV8kOUUoPc-sXk8cdQ25aqGax5DAUeQwkVQA/exec";const container = document.querySelector(".boxes");const mainContainer = document.querySelector("main");const loadMoreContainer = document.createElement("div");loadMoreContainer.classList.add("load-more-container");const loadMoreBtn = document.createElement("button");loadMoreBtn.textContent = "ดูเพิ่มเติม";loadMoreBtn.classList.add("load-more");loadMoreContainer.appendChild(loadMoreBtn);mainContainer.appendChild(loadMoreContainer);let allData = [];let currentIndex = 0;const itemsPerPage = 3;try {const response = await fetch(apiUrl);allData = await response.json();loadMoreData();} catch (error) {console.error("Error fetching data:", error);}function loadMoreData() {const nextItems = allData.slice(currentIndex, currentIndex + itemsPerPage);nextItems.forEach(item => {const box = document.createElement("div");box.classList.add("box");box.innerHTML = `<img src="${item.img}" alt=""><h2>${item.title}</h2><div class="categories"><p>${item.categories1 || ""}</p><p>${item.categories2 || ""}</p><p style="background: ${item.color};">${item.status}</p></div><p>${item.details}</p>`;container.appendChild(box);});currentIndex += itemsPerPage;if (currentIndex >= allData.length) {loadMoreBtn.style.display = "none";}}loadMoreBtn.addEventListener("click", loadMoreData);});

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
