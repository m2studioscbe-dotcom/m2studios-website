import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const hero = document.querySelector('[data-m3-hero]');
if (!hero) throw new Error('M² spatial hero root not found');

document.documentElement.classList.add('v3-enhanced');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const copies = [...hero.querySelectorAll('[data-m3-copy]')];
const progress = hero.querySelector('[data-m3-progress]');
const stageNames = ['intro', 'movement', 'moment', 'intent'];

const setStage = (name) => {
  copies.forEach((copy) => {
    const active = copy.dataset.m3Copy === name || (reducedMotion && copy.dataset.m3Copy === 'intent');
    copy.classList.toggle('is-active', active);
    copy.setAttribute('aria-hidden', String(!active));
  });
};

if (reducedMotion) {
  hero.querySelector('[data-m3-copy="intro"]')?.classList.add('is-active');
  const intent = hero.querySelector('[data-m3-copy="intent"]');
  intent?.classList.add('is-active');
  intent?.setAttribute('aria-hidden', 'false');
} else {
  const stageForProgress = (value) => {
    if (value < .21) return stageNames[0];
    if (value < .48) return stageNames[1];
    if (value < .73) return stageNames[2];
    return stageNames[3];
  };

  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate: ({ progress: value }) => {
      setStage(stageForProgress(value));
      if (progress) progress.style.width = `${value * 100}%`;
    },
  });
}

