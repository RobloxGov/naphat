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

        // ✅ เคลียร์กล่องก่อนเริ่มใส่ใหม่
        container.innerHTML = '';

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
            container.appendChild(loadMoreContainer);
        }
    }

    loadMoreBtn.addEventListener("click", loadMoreData);
});
