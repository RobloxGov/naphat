document.addEventListener("DOMContentLoaded", function () {
            const salesData = Array.from({ length: 28 }, () => Math.floor(Math.random() * 35));
            const heatmap = document.getElementById("salesHeatmap");
            
            for (let i = 0; i < 28; i++) {
                const cell = document.createElement("div");
                cell.classList.add("heatmap-cell");
                
                if (salesData[i] < 5) {
                    cell.classList.add("low");
                } else if (salesData[i] < 15) {
                    cell.classList.add("mid");
                } else if (salesData[i] < 25) {
                    cell.classList.add("high");
                } else {
                    cell.classList.add("very-high");
                }
                
                cell.textContent = salesData[i];
                heatmap.appendChild(cell);
            }
        });