const worldMedia = [...document.querySelectorAll('[data-m3-world-media]')];
const worldMotion = gsap.matchMedia();
worldMotion.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
  worldMedia.forEach((media) => {
    const primary = media.querySelector('.m3-world-frame--primary img');
    const secondary = media.querySelector('.m3-world-frame--secondary');
    gsap.fromTo(primary, { scale: 1.08 }, {
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: media.closest('.m3-world'), start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
    gsap.fromTo(secondary, { yPercent: 22, rotate: -2 }, {
      yPercent: -18,
      rotate: 2,
      ease: 'none',
      scrollTrigger: { trigger: media.closest('.m3-world'), start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  });
});

if (!reducedMotion) {
  const canvasHost = hero.querySelector('[data-m3-canvas]');

  (async () => {
    try {
      const THREE = await import('three');
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x030304, 0.055);

      const camera = new THREE.PerspectiveCamera(43, 1, .1, 100);
      camera.position.set(0, 0, 12);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.75));
      renderer.setClearColor(0x030304, 1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      canvasHost.append(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffeed0, .42));
      const key = new THREE.DirectionalLight(0xffd58d, 4.4);
      key.position.set(-4, 6, 7);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x7680ff, 3.2);
      rim.position.set(6, 2, -4);
      scene.add(rim);

      const monogram = new THREE.Group();
      const gold = new THREE.MeshStandardMaterial({ color: 0xc89e50, metalness: .84, roughness: .24 });
      const darkGold = new THREE.MeshStandardMaterial({ color: 0x4b3418, metalness: .9, roughness: .31 });
      const makeBar = (width, height, depth, x, y, rotation = 0, material = gold) => {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth, 2, 2, 2), material);
        bar.position.set(x, y, 0);
        bar.rotation.z = rotation;
        monogram.add(bar);
        return bar;
      };
      makeBar(.38, 3.9, .58, -1.55, 0, 0, darkGold);
      makeBar(.38, 3.9, .58, 1.55, 0, 0, darkGold);
      makeBar(.4, 2.55, .62, -.77, .55, -.58);
      makeBar(.4, 2.55, .62, .77, .55, .58);
      const superscript = new THREE.Group();
      const segment = (w, h, x, y, r = 0) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, .48), gold);
        mesh.position.set(x, y, 0);
        mesh.rotation.z = r;
        superscript.add(mesh);
      };
      segment(.86, .17, 0, .58);
      segment(.17, .65, .34, .3, -.35);
      segment(.82, .17, 0, 0);
      segment(.17, .65, -.34, -.3, -.35);
      segment(.86, .17, 0, -.58);
      superscript.position.set(2.2, 1.25, .05);
      superscript.scale.setScalar(.78);
      monogram.add(superscript);
      monogram.rotation.set(-.1, -.2, 0);
      scene.add(monogram);

      const textureLoader = new THREE.TextureLoader();
      const loadPlane = async (src, aspect, x, rotation) => {
        const texture = await textureLoader.loadAsync(src);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        const height = 4.5;
        const width = height * aspect;
        const frame = new THREE.Mesh(new THREE.PlaneGeometry(width + .16, height + .16), new THREE.MeshStandardMaterial({ color: 0xa97e35, metalness: .8, roughness: .35 }));
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0 }));
        frame.position.z = -.05;
        plane.add(frame);
        plane.position.set(x, 0, -4);
        plane.rotation.y = rotation;
        scene.add(plane);
        return plane;
      };

      const [movementPlane, momentPlane] = await Promise.all([
        loadPlane('/images/work/movementz-performances-009-00m36s000-desktop-hero.jpg', 16 / 10, -7.4, .34),
        loadPlane('/images/work/momentz-prewedding-couple-crop.webp', 1.45, 7.4, -.34),
      ]);

      const dustGeometry = new THREE.BufferGeometry();
      const count = window.innerWidth < 768 ? 90 : 180;
      const points = new Float32Array(count * 3);
      for (let index = 0; index < count; index += 1) {
        points[index * 3] = (Math.random() - .5) * 20;
        points[index * 3 + 1] = (Math.random() - .5) * 11;
        points[index * 3 + 2] = (Math.random() - .5) * 8;
      }
      dustGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
      const dustMaterial = new THREE.PointsMaterial({ size: .025, color: 0xd8b46c, transparent: true, opacity: .5, depthWrite: false });
      const dust = new THREE.Points(dustGeometry, dustMaterial);
      scene.add(dust);

      const resize = () => {
        const width = canvasHost.clientWidth || 1;
        const height = canvasHost.clientHeight || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        render();
      };
      const render = () => {
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      resize();
      document.documentElement.classList.add('m3-webgl-ready');

      const spatialTimeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.15,
          onUpdate: render,
        },
        onUpdate: render,
      });
      spatialTimeline
        .to(monogram.rotation, { y: .48, x: -.04, duration: .22 }, 0)
        .to(monogram.scale, { x: .76, y: .76, z: .76, duration: .2 }, .16)
        .to(monogram.position, { x: 2.8, z: -1.5, duration: .22 }, .16)
        .to(movementPlane.position, { x: -2.1, z: 0, duration: .24 }, .16)
        .to(movementPlane.material, { opacity: 1, duration: .1 }, .16)
        .to(camera.position, { x: -1.15, z: 10.4, duration: .25 }, .18)
        .to(movementPlane.position, { x: -5.6, z: -2.5, duration: .23 }, .43)
        .to(movementPlane.material, { opacity: .36, duration: .12 }, .45)
        .to(monogram.position, { x: -2.8, z: -1.5, duration: .2 }, .45)
        .to(momentPlane.position, { x: 2.15, z: .1, duration: .24 }, .45)
        .to(momentPlane.material, { opacity: 1, duration: .1 }, .45)
        .to(camera.position, { x: 1.1, z: 10.2, duration: .24 }, .45)
        .to(momentPlane.position, { x: 3.9, z: -2.5, duration: .2 }, .7)
        .to(movementPlane.position, { x: -3.9, z: -2.5, duration: .2 }, .7)
        .to(momentPlane.material, { opacity: .6, duration: .15 }, .7)
        .to(movementPlane.material, { opacity: .6, duration: .15 }, .7)
        .to(monogram.position, { x: 0, y: 1.3, z: -3.2, duration: .2 }, .7)
        .to(monogram.rotation, { y: -.18, z: 0, duration: .2 }, .7)
        .to(camera.position, { x: 0, z: 11.5, duration: .2 }, .7)
        .to(dust.rotation, { y: .8, duration: 1 }, 0);

      const pointer = { x: 0, y: 0 };
      const onPointer = (event) => {
        const bounds = hero.getBoundingClientRect();
        pointer.x = ((event.clientX - bounds.left) / bounds.width - .5) * .18;
        pointer.y = ((event.clientY - bounds.top) / bounds.height - .5) * .12;
        scene.rotation.y = pointer.x;
        scene.rotation.x = -pointer.y;
        render();
      };
      if (window.matchMedia('(pointer: fine)').matches) hero.addEventListener('pointermove', onPointer, { passive: true });
      window.addEventListener('resize', resize);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });

      window.addEventListener('pagehide', () => {
        spatialTimeline.scrollTrigger?.kill();
        spatialTimeline.kill();
        window.removeEventListener('resize', resize);
        hero.removeEventListener('pointermove', onPointer);
        movementPlane.material.map?.dispose();
        movementPlane.material.dispose();
        movementPlane.geometry.dispose();
        momentPlane.material.map?.dispose();
        momentPlane.material.dispose();
        momentPlane.geometry.dispose();
        dustGeometry.dispose();
        dustMaterial.dispose();
        renderer.dispose();
      }, { once: true });
    } catch (error) {
      console.warn('M² spatial scene unavailable; layered fallback retained.', error);
    }
  })();
}
