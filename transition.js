document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const spinner = document.querySelector(".amber-spinner");
    const siteHeader = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelectorAll(".site-nav a[href]");
    const overlay = document.querySelector(".mobile-menu-backdrop");
    const revealTargets = document.querySelectorAll(".bento-card, .service-card, .why-card, .step, .work-item, .case-media");

    if (revealTargets.length) {
        revealTargets.forEach((element, index) => {
            element.classList.add("reveal");
            element.style.transitionDelay = `${Math.min(index * 90, 270)}ms`;
        });

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        currentObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

            revealTargets.forEach((element) => observer.observe(element));
        } else {
            revealTargets.forEach((element) => element.classList.add("visible"));
        }
    }

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

    const canvas = document.querySelector("#bg-canvas");
    const canvasContext = canvas && canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (canvas && canvasContext) {
        const pointer = { x: 0.5, y: 0.5 };
        let points = [];
        let width = 0;
        let height = 0;
        let pixelRatio = 1;
        let frameId = 0;
        let isVisible = !document.hidden;

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(width * pixelRatio);
            canvas.height = Math.round(height * pixelRatio);
            canvasContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            points = Array.from({ length: Math.max(24, Math.min(48, Math.round(width / 12))) }, () => ({
                x: Math.random() * 2 - 1,
                y: Math.random() * 2 - 1,
                z: Math.random() * 2 - 1,
                phase: Math.random() * Math.PI * 2,
                size: Math.random() * 1.4 + 0.45
            }));
        }

        function drawNetwork(time) {
            canvasContext.clearRect(0, 0, width, height);
            const cursorX = pointer.x * width;
            const cursorY = pointer.y * height;
            const drift = reducedMotion ? 0 : time * 0.00012;
            const rotateY = (pointer.x - 0.5) * 0.52 + Math.sin(drift) * 0.035;
            const rotateX = (pointer.y - 0.5) * 0.42 + Math.cos(drift) * 0.035;
            const cosY = Math.cos(rotateY);
            const sinY = Math.sin(rotateY);
            const cosX = Math.cos(rotateX);
            const sinX = Math.sin(rotateX);
            const projectedPoints = points.map((point) => {
                const driftX = Math.sin(drift * 1.4 + point.phase) * 0.025;
                const driftY = Math.cos(drift + point.phase) * 0.025;
                const worldX = point.x + driftX;
                const worldY = point.y + driftY;
                const rotatedX = worldX * cosY - point.z * sinY;
                const rotatedZ = worldX * sinY + point.z * cosY;
                const depthY = worldY * cosX - rotatedZ * sinX;
                const depthZ = worldY * sinX + rotatedZ * cosX;
                const perspective = 1.45 / (2.65 - depthZ);

                return {
                    x: width / 2 + rotatedX * width * 0.52 * perspective,
                    y: height / 2 + depthY * height * 0.52 * perspective,
                    perspective,
                    size: point.size
                };
            }).sort((first, second) => first.perspective - second.perspective);

            projectedPoints.forEach((point, index) => {
                const cursorDistance = Math.hypot(point.x - cursorX, point.y - cursorY);
                const radius = point.size * (0.65 + point.perspective * 0.65)
                    + Math.max(0, 1 - cursorDistance / 160) * 1.2;

                for (let nextIndex = index + 1; nextIndex < projectedPoints.length; nextIndex += 1) {
                    const next = projectedPoints[nextIndex];
                    const distance = Math.hypot(point.x - next.x, point.y - next.y);

                    if (distance < 92) {
                        canvasContext.strokeStyle = `rgba(217, 119, 6, ${(1 - distance / 92) * 0.2})`;
                        canvasContext.lineWidth = 0.55 + point.perspective * 0.35;
                        canvasContext.beginPath();
                        canvasContext.moveTo(point.x, point.y);
                        canvasContext.lineTo(next.x, next.y);
                        canvasContext.stroke();
                    }
                }

                canvasContext.fillStyle = cursorDistance < 160
                    ? `rgba(255, 230, 190, ${0.35 + (1 - cursorDistance / 160) * 0.55})`
                    : `rgba(217, 119, 6, ${0.28 + point.perspective * 0.22})`;
                canvasContext.beginPath();
                canvasContext.arc(point.x, point.y, radius, 0, Math.PI * 2);
                canvasContext.fill();
            });
        }

        function animate(time) {
            drawNetwork(time);
            if (!reducedMotion && isVisible && !document.hidden) {
                frameId = window.requestAnimationFrame(animate);
            } else {
                frameId = 0;
            }
        }

        function startAnimation() {
            if (reducedMotion) {
                drawNetwork(0);
                return;
            }
            if (!frameId && isVisible && !document.hidden) {
                frameId = window.requestAnimationFrame(animate);
            }
        }

        function stopAnimation() {
            if (frameId) {
                window.cancelAnimationFrame(frameId);
                frameId = 0;
            }
        }

        resizeCanvas();
        drawNetwork(0);
        window.addEventListener("pointermove", (event) => {
            pointer.x = event.clientX / window.innerWidth;
            pointer.y = event.clientY / window.innerHeight;
            if (reducedMotion) {
                drawNetwork(0);
            }
        }, { passive: true });

        window.addEventListener("resize", () => {
            resizeCanvas();
            drawNetwork(0);
        });
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                isVisible = false;
                stopAnimation();
            } else {
                isVisible = true;
                startAnimation();
            }
        });

        startAnimation();
    }

    if (!reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        document.querySelectorAll(".bento-card:not(.hero-card)").forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const bounds = card.getBoundingClientRect();
                const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
                const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
                card.style.setProperty("--tilt-x", `${horizontal * 1.1}deg`);
                card.style.setProperty("--tilt-y", `${vertical * -1.1}deg`);
            });
            card.addEventListener("pointerleave", () => {
                card.style.removeProperty("--tilt-x");
                card.style.removeProperty("--tilt-y");
            });
        });
    }
});
