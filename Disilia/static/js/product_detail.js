/**
 * Disilia – product_detail.js
 * Immersive 3D product preview, carousel, and tilt interactions.
 */

function initProductDetail() {
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('pd-canvas');
    if (!canvas) return;

    const W = canvas.clientWidth || 600, H = canvas.clientHeight || 480;
    const scene  = new THREE.Scene();
    const cam    = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    cam.position.z = 22;
    const ren = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    ren.setSize(W, H);
    ren.setPixelRatio(Math.min(devicePixelRatio, 2));
    ren.setClearColor(0x000000, 0);

    function ring(r, segs, c1, c2) {
        const pts = [], cols = [];
        for (let i = 0; i <= segs; i++) {
            const a = i / segs * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
            const t = i / segs;
            const C1 = new THREE.Color(c1), C2 = new THREE.Color(c2);
            cols.push(C1.lerp(C2, t).r, C1.lerp(C2, t).g, C1.lerp(C2, t).b);
        }
        const g = new THREE.BufferGeometry().setFromPoints(pts);
        g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
        return new THREE.LineLoop(g, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5 }));
    }

    const meshes = [
        { m: ring(6, 64, '#c9873c', '#f0c07a'), sx: 0.3,  sy: 0.2 },
        { m: ring(4, 6,  '#9e6a2b', '#c9873c'), sx: -0.2, sy: 0.3 },
        { m: ring(2.5, 64, '#f0c07a', '#c9873c'), sx: 0.4, sy: -0.2 },
    ];
    meshes.forEach(({ m }) => scene.add(m));

    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
        mx = e.clientX / window.innerWidth - 0.5;
        my = e.clientY / window.innerHeight - 0.5;
    });

    const clock = new THREE.Clock();
    (function tick() {
        if (!document.getElementById('pd-canvas')) return; // Stop if navigate away
        const t = clock.getElapsedTime();
        meshes.forEach(({ m, sx, sy }, i) => {
            m.rotation.z = t * (0.3 + i * 0.1);
            m.position.x = sx * 8 + mx * 2;
            m.position.y = sy * 8 - my * 2;
        });
        ren.render(scene, cam);
        requestAnimationFrame(tick);
    })();

    /* Similar products carousel */
    const simTrack = document.getElementById('sim-track');
    if (simTrack) {
        let cur2 = 0;
        const cw2 = () => { const c = simTrack.children[0]; return c ? c.offsetWidth + 20 : 260; };
        const max2 = () => Math.max(0, simTrack.children.length - 4);
        document.getElementById('sim-next').onclick = () => { cur2 = Math.min(cur2+1, max2()); simTrack.style.transform = `translateX(-${cur2*cw2()}px)`; };
        document.getElementById('sim-prev').onclick = () => { cur2 = Math.max(cur2-1, 0);     simTrack.style.transform = `translateX(-${cur2*cw2()}px)`; };
    }

    /* Qty buttons */
    const qInput = document.getElementById('qty-input');
    document.getElementById('qty-inc')?.addEventListener('click', () => qInput && (qInput.value = Math.min(+qInput.value + 1, +qInput.max)));
    document.getElementById('qty-dec')?.addEventListener('click', () => qInput && (qInput.value = Math.max(+qInput.value - 1, 1)));

    /* 3D Mouse Tilt */
    const card = document.querySelector('.tilt-card');
    if (card && typeof gsap !== 'undefined') {
        card.parentElement.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, {
                rotationY: x * 15,
                rotationX: -y * 15,
                ease: 'power2.out',
                duration: 0.6
            });
        });
        card.parentElement.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationY: 0, rotationX: 0, ease: 'power2.out', duration: 0.8 });
        });
    }
}

// Auto-init if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductDetail);
} else {
    initProductDetail();
}
