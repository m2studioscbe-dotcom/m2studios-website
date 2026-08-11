(async () => {
  const container = document.getElementById('showcase3d');
  if (!container) return;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth < 768;
const motion = reducedMotion ? 0 : 1;

(async () => {
  try {
    const THREE = await import('three');
    const images = (container.dataset.images || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (!images.length) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden', 'true');

    const group = new THREE.Group();
    scene.add(group);

    const texLoader = new THREE.TextureLoader();
    const planes = [];
    const RADIUS = 6.8;
    const angleStep = (Math.PI * 2) / images.length;
    const baseW = 3.1;
    const frameMat = new THREE.MeshBasicMaterial({
      color: '#D4AF37', transparent: true, opacity: 0.25,
      side: THREE.DoubleSide, depthWrite: false,
    });

    images.forEach((src, i) => {
      texLoader.load(src, (tex) => {
        const aspect = tex.image.width / tex.image.height;
        const w = baseW * Math.min(aspect, 1.2);
        const h = w / aspect;
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(w, h),
          new THREE.MeshBasicMaterial({ map: tex, transparent: true }),
        );
        const frame = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.08, h + 0.08), frameMat);
        frame.position.z = -0.02;
        mesh.add(frame);

        const angle = angleStep * i;
        mesh.position.x = Math.sin(angle) * RADIUS;
        mesh.position.z = Math.cos(angle) * RADIUS;
        mesh.rotation.y = angle * 0;
        mesh.userData = {
          angle,
          baseY: Math.sin(i * 1.7) * 0.4,
          phase: i * 0.9,
        };
        group.add(mesh);
        planes.push(mesh);
      }, undefined, () => {});
    });

    const pCount = isMobile ? 250 : 550;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 24;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.05, color: '#D4AF37', transparent: true, opacity: 0.7,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    const onResize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    onResize();
    window.addEventListener('resize', onResize);

    let mouseX = 0, mouseY = 0;
    container.addEventListener('mousemove', (e) => {
      const r = container.getBoundingClientRect();
      mouseX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouseY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    }, { passive: true });

    let inView = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }, { rootMargin: '200px' }).observe(container);
    }

    let camY = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      if (!inView) return;
      const t = performance.now() / 1000;

      const targetY = t * 0.06 * motion + mouseX * 0.55;
      group.rotation.y += (targetY - group.rotation.y) * 0.04;
      group.rotation.x += (mouseY * 0.12 - group.rotation.x) * 0.04;

      planes.forEach((m) => {
        m.position.y = m.userData.baseY + Math.sin(t * 0.7 + m.userData.phase) * 0.35 * motion;
        m.rotation.y = -m.position.x / 8;
      });

      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      const targetCamY = (0.5 - p) * 2.2;
      camY += (targetCamY - camY) * 0.05;
      camera.position.y = camY;

      points.rotation.y = t * 0.02 * motion;
      points.rotation.x = Math.sin(t * 0.1) * 0.1 * motion;

      renderer.render(scene, camera);
    };
    animate();
  } catch (err) {
    console.warn('3D showcase disabled:', err);
  }
})();
})();
