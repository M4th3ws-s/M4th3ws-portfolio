
/* =========================================================
   M4TH3WS — BEYOND THE INTERNET
   VISUAL SYSTEM 04
   DIMENSION ENGINE
========================================================= */

(() => {
    "use strict";

    /* -----------------------------------------------------
       CONFIGURATION
    ----------------------------------------------------- */

    const CONFIG = {
        introKey: "m4_dimension_intro_seen",
        introDuration: 5600,
        transitionDuration: 1050,
        scrollThreshold: 450,

        colors: {
            lime: "#D7FF3F",
            violet: "#7957FF",
            cobalt: "#2457E6",
            silver: "#B9B8C5",
            white: "#F4F3F8",
            charcoal: "#111116"
        }
    };

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const sectionColors = {
        home: CONFIG.colors.lime,
        about: CONFIG.colors.violet,
        skills: CONFIG.colors.cobalt,
        projects: CONFIG.colors.silver,
        journey: CONFIG.colors.violet,
        future: CONFIG.colors.lime,
        contact: CONFIG.colors.cobalt
    };

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    let transitionBusy = false;
    let introTimers = [];
    let currentSection = null;

    /* -----------------------------------------------------
       SAFE STORAGE
    ----------------------------------------------------- */

    const storage = {
        get(key) {
            try {
                return localStorage.getItem(key);
            } catch {
                return null;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(key, value);
            } catch {
                // Continue without persistent storage.
            }
        }
    };

    /* -----------------------------------------------------
       PRELOADER
    ----------------------------------------------------- */

    function removePreloader() {
        const preloader = $("#preloader");

        if (preloader) {
            preloader.classList.add("is-hidden");

            window.setTimeout(() => {
                preloader.remove();
            }, reducedMotion ? 0 : 350);
        }
    }

    /* -----------------------------------------------------
       DIMENSIONAL INTRO
    ----------------------------------------------------- */

    function createIntro() {
        const intro = document.createElement("div");

        intro.className = "dimension-intro";
        intro.id = "dimension-intro";

        intro.setAttribute("aria-label", "Entering M4TH3WS");
        intro.setAttribute("role", "dialog");
        intro.setAttribute("aria-modal", "true");

        intro.innerHTML = `
            <div class="dimension-space">

                <div class="dimension-grid"></div>

                <div class="dimension-speedlines"></div>

                <div class="dimension-core"></div>

                <div class="dimension-rift"></div>

                <div class="dimension-shards"></div>

                <div class="dimension-tunnel"></div>

                <div class="dimension-flash"></div>

                <div class="dimension-brand">
                    <p class="dimension-label">
                        UNKNOWN SPACE / SUBJECT 001
                    </p>

                    <h1
                        class="dimension-title"
                        data-text="M4TH3WS."
                    >
                        <span>M4</span>TH3WS.
                    </h1>

                    <p class="dimension-tagline">
                        BEYOND THE INTERNET
                    </p>
                </div>

                <div class="dimension-caption">
                    A NEW PERSPECTIVE IS FORMING
                </div>

                <button
                    class="dimension-skip"
                    type="button"
                    aria-label="Skip introduction"
                >
                    SKIP INTRO <span>↗</span>
                </button>

            </div>
        `;

        document.body.appendChild(intro);

        return intro;
    }

    /* -----------------------------------------------------
       FRACTURE GENERATOR
    ----------------------------------------------------- */

    function createFractures(container) {
        const fragment = document.createDocumentFragment();

        const palette = [
            CONFIG.colors.lime,
            CONFIG.colors.violet,
            CONFIG.colors.cobalt,
            CONFIG.colors.silver,
            CONFIG.colors.cobalt,
        ];

        for (let i = 0; i < 22; i++) {
            const shard = document.createElement("span");

            shard.className = "dimension-shard";

            const angle = (360 / 22) * i;
            const distance = 100 + Math.random() * 160;
            const size = 15 + Math.random() * 55;

            shard.style.setProperty("--shard-angle", `${angle}deg`);
            shard.style.setProperty("--shard-distance", `${distance}px`);
            shard.style.setProperty("--shard-size", `${size}px`);

            shard.style.setProperty(
                "--shard-color",
                palette[i % palette.length]
            );

            shard.style.setProperty(
                "--shard-delay",
                `${Math.random() * 0.45}s`
            );

            fragment.appendChild(shard);
        }

        container.appendChild(fragment);
    }

    /* -----------------------------------------------------
       INTRO ANIMATION
    ----------------------------------------------------- */

    function clearIntroTimers() {
        introTimers.forEach(clearTimeout);
        introTimers = [];
    }

    function finishIntro(intro, skipped = false) {
        if (!intro || !intro.isConnected) return;

        clearIntroTimers();

        storage.set(CONFIG.introKey, "true");

        intro.classList.add("is-closing");

        if (skipped) {
            intro.classList.add("is-skipped");
        }

        window.setTimeout(() => {
            intro.remove();
            document.body.classList.remove("intro-active");
        }, reducedMotion ? 0 : 650);
    }

    function startIntro() {
        const shouldReplay =
            new URLSearchParams(window.location.search).get("intro") === "1";

        const alreadySeen =
            storage.get(CONFIG.introKey) === "true";

        removePreloader();

        if (alreadySeen && !shouldReplay) {
            return;
        }

        const intro = createIntro();
        const shards = $(".dimension-shards", intro);
        const skipButton = $(".dimension-skip", intro);

        document.body.classList.add("intro-active");

        createFractures(shards);

        skipButton.addEventListener("click", () => {
            finishIntro(intro, true);
        });

        const stages = [
            [100, () => intro.classList.add("is-awakening")],
            [850, () => intro.classList.add("is-fracturing")],
            [1750, () => intro.classList.add("is-opening")],
            [2850, () => intro.classList.add("is-exploding")],
            [3700, () => intro.classList.add("is-revealing")],
            [CONFIG.introDuration, () => finishIntro(intro)]
        ];

        stages.forEach(([delay, callback]) => {
            introTimers.push(
                window.setTimeout(callback, delay)
            );
        });

        // Allow Escape to skip.
        const escapeHandler = (event) => {
            if (event.key === "Escape" && intro.isConnected) {
                finishIntro(intro, true);
                document.removeEventListener("keydown", escapeHandler);
            }
        };

        document.addEventListener("keydown", escapeHandler);

        intro.addEventListener("transitionend", (event) => {
            if (event.target === intro && !intro.isConnected) {
                document.removeEventListener("keydown", escapeHandler);
            }
        });
    }

    /* -----------------------------------------------------
       DIMENSIONAL NAVIGATION ENGINE
    ----------------------------------------------------- */

    function createTransition() {
    const overlay = document.createElement("div");

    overlay.className = "dimension-transition";
    overlay.id = "dimension-transition";
    overlay.setAttribute("aria-hidden", "true");

    overlay.innerHTML = `
        <div class="transition-plane"></div>
        <div class="transition-speedlines"></div>
        <div class="transition-rift"></div>
        <div class="transition-glitch"></div>
        <div class="transition-flash"></div>

        <div class="transition-fragments"></div>

        <div class="transition-label">
            RECONSTRUCTING DIMENSION
        </div>
    `;

    document.body.appendChild(overlay);
    return overlay;
}

    function getSection(id) {
        if (!id) return null;

        const target = document.getElementById(id);

        if (!target) return null;

        return target;
    }

    closeMobileMenu()
    

function createSectionFragments(section, overlay, mode) {
    if (!section || !overlay) return;

    const stage = $(".transition-fragments", overlay);
    if (!stage) return;

    const rect = section.getBoundingClientRect();

    // Create an irregular field of fragments.
    const columns = 5;
    const rows = 4;

    const cellWidth = window.innerWidth / columns;
    const cellHeight = window.innerHeight / rows;

    // Shared, randomly displaced points create uneven edges.
    const points = [];

    for (let row = 0; row <= rows; row++) {
        points[row] = [];

        for (let column = 0; column <= columns; column++) {
            let x = column * cellWidth;
            let y = row * cellHeight;

            if (column > 0 && column < columns) {
                x += (Math.random() - 0.5) * cellWidth * 0.30;
            }

            if (row > 0 && row < rows) {
                y += (Math.random() - 0.5) * cellHeight * 0.30;
            }

            points[row][column] = [x, y];
        }
    }

    const clone = section.cloneNode(true);

    clone.removeAttribute("id");

    clone.querySelectorAll("[id]").forEach((element) => {
        element.removeAttribute("id");
    });

    clone.querySelectorAll(
        "a, button, input, textarea, select"
    ).forEach((element) => {
        element.setAttribute("tabindex", "-1");
    });

    clone.setAttribute("aria-hidden", "true");

    clone.style.position = "absolute";
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.maxWidth = "none";
    clone.style.margin = "0";
    clone.style.pointerEvents = "none";

    // Each fragment gets a different irregular quadrilateral.
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const corners = [
                points[row][column],
                points[row][column + 1],
                points[row + 1][column + 1],
                points[row + 1][column]
            ];

            const tile = document.createElement("div");

            tile.className = `m4-fragment-tile ${mode}`;

            tile.style.inset = "0";
            tile.style.width = "100vw";
            tile.style.height = "100vh";

            tile.style.clipPath = `polygon(${
                corners.map(([x, y]) => `${x}px ${y}px`).join(", ")
            })`;

            tile.style.setProperty(
                "--tile-delay",
                `${Math.random() * 0.14}s`
            );

            tile.style.setProperty(
                "--break-x",
                `${(Math.random() - 0.5) * 260}px`
            );

            tile.style.setProperty(
                "--break-y",
                `${(Math.random() - 0.5) * 220}px`
            );

            tile.style.setProperty(
                "--break-rotation",
                `${(Math.random() - 0.5) * 55}deg`
            );

            tile.appendChild(clone.cloneNode(true));
            stage.appendChild(tile);
        }
    }
}


    function closeMobileMenu() {
        const menu = $("#nav-links");
        const toggle = $("#menu-toggle");

        if (!menu || !toggle) return;

        menu.classList.remove("is-open");
        toggle.classList.remove("is-active");

        toggle.setAttribute("aria-expanded", "false");
    }
     function scrollToSection(target, smooth = true) {
    if (!target) return;

    target.scrollIntoView({
        behavior: smooth && !reducedMotion ? "smooth" : "auto",
        block: "start"
      });
    }


