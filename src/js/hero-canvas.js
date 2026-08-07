const container = document.getElementById('hero-canvas');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (container && !reducedMotion && window.innerWidth > 768) {
    (async () => {
        try {
            const THREE = await import('three');
            const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        const count = 220;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const gold = new THREE.Color('#D4AF37');
        const soft = new THREE.Color('#8a6d1f');
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 18;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
            const c = Math.random() > 0.5 ? gold : soft;
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const mat = new THREE.PointsMaterial({
            size: 0.045,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const points = new THREE.Points(geo, mat);
        group.add(points);

        const ringMat = new THREE.MeshBasicMaterial({ color: '#D4AF37', transparent: true, opacity: 0.22 });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.008, 16, 120), ringMat);
        ring.rotation.x = Math.PI / 2.2;
        group.add(ring);

        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.5, 0.006, 16, 120), new THREE.MeshBasicMaterial({ color: '#D4AF37', transparent: true, opacity: 0.1 }));
        ring2.rotation.x = Math.PI / 1.8;
        ring2.rotation.y = 0.4;
        group.add(ring2);

        const onResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', onResize);

        let mouseX = 0;
        let mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });

            const startTime = performance.now();
            const animate = () => {
                requestAnimationFrame(animate);
                const t = (performance.now() - startTime) / 1000;
                points.rotation.y = t * 0.03;
                points.rotation.x = t * 0.015;
                ring.rotation.z = t * 0.1;
                ring2.rotation.z = -t * 0.08;
                group.rotation.y += (mouseX * 0.15 - group.rotation.y) * 0.05;
                group.rotation.x += (mouseY * 0.1 - group.rotation.x) * 0.05;
                renderer.render(scene, camera);
            };
            animate();
        } catch (err) {
            console.warn('Hero canvas disabled:', err);
        }
    })();
}
