document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.aside-menu a').forEach(a => { const id = a.getAttribute('id'); if (id) { a.setAttribute('href', `${id}.html`); } });
});

document.addEventListener("DOMContentLoaded", () => {
  const footer = document.getElementById("footer");
  if (footer) {
    footer.innerHTML = `
      <div class="top-footer">
        <div class="logos">
          <img src="https://naphat.pages.dev/public/assets/images/logo.png" alt="">
        </div>
        <div class="logo-footer">
          <a href="https://dara-esc.pages.dev/" title="DARA ESC">
            <img src="https://naphat.pages.dev/public/assets/images/desc-project.png" width="100" alt="DARA ESC">
          </a>
          <a href="https://gearx2.pages.dev/" title="GearX2">
            <img src="https://naphat.pages.dev/public/assets/images/gearX2-project.png" width="100" alt="GearX2">
          </a>
          <a href="https://rte-kmitl.pages.dev/" title="RTE13 KMITL">
            <img src="https://naphat.pages.dev/public/assets/images/RTE-KMITL-project.png" width="100" alt="RTE13 KMITL">
          </a>
        </div>
      </div>
      <div class="bottom-footer">
        <p>© 2023 - 2025 NaphatDev. All rights reserved.</p>
      </div>
    `;
  }
});