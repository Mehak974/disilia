/**
 * Disilia – category_animation.js
 * Dynamic 3D shapes for category headers.
 */

window.initCategoryAnimation = function (config) {
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('cat-canvas');
    if (!canvas) return;

    const W = canvas.clientWidth || window.innerWidth;
    const H = canvas.clientHeight || 380;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    camera.position.z = 28;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    /* Factory for Category-Specific Shapes */
    function getShapeForCategory(slug, col1) {
        const group = new THREE.Group();
        const mat = new THREE.MeshBasicMaterial({ color: col1, wireframe: true, transparent: true, opacity: 0.8 });

        if (slug === 'health-supplements') {
            const cyl = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3.5, 12), mat);
            const top = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 12), mat);
            const bot = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 12), mat);
            top.position.y = 1.75; bot.position.y = -1.75;
            group.add(cyl, top, bot);
        }
        else if (slug === 'pet-care') {
            const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 3, 8), mat);
            cyl.rotation.z = Math.PI / 2;
            const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), mat);
            const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), mat);
            const s1p = s1.clone(); const s2p = s2.clone();
            const s3p = s1.clone(); const s4p = s2.clone();
            s1p.position.set(-1.5, 0.6, 0); s2p.position.set(-1.5, -0.6, 0);
            s3p.position.set(1.5, 0.6, 0); s4p.position.set(1.5, -0.6, 0);
            group.add(cyl, s1p, s2p, s3p, s4p);
        }
        else if (slug === 'home-garden') {
            const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.5, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat);
            const cone = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3, 12), mat);
            cone.position.y = 1.5;
            group.add(sphere, cone);
            group.rotation.x = Math.PI;
        }
        else if (slug === 'beauty-personal-care') {
            const d1 = new THREE.Mesh(new THREE.ConeGeometry(1.8, 3, 4), mat);
            const d2 = new THREE.Mesh(new THREE.ConeGeometry(1.8, 3, 4), mat);
            d2.rotation.x = Math.PI;
            group.add(d1, d2);
        }
        else if (slug === 'tools') {
            const nut = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 1, 6), mat);
            const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.1, 12), mat);
            group.add(nut, hole);
        }
        else {
            const box = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 2.5), mat);
            group.add(box);
        }
        return group;
    }

    const catSlug = config.slug;
    const shapes = [];
    const colorMap = ['#c9873c', '#9e6a2b', '#ffffff'];

    for (let i = 0; i < 6; i++) {
        const col = colorMap[i % colorMap.length];
        const mesh = getShapeForCategory(catSlug, col);
        const sObj = {
            mesh,
            x: (Math.random() - 0.5) * 40 + 10,
            y: (Math.random() - 0.5) * 15,
            z: (Math.random() - 0.5) * 10,
            spd: (Math.random() - 0.5) * 0.8
        };
        sObj.mesh.position.set(sObj.x, sObj.y, sObj.z);
        scene.add(sObj.mesh);
        shapes.push(sObj);
    }

    const clock = new THREE.Clock();
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    (function tick() {
        const t = clock.getElapsedTime();
        shapes.forEach(s => {
            s.mesh.rotation.z = t * s.spd * 0.5;
            s.mesh.position.x += (s.x + mx * 1.5 - s.mesh.position.x) * 0.02;
            s.mesh.position.y += (s.y - my * 1.0 - s.mesh.position.y) * 0.02;
        });
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    })();

    window.addEventListener('resize', () => {
        const w = canvas.clientWidth, h = canvas.clientHeight || 380;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }, { passive: true });

};

/* Mini carousel logic for categories */
window.initProductCarousel = function() {
    const msTrack = document.getElementById('ms-track');
    const msPrev = document.getElementById('ms-prev');
    const msNext = document.getElementById('ms-next');
    if (msTrack && msPrev && msNext) {
        let cur = 0;
        const cw = () => { const c = msTrack.children[0]; return c ? c.offsetWidth + 20 : 260; };
        const max = () => Math.max(0, msTrack.children.length - 4);
        msNext.onclick = () => { cur = Math.min(cur + 1, max()); msTrack.style.transform = `translateX(-${cur * cw()}px)`; };
        msPrev.onclick = () => { cur = Math.max(cur - 1, 0); msTrack.style.transform = `translateX(-${cur * cw()}px)`; };
    }
};

