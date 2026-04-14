/**
 * Disilia – main.js
 * Ambient background particle dust (global) + GSAP UI animations.
 * Fashion-specific particle shapes are rendered per-page in inline scripts.
 */

document.addEventListener('DOMContentLoaded', () => {
    initAmbientBackground();
    initAnimations();
    initRevealAnimations();
    initMobileMenu();
});

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT BACKGROUND  – very subtle floating dust particles (all pages)
// Skipped on home page since it has its own hero canvas.
// ─────────────────────────────────────────────────────────────────────────────
function initAmbientBackground() {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    // Fixed background setup
    const isHome = !!document.getElementById('hero-canvas');
    container.style.opacity = isHome ? '0.15' : '0.45';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Group for objects to allow easy parallax
    const group = new THREE.Group();
    scene.add(group);

    // Outstanding 3D geometries (Glassy / Wireframe prisms)
    const shapes = [];
    const colors = [0xc9873c, 0x9e6a2b, 0x1c1c1e];

    for (let i = 0; i < 15; i++) {
        const type = Math.random();
        let geo;
        if (type > 0.6) geo = new THREE.IcosahedronGeometry(Math.random() * 8 + 4, 0);
        else if (type > 0.3) geo = new THREE.OctahedronGeometry(Math.random() * 6 + 3, 0);
        else geo = new THREE.TorusGeometry(8, 0.2, 16, 100);

        const mat = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            wireframe: true,
            transparent: true,
            opacity: 0.15 + Math.random() * 0.2
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 400, // Tall for scroll
            (Math.random() - 0.5) * 100
        );
        mesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);

        const data = {
            mesh,
            rotVel: (Math.random() - 0.5) * 0.01,
            parallaxFactor: Math.random() * 0.5 + 0.1
        };

        shapes.push(data);
        group.add(mesh);
    }
    
    let ammx = 0, ammy = 0;
    document.addEventListener('mousemove', e => {
        ammx = (e.clientX - window.innerWidth / 2) * 0.05;
        ammy = (e.clientY - window.innerHeight / 2) * 0.05;
    });

    let lastScroll = window.scrollY;
    let scrollVelocity = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        scrollVelocity = currentScroll - lastScroll;
        lastScroll = currentScroll;
    }, { passive: true });

    const clock = new THREE.Clock();
    (function tick() {
        const t = clock.getElapsedTime();
        scrollVelocity *= 0.95;

        shapes.forEach((s, idx) => {
            s.mesh.rotation.x += s.rotVel + (scrollVelocity * 0.0005);
            s.mesh.rotation.y += s.rotVel;
            const targetY = ((-lastScroll * s.parallaxFactor * 0.45) - s.mesh.position.y);
            s.mesh.position.y += targetY * 0.08;
            s.mesh.position.x += Math.sin(t * 0.3 + idx) * 0.03;
        });

        camera.position.x += (ammx * 0.8 - camera.position.x) * 0.04;
        camera.position.y += (-ammy * 0.8 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
    tick();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// GSAP UI Animations
// ─────────────────────────────────────────────────────────────────────────────
function initAnimations() {
    if (typeof gsap === 'undefined') return;

    if (document.querySelector('.hero-text')) {
        gsap.from('.hero-text', { x: -60, duration: 1, ease: 'power3.out' });
        gsap.from('.hero-subtext', { x: -40, duration: 1, delay: 0.25, ease: 'power3.out' });
        gsap.from('.hero-buttons a', { y: 20, duration: 0.8, delay: 0.5, stagger: 0.18, ease: 'power3.out' });
    }

    // Section Reveal Animations
    document.querySelectorAll('section, .reveal').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 90%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 80,
            scale: 0.98,
            duration: 1.5,
            ease: "expo.out"
        });
    });

    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (!nav) return;
        nav.classList.toggle('glass-nav-shrunken', window.scrollY > 100);
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL REVEAL ANIMATIONS
// ─────────────────────────────────────────────────────────────────────────────
function initRevealAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    // Fade Up Reveal
    gsap.utils.toArray('.reveal-up').forEach((elem) => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    });

    // Stagger Grid Animation
    gsap.utils.toArray('.stagger-grid').forEach((grid) => {
        gsap.from(grid.children, {
            scrollTrigger: {
                trigger: grid,
                start: "top 80%"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power2.out"
        });
    });

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElem = document.querySelector(targetId);
            if (targetElem) {
                e.preventDefault();
                targetElem.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE MENU
// ─────────────────────────────────────────────────────────────────────────────
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-drawer');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');

    if (!mobileBtn || !drawer || !overlay) return;

    const toggleDrawer = (open) => {
        if (open) {
            drawer.classList.remove('translate-x-full');
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.add('opacity-100'), 10);
            document.body.style.overflow = 'hidden';
        } else {
            drawer.classList.add('translate-x-full');
            overlay.classList.remove('opacity-100');
            setTimeout(() => overlay.classList.add('hidden'), 500);
            document.body.style.overflow = '';
        }
    };

    mobileBtn.addEventListener('click', () => toggleDrawer(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleDrawer(false));
    overlay.addEventListener('click', () => toggleDrawer(false));
}
