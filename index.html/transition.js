document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const spinner = document.querySelector(".amber-spinner");
    const siteHeader = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelectorAll(".site-nav a[href]");
    const overlay = document.querySelector(".mobile-menu-backdrop");

    function checkNetworkStatus() {
        if (!navigator.onLine) {
            body.classList.add("is-offline");
        } else {
            body.classList.remove("is-offline");
        }
    }

    function closeMobileMenu() {
        if (siteHeader) {
            siteHeader.classList.remove("nav-open");
        }
        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
        }
        if (overlay) {
            overlay.classList.remove("is-visible");
        }
    }

    if (menuToggle && siteHeader) {
        menuToggle.addEventListener("click", () => {
            const isOpen = siteHeader.classList.toggle("nav-open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            if (overlay) {
                overlay.classList.toggle("is-visible", isOpen);
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                closeMobileMenu();
            });
        });

        if (overlay) {
            overlay.addEventListener("click", closeMobileMenu);
        }

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                closeMobileMenu();
            }
        });
    }

    checkNetworkStatus();
    window.addEventListener("online", checkNetworkStatus);
    window.addEventListener("offline", checkNetworkStatus);

    setTimeout(() => {
        if (navigator.onLine) {
            body.classList.add("page-loaded");
        }
    }, 250);

    const links = document.querySelectorAll("nav a[href], .back-btn");

    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetUrl = link.getAttribute("href");

            const isInternalLink = targetUrl &&
                !targetUrl.startsWith("http") &&
                !targetUrl.startsWith("https") &&
                !targetUrl.startsWith("#") &&
                !targetUrl.startsWith("mailto:") &&
                !targetUrl.startsWith("tel:");

            if (!isInternalLink) {
                return;
            }

            event.preventDefault();

            if (!navigator.onLine) {
                body.classList.add("is-offline");
                return;
            }

            body.classList.remove("page-loaded");
            body.classList.add("page-leaving");

            setTimeout(() => {
                window.location.href = targetUrl;
            }, 180);
        });
    });

    if (spinner) {
        setTimeout(() => {
            spinner.classList.add("is-hidden");
        }, 1500);
    }
});
