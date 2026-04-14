/**
 * Disilia – hero_animation.js
 * Linear gradient silhouettes (THREE.LineLoop) for the Home Page.
 */

(function () {
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const W = canvas.parentElement.clientWidth || 620;
    const H = Math.min(640, canvas.parentElement.clientHeight || 640);
    canvas.width = W; canvas.height = H;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 200);
    camera.position.z = 28;

    /* ── Color helpers ───────────────────────────────────────────── */
    function h2rgb(hex) { const c = new THREE.Color(hex); return [c.r, c.g, c.b]; }
    function lerp3(a, b, t) {
        return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    }
    function multiLerp(stops, t) {
        const n = stops.length - 1;
        const i = Math.min(Math.floor(t * n), n - 1);
        return lerp3(stops[i], stops[i + 1], t * n - i);
    }

    /* ── Shared line material ────────────────────────────────────── */
    const LINE_MAT = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.90 });

    /* ── Build BufferGeometry with gradient vertex colours ───────── */
    function buildGeo(pts, stops) {
        const n = pts.length;
        const pos = new Float32Array(n * 3);
        const col = new Float32Array(n * 3);
        pts.forEach((p, i) => {
            const t = i / Math.max(n - 1, 1);
            pos[i * 3] = p.x !== undefined ? p.x : p[0];
            pos[i * 3 + 1] = p.y !== undefined ? p.y : p[1];
            pos[i * 3 + 2] = 0;
            const rgb = multiLerp(stops, t);
            col[i * 3] = rgb[0]; col[i * 3 + 1] = rgb[1]; col[i * 3 + 2] = rgb[2];
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
        return geo;
    }

    /* ── Shape → LineLoop ────────────────────────────────────────── */
    function lineLoop(shape, n, stops) {
        return new THREE.LineLoop(buildGeo(shape.getPoints(n), stops), LINE_MAT);
    }

    /* ── Pill capsule outline points ─────────────────────────────── */
    function pillPts(hl, r, arcN, cx, cy, angle) {
        const pts = [], ca = Math.cos(angle), sa = Math.sin(angle);
        function add(lx, ly) { pts.push({ x: cx + lx * ca - ly * sa, y: cy + lx * sa + ly * ca }); }
        const sN = Math.max(4, Math.round(hl / r * arcN));
        for (let i = 0; i <= arcN; i++) { const a = -Math.PI / 2 + Math.PI * i / arcN; add(hl + r * Math.cos(a), r * Math.sin(a)); }
        for (let i = 1; i <= sN; i++) add(hl - 2 * hl * i / sN, r);
        for (let i = 1; i <= arcN; i++) { const a = Math.PI / 2 + Math.PI * i / arcN; add(-hl + r * Math.cos(a), r * Math.sin(a)); }
        for (let i = 1; i <= sN; i++) add(-hl + 2 * hl * i / sN, -r);
        return pts;
    }

    /* ── Circle outline ──────────────────────────────────────────── */
    function circlePts(cx, cy, r, n) {
        const pts = [];
        for (let i = 0; i <= n; i++) { const a = 2 * Math.PI * i / n; pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }); }
        return pts;
    }

    /* ── Bumpy circle (leaf crown) ───────────────────────────────── */
    function bumpyCircle(cx, cy, baseR, amp, freq, n) {
        const pts = [];
        for (let i = 0; i <= n; i++) {
            const a = 2 * Math.PI * i / n;
            const r = baseR + amp * Math.sin(freq * a + 0.9) + amp * 0.4 * Math.sin(freq * 1.7 * a);
            pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
        }
        return pts;
    }

    /* ── Diamond ─────────────────────────────────────────────────── */
    function diamondPts(cx, cy, w, h) {
        return [{ x: cx, y: cy + h }, { x: cx + w, y: cy }, { x: cx, y: cy - h }, { x: cx - w, y: cy }, { x: cx, y: cy + h }];
    }

    const group = new THREE.Group();
    scene.add(group);

    /* ══ 1. SHIRT  top-left  — Orange → Rose → Violet ══════════════ */
    const shirtS = new THREE.Shape();
    shirtS.moveTo(0.0, 2.8); shirtS.lineTo(-0.8, 3.6); shirtS.lineTo(-3.0, 3.3);
    shirtS.lineTo(-5.2, 2.3); shirtS.lineTo(-5.2, 1.1); shirtS.lineTo(-2.7, 2.0);
    shirtS.lineTo(-2.3, -3.6); shirtS.lineTo(2.3, -3.6); shirtS.lineTo(2.7, 2.0);
    shirtS.lineTo(5.2, 1.1); shirtS.lineTo(5.2, 2.3); shirtS.lineTo(3.0, 3.3);
    shirtS.lineTo(0.8, 3.6); shirtS.lineTo(0.0, 2.8);

    const shirtMesh = lineLoop(shirtS, 180, [h2rgb('#ff6b35'), h2rgb('#ff3d7f'), h2rgb('#a855f7')]);
    shirtMesh.position.set(-5.2, 7.5, 0);
    shirtMesh.scale.setScalar(0.60);
    group.add(shirtMesh);

    /* ══ 2. PILLS  top-right — Cyan → Indigo → Violet ══════════════ */
    const pillGrad = [h2rgb('#00d4ff'), h2rgb('#818cf8'), h2rgb('#7c3aed')];
    const pillsGroup = new THREE.Group();
    pillsGroup.add(new THREE.LineLoop(buildGeo(pillPts(2.5, 1.0, 32, 0.0, 0.5, 0), pillGrad), LINE_MAT));
    pillsGroup.add(new THREE.LineLoop(buildGeo(pillPts(1.6, 0.6, 24, 0.3, -2.2, 0.60), pillGrad), LINE_MAT));
    pillsGroup.add(new THREE.LineLoop(buildGeo(pillPts(1.0, 0.4, 18, -1.8, 2.5, -0.45), pillGrad), LINE_MAT));
    pillsGroup.add(new THREE.LineLoop(buildGeo(circlePts(1.8, 2.7, 0.85, 40), pillGrad), LINE_MAT));
    pillsGroup.add(new THREE.LineLoop(buildGeo(circlePts(-0.5, 3.5, 0.65, 32), pillGrad), LINE_MAT));
    pillsGroup.position.set(4.8, 7.5, 0);
    pillsGroup.scale.setScalar(0.68);
    group.add(pillsGroup);

    /* ══ 3. DOG  centre-right — Amber → Orange → Red ═══════════════ */
    const dogS = new THREE.Shape();
    dogS.moveTo(4.5, 1.6);
    dogS.bezierCurveTo(4.8, 2.4, 4.5, 3.2, 3.8, 3.6);
    dogS.bezierCurveTo(3.2, 4.2, 2.8, 4.4, 2.6, 4.2);
    dogS.lineTo(2.8, 5.4); dogS.lineTo(2.0, 4.0);
    dogS.bezierCurveTo(1.4, 4.2, 0.8, 3.8, 0.5, 3.2);
    dogS.bezierCurveTo(0.1, 3.5, -1.5, 3.6, -3.2, 3.2);
    dogS.bezierCurveTo(-4.0, 3.0, -4.6, 2.4, -4.8, 1.8);
    dogS.bezierCurveTo(-5.4, 1.0, -5.6, -0.2, -4.6, -0.5);
    dogS.bezierCurveTo(-4.0, -0.6, -3.6, -0.5, -3.4, -0.4);
    dogS.lineTo(-3.2, -3.5); dogS.lineTo(-2.0, -3.5); dogS.lineTo(-2.0, -0.8);
    dogS.bezierCurveTo(-1.4, -1.3, -0.2, -1.5, 0.6, -1.2);
    dogS.lineTo(0.8, -3.5); dogS.lineTo(1.8, -3.5); dogS.lineTo(1.8, -0.8);
    dogS.bezierCurveTo(2.2, -0.2, 3.0, 0.6, 3.4, 0.9);
    dogS.bezierCurveTo(3.8, 1.0, 4.2, 1.2, 4.4, 1.4);
    dogS.lineTo(4.5, 1.6);

    const dogMesh = lineLoop(dogS, 260, [h2rgb('#fbbf24'), h2rgb('#f97316'), h2rgb('#ef4444')]);
    dogMesh.position.set(4.5, 0.5, 0);
    dogMesh.scale.setScalar(0.65);
    group.add(dogMesh);

    /* ══ 4. SOFA  bottom-centre — Indigo → Violet → Pink ═══════════ */
    const sofaS = new THREE.Shape();
    sofaS.moveTo(-4.2, 4.0); sofaS.lineTo(4.2, 4.0); sofaS.lineTo(4.2, 1.2);
    sofaS.lineTo(5.6, 1.2); sofaS.lineTo(5.6, -1.6); sofaS.lineTo(4.2, -1.6);
    sofaS.lineTo(4.2, -2.8); sofaS.lineTo(3.2, -2.8); sofaS.lineTo(3.2, -4.6);
    sofaS.lineTo(2.2, -4.6); sofaS.lineTo(2.2, -2.8); sofaS.lineTo(-2.2, -2.8);
    sofaS.lineTo(-2.2, -4.6); sofaS.lineTo(-3.2, -4.6); sofaS.lineTo(-3.2, -2.8);
    sofaS.lineTo(-4.2, -2.8); sofaS.lineTo(-4.2, -1.6); sofaS.lineTo(-5.6, -1.6);
    sofaS.lineTo(-5.6, 1.2); sofaS.lineTo(-4.2, 1.2); sofaS.lineTo(-4.2, 4.0);

    const sofaMesh = lineLoop(sofaS, 200, [h2rgb('#6366f1'), h2rgb('#a855f7'), h2rgb('#ec4899')]);
    sofaMesh.position.set(-0.5, -8.0, 0);
    sofaMesh.scale.setScalar(0.55);
    group.add(sofaMesh);

    /* ══ 5. PLANT  centre-left — Lime → Emerald → Cyan ═════════════ */
    const plantGrad = [h2rgb('#4ade80'), h2rgb('#10b981'), h2rgb('#0ea5e9')];
    const plantGroup = new THREE.Group();
    const plantSil = new THREE.Shape();
    plantSil.moveTo(-1.8, -5.2); plantSil.lineTo(1.8, -5.2); plantSil.lineTo(2.4, -2.4);
    plantSil.bezierCurveTo(1.8, -1.6, 0.8, -1.8, 0.5, -1.5); plantSil.lineTo(0.5, -0.5);
    plantSil.bezierCurveTo(2.0, 0.5, 3.8, 2.0, 3.8, 4.5);
    plantSil.bezierCurveTo(3.8, 7.5, 2.0, 8.5, 0.0, 8.5);
    plantSil.bezierCurveTo(-2.0, 8.5, -3.8, 7.5, -3.8, 4.5);
    plantSil.bezierCurveTo(-3.8, 2.0, -2.0, 0.5, -0.5, -0.5); plantSil.lineTo(-0.5, -1.5);
    plantSil.bezierCurveTo(-0.8, -1.8, -1.8, -1.6, -2.4, -2.4); plantSil.lineTo(-1.8, -5.2);

    plantGroup.add(new THREE.LineLoop(buildGeo(plantSil.getPoints(200), plantGrad), LINE_MAT));
    plantGroup.add(new THREE.LineLoop(buildGeo(bumpyCircle(0, 3.8, 3.3, 0.55, 6, 160), plantGrad), LINE_MAT));
    plantGroup.add(new THREE.LineLoop(buildGeo(bumpyCircle(0, 3.8, 1.9, 0.30, 9, 100), plantGrad), LINE_MAT));
    plantGroup.position.set(-5.2, -2.0, 0);
    plantGroup.scale.setScalar(0.56);
    group.add(plantGroup);

    /* ══ ACCENT DECORATIONS — small circles & diamonds ═════════════ */
    const accentDefs = [
        { type: 'circle', cx: 9, cy: 5, r: 0.9, w: 0, h: 0, stops: [h2rgb('#ff6b35'), h2rgb('#f9a8d4')] },
        { type: 'circle', cx: -9, cy: 3, r: 0.6, w: 0, h: 0, stops: [h2rgb('#4ade80'), h2rgb('#0ea5e9')] },
        { type: 'circle', cx: 8, cy: -3, r: 0.5, w: 0, h: 0, stops: [h2rgb('#818cf8'), h2rgb('#ec4899')] },
        { type: 'circle', cx: -7, cy: -7, r: 0.7, w: 0, h: 0, stops: [h2rgb('#fbbf24'), h2rgb('#f97316')] },
        { type: 'diamond', cx: 0, cy: 4.5, r: 0, w: 0.7, h: 0.7, stops: [h2rgb('#a855f7'), h2rgb('#00d4ff')] },
        { type: 'diamond', cx: -8, cy: 8.5, r: 0, w: 0.5, h: 0.5, stops: [h2rgb('#4ade80'), h2rgb('#f9a8d4')] },
        { type: 'diamond', cx: 7, cy: -9, r: 0, w: 0.6, h: 0.6, stops: [h2rgb('#ff6b35'), h2rgb('#818cf8')] },
    ];
    const accentMeshes = [];
    accentDefs.forEach(d => {
        const pts = d.type === 'circle' ? circlePts(d.cx, d.cy, d.r, 48) : diamondPts(d.cx, d.cy, d.w, d.h);
        const mesh = new THREE.LineLoop(buildGeo(pts, d.stops), LINE_MAT);
        accentMeshes.push(mesh);
        group.add(mesh);
    });

    /* ── Mouse parallax ───────────────────────────────────────────── */
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mx = e.clientX - r.left - r.width / 2;
        my = e.clientY - r.top - r.height / 2;
    });

    /* ── Animate ──────────────────────────────────────────────────── */
    const clock = new THREE.Clock();
    function tick() {
        const t = clock.getElapsedTime();

        shirtMesh.position.y = 7.5 + Math.sin(t * 0.50 + 0.0) * 0.35;
        pillsGroup.position.y = 7.5 + Math.sin(t * 0.46 + 1.2) * 0.32;
        dogMesh.position.y = 0.5 + Math.sin(t * 0.54 + 2.4) * 0.38;
        sofaMesh.position.y = -8.0 + Math.sin(t * 0.42 + 0.8) * 0.30;
        plantGroup.position.y = -2.0 + Math.sin(t * 0.48 + 1.6) * 0.36;

        shirtMesh.rotation.z = Math.sin(t * 0.18) * 0.04;
        pillsGroup.rotation.z = Math.sin(t * 0.16 + 1.0) * 0.03;
        dogMesh.rotation.z = Math.sin(t * 0.14 + 0.5) * 0.04;
        sofaMesh.rotation.z = Math.sin(t * 0.12 + 2.0) * 0.025;
        plantGroup.rotation.z = Math.sin(t * 0.19 + 1.4) * 0.04;

        accentMeshes.forEach((m, i) => { m.rotation.z = t * (0.10 + i * 0.03) * (i % 2 === 0 ? 1 : -1); });

        const tx = mx * 0.0006, ty = my * 0.0006;
        group.rotation.y += 0.04 * (tx - group.rotation.y);
        group.rotation.x += 0.04 * (ty - group.rotation.x);

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
    tick();

    window.addEventListener('resize', () => {
        const cw = canvas.parentElement.clientWidth || W;
        const ch = Math.min(640, canvas.parentElement.clientHeight || H);
        renderer.setSize(cw, ch);
        camera.aspect = cw / ch;
        camera.updateProjectionMatrix();
    });
})();

/**
 * Featured Products Carousel
 */
(function () {
    const track   = document.getElementById('carousel-track');
    const btnPrev = document.getElementById('carousel-prev');
    const btnNext = document.getElementById('carousel-next');
    if (!track || !btnPrev || !btnNext) return;

    const cardW   = () => {
        const card = track.querySelector('a,div');
        return card ? card.offsetWidth + 24 : 284;
    };
    let current = 0;
    const maxIdx = () => Math.max(0, track.children.length - 4);

    function slide() {
        track.style.transform = `translateX(-${current * cardW()}px)`;
    }

    btnNext.addEventListener('click', () => {
        current = Math.min(current + 1, maxIdx());
        slide();
    });
    btnPrev.addEventListener('click', () => {
        current = Math.max(current - 1, 0);
        slide();
    });
})();
