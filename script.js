// --- LOADING SCREEN ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loading');
    const nameElem = document.getElementById('loader-name');
    const role1Elem = document.getElementById('loader-role-1');
    const role2Elem = document.getElementById('loader-role-2');
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

    const scrambleText = (element, finalWord, duration, callback) => {
        if (!element) return;
        let iterations = 0;
        const maxIterations = duration / 30;
        const interval = setInterval(() => {
            element.innerText = finalWord.split("").map((letter, index) => {
                if (letter === " ") return " ";
                if (index < iterations / (maxIterations / finalWord.length)) {
                    return finalWord[index];
                }
                return letters[Math.floor(Math.random() * letters.length)];
            }).join("");

            iterations++;
            if (iterations >= maxIterations) {
                clearInterval(interval);
                element.innerText = finalWord;
                if (callback) callback();
            }
        }, 30);
    };

    if (nameElem && role1Elem) {
        scrambleText(nameElem, "RAMKUMAR S", 800, () => {
            scrambleText(role1Elem, "DEVELOPER", 600, () => {
                setTimeout(() => {
                    if (loader) {
                        loader.classList.add('fade-out');
                        setTimeout(() => loader.style.display = 'none', 1200);
                    }
                }, 500);
            });
        });
    } else {
        setTimeout(() => {
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => loader.style.display = 'none', 1200);
            }
        }, 800);
    }
});

// --- THEME TOGGLE ---
const themeToggle = document.getElementById('theme-toggle');
const flashOverlay = document.getElementById('flash-overlay');
const htmlEl = document.documentElement;

themeToggle.addEventListener('click', () => {
    // 1. Flash effect
    flashOverlay.classList.remove('active');
    void flashOverlay.offsetWidth; // Trigger reflow to restart animation
    flashOverlay.classList.add('active');

    // 2. Switch theme right as the flash covers the screen (mid-animation approx 150ms)
    setTimeout(() => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlEl.setAttribute('data-theme', newTheme);

        // Redraw icons to match new text color mode
        drawLogoIcons(newTheme);
        drawThemeIcon(newTheme, newTheme); // Target theme dictates icon state
        drawSoundIcon(newTheme, !isSoundEnabled); // Preserve muted state across theme changes
    }, 150);
});


// --- CANVAS DRAWING UTILITIES ---

// Helper to get raw CSS variable value (e.g. for canvas stroke/fill)
function getCssColor(varName, theme) {
    // For simplicity, we hardcode the mapping here to avoid async reading of computed styles mid-transition
    if (varName === '--color-text') return theme === 'dark' ? '#FFFFFF' : '#111111';
    if (varName === '--color-border') return theme === 'dark' ? '#FFFFFF' : '#111111';
    return '#111';
}

function drawPixelRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}


// 1. Logo Icons (Triangle, Circle, Square, Play)
function drawLogoIcons(theme = 'light') {
    const canvas = document.getElementById('logo-icons');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const color = getCssColor('--color-text', theme);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Simplistic pixel-art style drawing using paths
    ctx.fillStyle = color;

    // Triangle (Left)
    ctx.beginPath();
    ctx.moveTo(10, 2);
    ctx.lineTo(2, 16);
    ctx.lineTo(18, 16);
    ctx.fill();

    // Circle
    ctx.beginPath();
    ctx.arc(30, 9, 8, 0, Math.PI * 2);
    ctx.fill();

    // Square (Hollow)
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(43, 2, 14, 14);

    // Play/Triangle Right
    ctx.beginPath();
    ctx.moveTo(66, 2);
    ctx.lineTo(66, 16);
    ctx.lineTo(76, 9);
    ctx.fill();
}


// 2. Theme Toggle Icon (Sun in light mode, Moon in dark mode)
function drawThemeIcon(themeState = 'light', currentUiTheme = 'light') {
    const canvas = document.getElementById('icon-theme');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const color = getCssColor('--color-text', currentUiTheme);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;

    if (themeState === 'light') {
        // Pixel Sun: center + 8 rays
        ctx.fillRect(6, 6, 4, 4);   // center
        ctx.fillRect(7, 1, 2, 2);   // top
        ctx.fillRect(7, 13, 2, 2);  // bottom
        ctx.fillRect(1, 7, 2, 2);   // left
        ctx.fillRect(13, 7, 2, 2);  // right
        ctx.fillRect(2, 2, 2, 2);   // top-left
        ctx.fillRect(12, 2, 2, 2);  // top-right
        ctx.fillRect(2, 12, 2, 2);  // bottom-left
        ctx.fillRect(12, 12, 2, 2); // bottom-right
    } else {
        // Pixel Moon: simple D-shaped crescent facing right
        // Full circle pixels
        ctx.fillRect(4, 2, 6, 2);
        ctx.fillRect(2, 4, 8, 2);
        ctx.fillRect(2, 6, 8, 4);
        ctx.fillRect(2, 10, 8, 2);
        ctx.fillRect(4, 12, 6, 2);
        // Erase middle (inner cutout) to form crescent
        ctx.clearRect(6, 4, 4, 8);
        ctx.clearRect(5, 2, 2, 2);
        ctx.clearRect(5, 12, 2, 2);
    }
}


