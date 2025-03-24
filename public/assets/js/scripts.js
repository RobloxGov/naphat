
        window.addEventListener("load", () => {
            const loader = document.querySelector(".css-1ltj605");
            if (!loader) {
                console.error("Loader element not found!");
                return;
            }
            
            document.body.style.overflowY = "hidden";
        
            setTimeout(() => {
                console.log("Adding css-1ltj605-hidden class");
                loader.classList.add("css-1ltj605-hidden");
        
                loader.addEventListener("transitionend", () => {
                    console.log("Transition ended, removing loader...");
                    document.body.removeChild(loader);
                    document.body.style.overflowY = "";
                });
            }, 3000);
        });

document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const navLinks = document.querySelector("[data-nav-links]");
    const icon = menuToggle.querySelector("[data-icon]");

    if (!menuToggle || !navLinks || !icon) {
        console.error("Element not found!");
        return;
    }

    menuToggle.addEventListener("click", function() {
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