function navigateTo(id, options = {}) {
    const {
        updateHistory = true,
        instant = false
    } = options;

    const target = getSection(id);

    if (!target || transitionBusy) return;
    if (currentSection === id && !instant) return;

    closeMobileMenu();

    // Browser history navigation and reduced-motion users
    // get a direct, accessible transition.
    if (instant || reducedMotion) {
        scrollToSection(target, false);
        currentSection = id;

        if (updateHistory) {
            history.pushState({ section: id }, "", `#${id}`);
        }

        return;
    }

    transitionBusy = true;

    const overlay = $("#dimension-transition") || createTransition();
    const stage = $(".transition-fragments", overlay);

    const outgoing = getSection(currentSection) ||
        $("main section[id]");

    const accent = sectionColors[id] || CONFIG.colors.lime;

    overlay.style.setProperty("--transition-accent", accent);

    overlay.classList.remove(
        "is-active",
        "is-opening",
        "is-entering",
        "has-fragments"
    );

    stage.innerHTML = "";

    void overlay.offsetWidth;

    overlay.classList.add("is-active", "has-fragments");

    // PHASE 1: The current section breaks apart.
    if (outgoing) {
        createSectionFragments(outgoing, overlay, "breaking");
    }

    window.setTimeout(() => {

        // PHASE 2: Move to the incoming section.
        scrollToSection(target, false);
        currentSection = id;

        if (updateHistory) {
            history.pushState(
                { section: id },
                "",
                `#${id}`
            );
        }

        // PHASE 3: The incoming section assembles from fragments.
        createSectionFragments(target, overlay, "forming");

        target.classList.add("dimension-arrival");

        window.setTimeout(() => {

            // Reveal the real section underneath.
            overlay.classList.remove("has-fragments", "is-active");
            stage.innerHTML = "";

            target.classList.remove("dimension-arrival");

            overlay.classList.remove("is-opening", "is-entering");

            transitionBusy = false;

        }, 650);

    }, 380);
}


    function setupSectionTravel() {
        const overlay = createTransition();

        overlay.id = "dimension-transition";

        const links = $$('a[href^="#"]');

        links.forEach((link) => {
            link.addEventListener("click", (event) => {
                const href = link.getAttribute("href");

                if (!href || href === "#") return;

                const id = href.slice(1);
                const target = getSection(id);

                if (!target) return;

                event.preventDefault();

                if (id === currentSection) {
                    closeMobileMenu();
                    return;
                }

                navigateTo(id);
            });
        });

        // Browser back and forward support.
        window.addEventListener("popstate", () => {
            const id = window.location.hash.slice(1);

            const target = getSection(id);

            if (target) {
                navigateTo(id, {
                    updateHistory: false,
                    instant: true
                });
            } else {
                scrollToSection($("#home"), false);
            }
        });

        const initialId = window.location.hash.slice(1);

        currentSection = getSection(initialId)
            ? initialId
            : "home";
    }

    /* -----------------------------------------------------
       MOBILE NAVIGATION
    ----------------------------------------------------- */

    function setupMobileNavigation() {
        const toggle = $("#menu-toggle");
        const menu = $("#nav-links");

        if (!toggle || !menu) return;

        toggle.setAttribute("aria-expanded", "false");

        toggle.addEventListener("click", () => {
            const isOpen = menu.classList.toggle("is-open");

            toggle.classList.toggle("is-active", isOpen);

            toggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        // Close with Escape.
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMobileMenu();
            }
        });

        // Close when clicking outside.
        document.addEventListener("click", (event) => {
            if (
                !menu.contains(event.target) &&
                !toggle.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });
    }

    /* -----------------------------------------------------
       SCROLL REVEALS
    ----------------------------------------------------- */

    function setupScrollReveals() {
        const elements = $$(
            ".section-heading, .about-layout, .skill-card, " +
            ".project-card, .timeline-item, .future-content, " +
            ".contact-content"
        );

        if (!("IntersectionObserver" in window) || reducedMotion) {
            elements.forEach((element) => {
                element.classList.add("is-visible");
            });
            return;
        }

        const observer = new IntersectionObserver(
            (entries, activeObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("is-visible");

                    activeObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -45px 0px"
            }
        );

        elements.forEach((element) => {
            observer.observe(element);
        });
    }

    /* -----------------------------------------------------
       BACK TO TOP
    ----------------------------------------------------- */

    function setupBackToTop() {
        const button = $(".back-to-top");

        if (!button) return;

        const updateVisibility = () => {
            button.classList.toggle(
                "visible",
                window.scrollY > CONFIG.scrollThreshold
            );
        };

        window.addEventListener(
            "scroll",
            updateVisibility,
            { passive: true }
        );

        updateVisibility();

        button.addEventListener("click", () => {
            navigateTo("home");
        });
    }

    /* -----------------------------------------------------
       CURRENT YEAR
    ----------------------------------------------------- */

    function setupYear() {
        const year = $("#year") || $("[data-year]");

        if (year) {
            year.textContent = new Date().getFullYear();
        }
    }

    /* -----------------------------------------------------
       SECTION TRACKING
    ----------------------------------------------------- */

    function setupSectionTracking() {
        const sections = $$("main section[id]");

        if (!("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        currentSection = entry.target.id;
                    }
                });
            },
            {
                threshold: 0.35
            }
        );

        sections.forEach((section) => {
            observer.observe(section);
        });
    }

    /* -----------------------------------------------------
       INITIALIZATION
    ----------------------------------------------------- */

    function init() {
        startIntro();

        setupSectionTravel();
        setupMobileNavigation();
        setupScrollReveals();
        setupBackToTop();
        setupYear();
        setupSectionTracking();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, {
            once: true
        });
    } else {
        init();
    }

    /*
       DEVELOPMENT:
       To replay the introduction, open the browser console
       and run:

       localStorage.removeItem("m4_dimension_intro_seen");
       location.reload();

       Or visit the page with ?intro=1
    */

})();