// 3. Sound Toggle Icon (speaker with waves when ON, speaker with X when OFF/muted)
function drawSoundIcon(currentUiTheme = 'light', muted = false) {
    const canvas = document.getElementById('icon-sound');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const color = getCssColor('--color-text', currentUiTheme);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;

    // Speaker body (same in both states)
    ctx.fillRect(2, 6, 3, 4);
    ctx.fillRect(5, 4, 3, 8);

    if (!muted) {
        // Sound waves (ON state)
        ctx.fillRect(10, 5, 1, 6);
        ctx.fillRect(12, 3, 1, 10);
    } else {
        // X mark (muted state)
        ctx.fillRect(10, 5, 2, 2);
        ctx.fillRect(13, 5, 2, 2);
        ctx.fillRect(11, 7, 3, 2);
        ctx.fillRect(10, 9, 2, 2);
        ctx.fillRect(13, 9, 2, 2);
    }
}


// --- AUDIO UTILITIES ---
let isSoundEnabled = false;

document.getElementById('sound-toggle').addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    drawSoundIcon(currentTheme, !isSoundEnabled); // muted = !isSoundEnabled
});

function playHoverSound() {
    if (!isSoundEnabled) return;

    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.05);

        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
        // Ignore audio errors
    }
}

function setupHoverSounds() {
    const interactables = document.querySelectorAll('a, button, .util-icon, .project-card, .card-list li');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', playHoverSound);
    });
}


// --- INTERNATIONALIZATION ---
// Note: The `translations` dictionary is now loaded from translations.js

function setupLanguageToggle() {
    const langWrapper = document.querySelector('.lang-dropdown-wrapper');
    const langBtn = document.getElementById('lang-toggle');
    const langMenu = document.getElementById('lang-menu');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangDisplay = document.getElementById('current-lang');

    if (!langWrapper || !langBtn || !langMenu) return;

    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        if (langMenu.classList.contains('show')) {
            langMenu.classList.remove('show');
        }
    });

    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');

            if (currentLangDisplay) {
                currentLangDisplay.textContent = option.textContent.substring(0, 2);
            }

            applyTranslations(lang);
            langMenu.classList.remove('show');
        });
    });
}

function applyTranslations(lang) {
    const t = translations[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            // Security: Use textContent for plain strings to prevent XSS.
            // Only use innerHTML if the translation string contains HTML tags.
            const value = t[key];
            if (value.includes('<') && value.includes('>')) {
                el.innerHTML = value;
            } else {
                el.textContent = value;
            }
        }
    });
}

// --- INTERACTIVE NAVIGATION ---
function setupMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });
}

function setupSmoothScrolling() {
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
}


// --- DARK MODE BACKGROUND STARS ---
function setupStarfield() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    const stars = [];
    const NUM_STARS = 150;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    // Initialize stars
    for (let i = 0; i < NUM_STARS; i++) {
        stars.push({
            x: Math.random() * 2000,
            y: Math.random() * 2000,
            size: Math.random() > 0.8 ? 2 : 1, // Occasional 2px stars
            opacity: Math.random() * 0.5 + 0.1,
            speedY: (Math.random() * 0.2) + 0.05 // Drift slowly upwards
        });
    }

    function animate() {
        if (document.documentElement.getAttribute('data-theme') !== 'dark') {
            requestAnimationFrame(animate);
            return; // Only draw when in dark mode to save CPU
        }

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < NUM_STARS; i++) {
            let s = stars[i];

            // Move up
            s.y -= s.speedY;
            if (s.y < 0) {
                s.y = height;
                s.x = Math.random() * width;
            }

            ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
            ctx.fillRect(s.x, s.y, s.size, s.size); // Hard square pixels
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    drawLogoIcons('light');
    drawThemeIcon('light', 'light');
    drawSoundIcon('light', true); // Start muted (sound off by default)
    setupStarfield();
    setupMobileMenu();
    setupSmoothScrolling();
    setupHoverSounds();
    setupLanguageToggle();
});
