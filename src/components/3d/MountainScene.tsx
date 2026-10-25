import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface MountainSceneProps {
  onLoaded?: () => void;
}

export const MountainScene: React.FC<MountainSceneProps> = ({ onLoaded }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const beaconRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  // References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Mouse & Camera Parallax state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const currentPosRef = useRef(new THREE.Vector3(0, 0, 18.0));
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, -45.0));
  const introProgressRef = useRef(0.0);

  // Check WebGL
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
      }
    } catch {
      setWebGlSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!webGlSupported || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#061428');

    // 2. Camera: Centered perspective framing with 3D parallax depth
    const fov = 48;
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 800);
    cameraRef.current = camera;
    camera.position.set(0, 0, 18.0);
    camera.lookAt(0, 0, -45.0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    container.appendChild(renderer.domElement);

    // 4. Photorealistic 3D Himalayan Mountain Environment Plane
    const textureLoader = new THREE.TextureLoader();
    const mountainTexture = textureLoader.load(
      '/assets/himalayan_real_peak.jpg',
      () => {
        onLoaded?.();
      }
    );
    mountainTexture.generateMipmaps = true;
    mountainTexture.minFilter = THREE.LinearMipmapLinearFilter;
    mountainTexture.magFilter = THREE.LinearFilter;

    // Calculate plane dimensions at depth Z = -45 to perfectly fill and extend beyond frustum for parallax
    const distToPlane = 18.0 - (-45.0); // 63.0 units
    const vFovRad = (fov * Math.PI) / 180;
    const planeHeight = 2.0 * distToPlane * Math.tan(vFovRad / 2.0) * 1.14;
    const planeWidth = planeHeight * (16 / 9) * 1.08;

    const mountainGeo = new THREE.PlaneGeometry(planeWidth, planeHeight, 64, 48);
    // Subtle cylindrical curvature for peripheral immersion
    const posAttr = mountainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const curve = (x * x) / (planeWidth * 4.5);
      posAttr.setZ(i, -curve);
    }
    mountainGeo.computeVertexNormals();

    const mountainMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec2 vUv;
        varying vec3 vWorldPosition;

        void main() {
          vec2 uv = vUv;

          // High-altitude subtle atmospheric light breathing
          vec4 photo = texture2D(uTexture, uv);

          // Subtle sunlit warmth on summit peak (UV x: 0.65 to 0.85, y: 0.65 to 0.95)
          float summitDist = distance(uv, vec2(0.74, 0.78));
          float summitGlow = smoothstep(0.28, 0.0, summitDist);
          vec3 sunWarmth = vec3(1.05, 1.02, 0.98);

          // Interactive soft mouse lighting response
          float mouseLight = max(0.0, 1.0 - distance(uv, uMouse * 0.5 + 0.5) * 1.2);
          vec3 finalColor = photo.rgb * mix(vec3(1.0), sunWarmth, summitGlow * 0.15) + (mouseLight * 0.035 * vec3(0.95, 0.98, 1.0));

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      uniforms: {
        uTexture: { value: mountainTexture },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      depthWrite: true,
    });

    const mountainMesh = new THREE.Mesh(mountainGeo, mountainMat);
    mountainMesh.position.set(0, 0.5, -45.0);
    scene.add(mountainMesh);

    // 5. Living 3D Himalayan Breeze: Summit Spindrift Wind Banner
    // Creates glistening wind-blown snow plumes streaming from the golden summit ridge
    const spindriftCount = 420;
    const spindriftGeo = new THREE.BufferGeometry();
    const spindriftPos = new Float32Array(spindriftCount * 3);
    const spindriftVel = new Float32Array(spindriftCount * 3);
    const spindriftLifetimes = new Float32Array(spindriftCount);

    // Summit coordinates in 3D world space corresponding to the sharp golden peak
    const summitX = planeWidth * (0.745 - 0.5);
    const summitY = planeHeight * (0.785 - 0.5) + 0.5;
    const summitZ = -44.0;

    const resetSpindrift = (i: number, randomStart: boolean = false) => {
      const offsetX = (Math.random() - 0.5) * 2.6;
      const offsetY = (Math.random() - 0.5) * 2.2;
      const offsetZ = (Math.random() - 0.5) * 2.8;

      const vx = 0.28 + Math.random() * 0.38; // Blowing eastward with the jet stream
      const vy = (Math.random() - 0.35) * 0.08;
      const vz = 0.04 + Math.random() * 0.08;

      spindriftVel[i * 3 + 0] = vx;
      spindriftVel[i * 3 + 1] = vy;
      spindriftVel[i * 3 + 2] = vz;

      spindriftLifetimes[i] = 1.0 + Math.random() * 2.2;

      const progress = randomStart ? Math.random() : 0.0;
      spindriftPos[i * 3 + 0] = summitX + offsetX + vx * progress * 40.0;
      spindriftPos[i * 3 + 1] = summitY + offsetY + vy * progress * 40.0;
      spindriftPos[i * 3 + 2] = summitZ + offsetZ + vz * progress * 40.0;
    };

    for (let i = 0; i < spindriftCount; i++) {
      resetSpindrift(i, true);
    }

    spindriftGeo.setAttribute('position', new THREE.BufferAttribute(spindriftPos, 3));

    // Particle texture
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.35, 'rgba(255, 250, 240, 0.85)');
      grad.addColorStop(0.7, 'rgba(240, 245, 255, 0.3)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createParticleTexture();

    const spindriftMat = new THREE.PointsMaterial({
      color: 0xFFF8EE, // Golden sunlit snow
      size: 0.95,
      map: particleTexture,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const spindriftPoints = new THREE.Points(spindriftGeo, spindriftMat);
    scene.add(spindriftPoints);

    // 6. Real-Time 3D Alpine Powdered Snow Flurries
    // 550 glistening snow particles drifting across the entire camera frustum with spatial depth
    const snowCount = 550;
    const snowGeo = new THREE.BufferGeometry();
    const snowPos = new Float32Array(snowCount * 3);
    const snowVel = new Float32Array(snowCount * 3);

    for (let i = 0; i < snowCount; i++) {
      snowPos[i * 3 + 0] = (Math.random() - 0.5) * 85.0;
      snowPos[i * 3 + 1] = (Math.random() - 0.5) * 55.0;
      snowPos[i * 3 + 2] = Math.random() * 55.0 - 40.0; // Between Z = -40 and Z = +15

      snowVel[i * 3 + 0] = 0.09 + Math.random() * 0.18; // Wind drifting towards right (+X)
      snowVel[i * 3 + 1] = -0.02 - Math.random() * 0.04; // Settling downwards
      snowVel[i * 3 + 2] = 0.03 + Math.random() * 0.06; // Drifting past camera
    }

    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));

    const snowMat = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.55,
      map: particleTexture,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const snowPoints = new THREE.Points(snowGeo, snowMat);
    scene.add(snowPoints);

    // 7. Ambient Drifting Cloud Wisps across Sea of Clouds
    const cloudTexture = (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      const grad = ctx.createRadialGradient(128, 64, 0, 128, 64, 120);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      grad.addColorStop(0.5, 'rgba(245, 250, 255, 0.25)');
      grad.addColorStop(0.8, 'rgba(240, 245, 255, 0.08)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 128);
      return new THREE.CanvasTexture(canvas);
    })();

    const cloudsGroup = new THREE.Group();
    const cloudWisps: { mesh: THREE.Mesh; speed: number; baseX: number; rangeX: number }[] = [];

    const cloudConfigs = [
      { w: 55, h: 22, x: -15, y: -6, z: -25, opacity: 0.45, speed: 0.012 },
      { w: 65, h: 26, x: 20, y: -8, z: -28, opacity: 0.50, speed: 0.014 },
      { w: 80, h: 30, x: -5, y: -12, z: -20, opacity: 0.38, speed: 0.010 },
      { w: 50, h: 18, x: 28, y: 4, z: -35, opacity: 0.30, speed: 0.016 },
    ];

    for (const conf of cloudConfigs) {
      const geo = new THREE.PlaneGeometry(conf.w, conf.h);
      const mat = new THREE.MeshBasicMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: conf.opacity,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(conf.x, conf.y, conf.z);
      cloudsGroup.add(mesh);
      cloudWisps.push({ mesh, speed: conf.speed, baseX: conf.x, rangeX: conf.w * 0.8 + 25 });
    }
    scene.add(cloudsGroup);

    // 6. Interactive Cursor Wind Sparkles (Antigravity 3D Particle response)
    const cursorSparkleCount = 70;
    const cursorSparkleGeo = new THREE.BufferGeometry();
    const cursorSparklePos = new Float32Array(cursorSparkleCount * 3);
    const cursorSparkleVel = new Float32Array(cursorSparkleCount * 3);

    for (let i = 0; i < cursorSparkleCount; i++) {
      cursorSparklePos[i * 3 + 0] = (Math.random() - 0.5) * 8.0;
      cursorSparklePos[i * 3 + 1] = (Math.random() - 0.5) * 6.0;
      cursorSparklePos[i * 3 + 2] = 2.0 + Math.random() * 8.0;

      cursorSparkleVel[i * 3 + 0] = (Math.random() - 0.5) * 0.05;
      cursorSparkleVel[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      cursorSparkleVel[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }

    cursorSparkleGeo.setAttribute('position', new THREE.BufferAttribute(cursorSparklePos, 3));
    const cursorSparkleMat = new THREE.PointsMaterial({
      color: 0x98d4ff,
      size: 0.24,
      map: particleTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cursorSparklePoints = new THREE.Points(cursorSparkleGeo, cursorSparkleMat);
    scene.add(cursorSparklePoints);

    // Mouse movement handler for parallax
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Window resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Intro exposure ramp
      if (introProgressRef.current < 1.0) {
        introProgressRef.current += delta * 0.8;
        const p = Math.min(introProgressRef.current, 1.0);
        renderer.toneMappingExposure = 0.85 + p * 0.25;
      }

      // Smooth mouse lerping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.045;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.045;

      // Update shader uniforms
      mountainMat.uniforms.uTime.value = elapsedTime;
      mountainMat.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      // Organic camera breathing & smooth mouse parallax in 3D space
      const isMob = window.innerWidth < 768;
      const breezeSwayX = Math.cos(elapsedTime * 0.24) * 0.35;
      const breezeSwayY = Math.sin(elapsedTime * 0.32) * 0.25;

      const targetCamX = breezeSwayX + mouseRef.current.x * (isMob ? 0.8 : 2.2);
      const targetCamY = breezeSwayY + mouseRef.current.y * (isMob ? 0.6 : 1.4);
      const targetCamZ = 18.0;

      currentPosRef.current.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.05);
      camera.position.copy(currentPosRef.current);

      // LookAt target with slight reverse parallax to produce genuine perspective rotation
      const targetLookX = mouseRef.current.x * 0.8;
      const targetLookY = mouseRef.current.y * 0.5;
      currentLookAtRef.current.lerp(new THREE.Vector3(targetLookX, targetLookY, -45.0), 0.05);
      camera.lookAt(currentLookAtRef.current);

      // 1. Update Summit Spindrift Wind Plume (Snow blowing off peak)
      const spPositions = spindriftPoints.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < spindriftCount; i++) {
        spPositions[i * 3 + 0] += spindriftVel[i * 3 + 0] * (delta * 60.0);
        spPositions[i * 3 + 1] += spindriftVel[i * 3 + 1] * (delta * 60.0);
        spPositions[i * 3 + 2] += spindriftVel[i * 3 + 2] * (delta * 60.0);

        // Wind turbulence
        spPositions[i * 3 + 1] += Math.sin(elapsedTime * 3.8 + i) * 0.018;

        if (spPositions[i * 3 + 0] > summitX + 22.0) {
          resetSpindrift(i, false);
        }
      }
      spindriftPoints.geometry.attributes.position.needsUpdate = true;

      // 2. Update Ambient Powdered Snow Flurries
      const snPositions = snowPoints.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < snowCount; i++) {
        snPositions[i * 3 + 0] += snowVel[i * 3 + 0] * (delta * 60.0);
        snPositions[i * 3 + 1] += snowVel[i * 3 + 1] * (delta * 60.0);
        snPositions[i * 3 + 2] += snowVel[i * 3 + 2] * (delta * 60.0);

        if (snPositions[i * 3 + 0] > 48.0) {
          snPositions[i * 3 + 0] = -48.0;
        }
        if (snPositions[i * 3 + 1] < -28.0) {
          snPositions[i * 3 + 1] = 28.0;
        }
        if (snPositions[i * 3 + 2] > 20.0) {
          snPositions[i * 3 + 2] = -40.0;
        }
      }
      snowPoints.geometry.attributes.position.needsUpdate = true;

      // 3. Update Drifting Cloud Wisps
      for (let j = 0; j < cloudWisps.length; j++) {
        const c = cloudWisps[j];
        c.mesh.position.x += c.speed * (delta * 60.0);
        c.mesh.position.y += Math.sin(elapsedTime * 0.4 + j) * 0.008;

        if (c.mesh.position.x > c.baseX + c.rangeX) {
          c.mesh.position.x = c.baseX - c.rangeX;
        }
      }

      // 4. Update Interactive Cursor Wind Sparkles
      const targetMouseWorldX = mouseRef.current.x * 14.0;
      const targetMouseWorldY = mouseRef.current.y * 8.0;
      const csPositions = cursorSparklePoints.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < cursorSparkleCount; i++) {
        csPositions[i * 3 + 0] += (targetMouseWorldX - csPositions[i * 3 + 0]) * 0.035 + cursorSparkleVel[i * 3 + 0];
        csPositions[i * 3 + 1] += (targetMouseWorldY - csPositions[i * 3 + 1]) * 0.035 + cursorSparkleVel[i * 3 + 1];
        csPositions[i * 3 + 2] += cursorSparkleVel[i * 3 + 2];

        if (Math.abs(csPositions[i * 3 + 0] - targetMouseWorldX) > 10.0) {
          csPositions[i * 3 + 0] = targetMouseWorldX + (Math.random() - 0.5) * 4.0;
        }
        if (Math.abs(csPositions[i * 3 + 1] - targetMouseWorldY) > 8.0) {
          csPositions[i * 3 + 1] = targetMouseWorldY + (Math.random() - 0.5) * 4.0;
        }
      }
      cursorSparklePoints.geometry.attributes.position.needsUpdate = true;

      // 5. Project 3D Summit Coordinate onto Screen for Interactive Beacon
      if (beaconRef.current) {
        const summitVec = new THREE.Vector3(summitX, summitY, summitZ);
        summitVec.project(camera);
        const bx = (summitVec.x * 0.5 + 0.5) * window.innerWidth;
        const by = (-summitVec.y * 0.5 + 0.5) * window.innerHeight;
        beaconRef.current.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        beaconRef.current.style.opacity = '1';
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [webGlSupported, onLoaded]);

  return (
    <div
      ref={containerRef}
      id="three-canvas-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#061428',
      }}
    >
      {/* Fallback */}
      {!webGlSupported && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/assets/himalayan_real_peak.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Atmospheric Vignette & Soft Gradient for Typography Contrast and Top Depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 75% 25%, rgba(255, 240, 200, 0.05) 0%, transparent 45%),
            linear-gradient(90deg, rgba(4, 8, 16, 0.78) 0%, rgba(4, 8, 16, 0.45) 38%, transparent 66%),
            linear-gradient(180deg, rgba(4, 8, 16, 0.98) 0%, rgba(4, 8, 16, 0.92) 18%, rgba(4, 8, 16, 0.78) 34%, rgba(4, 8, 16, 0.50) 50%, rgba(4, 8, 16, 0.22) 66%, transparent 80%),
            linear-gradient(0deg, rgba(4, 8, 16, 0.72) 0%, rgba(4, 8, 16, 0.22) 12%, transparent 22%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Interactive 3D Summit Waypoint Beacon (Ama Dablam Peak) */}
      <div
        ref={beaconRef}
        className="summit-beacon-container"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: 'auto',
          zIndex: 35,
          cursor: 'pointer',
          willChange: 'transform',
          transition: 'opacity 0.8s ease',
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Pulsing Beacon Wave Ring */}
          <div
            className="beacon-ring"
            style={{
              position: 'absolute',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '2px solid rgba(245, 166, 35, 0.85)',
              pointerEvents: 'none',
            }}
          />
          {/* Core Glowing Dot */}
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#FFD166',
              boxShadow: '0 0 16px #F5A623, 0 0 30px #FFD166',
              border: '2px solid #FFFFFF',
              zIndex: 2,
            }}
          />

          {/* Summit Label Pill */}
          <div
            style={{
              position: 'absolute',
              left: '18px',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              background: 'rgba(6, 12, 24, 0.85)',
              border: '1px solid rgba(245, 166, 35, 0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.7)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#FFD166',
              userSelect: 'none',
              transform: 'translateY(-1px)',
            }}
          >
            <span>6,812m AMA DABLAM</span>
          </div>

          {/* Expandable Glass HUD Card */}
          <div
            className="summit-hud-card glass-card"
            style={{
              position: 'absolute',
              top: '32px',
              right: '-20px',
              width: '240px',
              padding: '14px 16px',
              borderRadius: '16px',
              background: 'rgba(8, 16, 32, 0.92)',
              border: '1px solid rgba(245, 166, 35, 0.50)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.85), 0 0 25px rgba(245, 166, 35, 0.25)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              zIndex: 40,
              opacity: 0,
              pointerEvents: 'none',
              transform: 'translateY(-6px) scale(0.96)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ fontSize: '0.68rem', color: '#F5A623', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '4px', textTransform: 'uppercase' }}>
              Khumbu Massif • Nepal
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
              Ama Dablam Summit
            </div>
            <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.80)', lineHeight: 1.45, marginBottom: '8px' }}>
              "Mother's Necklace" — The holy peak symbolizing the heights of Nepali youth leadership.
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '6px', fontSize: '0.68rem', color: 'var(--snow-dim)' }}>
              <span>WIND: 28 km/h NW</span>
              <span style={{ color: '#4DA4FF', fontWeight: 700 }}>ACTIVE BREEZE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
