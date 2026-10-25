import * as THREE from 'three';
import { createNoise2D } from './noise';

interface CloudObject {
  mesh: THREE.Mesh;
  baseX: number;
  baseY: number;
  speed: number;
  bobFreq: number;
  bobAmp: number;
  rangeX: number;
}

export class AtmosphericEffects {
  public group: THREE.Group;
  // Ambient powdered snow drifting in the wind
  private snowParticles: THREE.Points;
  private particlePositions: Float32Array;
  private particleVelocities: Float32Array;
  private particleCount: number = 550;

  // Summit spindrift wind banner (snow blown off the razor ridge)
  private spindriftParticles: THREE.Points;
  private spindriftPositions: Float32Array;
  private spindriftVelocities: Float32Array;
  private spindriftLifetimes: Float32Array;
  private spindriftCount: number = 320;

  private clouds: CloudObject[] = [];
  private sunGlow: THREE.Sprite;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'HimalayanAtmosphericEffects';

    const snowTexture = this.createSnowTexture();

    // 1. High Altitude Powdered Snow Flurries across the Viewport
    const snowGeo = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(this.particleCount * 3);
    this.particleVelocities = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      this.particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 110;
      this.particlePositions[i * 3 + 1] = Math.random() * 85 + 15;
      this.particlePositions[i * 3 + 2] = Math.random() * 95 - 45;

      // Alpine wind blowing towards right (+X) and slightly drifting down and towards camera
      this.particleVelocities[i * 3 + 0] = 0.08 + Math.random() * 0.16;
      this.particleVelocities[i * 3 + 1] = -0.015 - Math.random() * 0.025;
      this.particleVelocities[i * 3 + 2] = 0.02 + Math.random() * 0.04;
    }

    snowGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));

    const snowMat = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.45,
      map: snowTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.snowParticles = new THREE.Points(snowGeo, snowMat);
    this.group.add(this.snowParticles);

    // 2. Summit Spindrift Wind Plume (Blowing directly from the peak summit apex)
    const spindriftGeo = new THREE.BufferGeometry();
    this.spindriftPositions = new Float32Array(this.spindriftCount * 3);
    this.spindriftVelocities = new Float32Array(this.spindriftCount * 3);
    this.spindriftLifetimes = new Float32Array(this.spindriftCount);

    for (let i = 0; i < this.spindriftCount; i++) {
      this.resetSpindriftParticle(i, true);
    }

    spindriftGeo.setAttribute('position', new THREE.BufferAttribute(this.spindriftPositions, 3));

    const spindriftMat = new THREE.PointsMaterial({
      color: 0xF2F8FF,
      size: 0.75,
      map: snowTexture,
      transparent: true,
      opacity: 0.70,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.spindriftParticles = new THREE.Points(spindriftGeo, spindriftMat);
    this.group.add(this.spindriftParticles);

    // 3. Photorealistic Fractal Noise Himalayan Cloud Formations
    const cumulusTex = this.createFractalCloudTexture('cumulus');
    const cirrusTex = this.createFractalCloudTexture('cirrus');
    const seaOfCloudsTex = this.createFractalCloudTexture('sea');

    // Strategic Cloud Placements:
    // Mountain Inversion Layer (Sea of Clouds at Y = 28 to 44) nestling below the peak,
    // plus delicate summit plumes drifting past the arêtes
    const cloudConfigs = [
      // --- LAYER 1: Summit Plume & Flanking High Cirrus (Y = 66 to 85) ---
      // Wind banner cloud trailing east from summit
      { tex: cirrusTex, w: 75, h: 22, pos: new THREE.Vector3(34, 68, -44), scale: 1.15, opacity: 0.85, color: 0xFFFAF2, speed: 0.016, bobFreq: 0.5, bobAmp: 0.5 },
      // Left summit flank cirrus wisps
      { tex: cirrusTex, w: 60, h: 18, pos: new THREE.Vector3(4, 65, -40), scale: 1.05, opacity: 0.75, color: 0xFFFFFF, speed: 0.012, bobFreq: 0.45, bobAmp: 0.4 },
      // High alpine sky cirrus streaks
      { tex: cirrusTex, w: 95, h: 24, pos: new THREE.Vector3(-10, 88, -75), scale: 1.3, opacity: 0.65, color: 0xFFFFFF, speed: 0.008, bobFreq: 0.3, bobAmp: 0.3 },
      { tex: cirrusTex, w: 105, h: 26, pos: new THREE.Vector3(42, 92, -78), scale: 1.35, opacity: 0.68, color: 0xFFFBF4, speed: 0.009, bobFreq: 0.32, bobAmp: 0.35 },

      // --- LAYER 2: Vast Himalayan Sea of Clouds (Y = 28 to 42) ---
      // Billowing soft inversion clouds that veil the lower mountain, leaving the peak majestic and floating
      { tex: seaOfCloudsTex, w: 90, h: 32, pos: new THREE.Vector3(-25, 36, -38), scale: 1.4, opacity: 0.92, color: 0xFFFFFF, speed: 0.009, bobFreq: 0.35, bobAmp: 0.6 },
      { tex: seaOfCloudsTex, w: 96, h: 34, pos: new THREE.Vector3(32, 34, -40), scale: 1.45, opacity: 0.95, color: 0xFFFAF4, speed: 0.010, bobFreq: 0.4, bobAmp: 0.6 },
      { tex: cumulusTex, w: 72, h: 28, pos: new THREE.Vector3(2, 38, -32), scale: 1.3, opacity: 0.88, color: 0xFFFFFF, speed: 0.012, bobFreq: 0.45, bobAmp: 0.5 },
      { tex: seaOfCloudsTex, w: 110, h: 36, pos: new THREE.Vector3(-48, 30, -52), scale: 1.6, opacity: 0.92, color: 0xFFFFFF, speed: 0.007, bobFreq: 0.3, bobAmp: 0.7 },
      { tex: seaOfCloudsTex, w: 115, h: 38, pos: new THREE.Vector3(48, 32, -54), scale: 1.65, opacity: 0.94, color: 0xFFFAF2, speed: 0.008, bobFreq: 0.32, bobAmp: 0.7 },

      // --- LAYER 3: Foreground Atmospheric Depth Mist (Z = 5 to 25) ---
      { tex: cumulusTex, w: 48, h: 20, pos: new THREE.Vector3(-20, 52, 10), scale: 1.0, opacity: 0.45, color: 0xFFFFFF, speed: 0.014, bobFreq: 0.6, bobAmp: 0.4 },
      { tex: cirrusTex, w: 54, h: 18, pos: new THREE.Vector3(24, 48, 14), scale: 1.05, opacity: 0.42, color: 0xFFFAF0, speed: 0.015, bobFreq: 0.55, bobAmp: 0.5 },
    ];

    for (const conf of cloudConfigs) {
      const geo = new THREE.PlaneGeometry(conf.w, conf.h);
      const mat = new THREE.MeshBasicMaterial({
        map: conf.tex,
        transparent: true,
        opacity: conf.opacity,
        depthWrite: false,
        blending: THREE.NormalBlending,
        color: conf.color,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(conf.pos);
      mesh.scale.set(conf.scale, conf.scale, 1);

      this.clouds.push({
        mesh,
        baseX: conf.pos.x,
        baseY: conf.pos.y,
        speed: conf.speed,
        bobFreq: conf.bobFreq,
        bobAmp: conf.bobAmp,
        rangeX: conf.w * 0.75 + 40,
      });

      this.group.add(mesh);
    }

    // 4. Golden Dawn Sun Corona Flare Sprite
    const sunTexture = this.createSunGlowTexture();
    const sunMat = new THREE.SpriteMaterial({
      map: sunTexture,
      color: 0xFFF0D0,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.sunGlow = new THREE.Sprite(sunMat);
    // Positioned in the upper right sky behind the peak's right shoulder
    this.sunGlow.position.set(42, 88, -65);
    this.sunGlow.scale.set(65, 65, 1);
    this.group.add(this.sunGlow);
  }

  private resetSpindriftParticle(index: number, randomProgress: boolean = false) {
    // Summit ridge coordinates in world space: (x ≈ 21 to 23, y ≈ 66 to 68, z ≈ -40)
    const startX = 21.5 + (Math.random() - 0.5) * 3.5;
    const startY = 66.5 + (Math.random() - 0.5) * 2.8;
    const startZ = -40.0 + (Math.random() - 0.5) * 3.5;

    const vx = 0.22 + Math.random() * 0.28;
    const vy = (Math.random() - 0.45) * 0.05;
    const vz = (Math.random() - 0.5) * 0.08;

    this.spindriftVelocities[index * 3 + 0] = vx;
    this.spindriftVelocities[index * 3 + 1] = vy;
    this.spindriftVelocities[index * 3 + 2] = vz;

    const lifetime = 1.0 + Math.random() * 2.0;
    this.spindriftLifetimes[index] = lifetime;

    if (randomProgress) {
      const progress = Math.random();
      this.spindriftPositions[index * 3 + 0] = startX + vx * progress * 60;
      this.spindriftPositions[index * 3 + 1] = startY + vy * progress * 60;
      this.spindriftPositions[index * 3 + 2] = startZ + vz * progress * 60;
    } else {
      this.spindriftPositions[index * 3 + 0] = startX;
      this.spindriftPositions[index * 3 + 1] = startY;
      this.spindriftPositions[index * 3 + 2] = startZ;
    }
  }

  private createSnowTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Generates authentic multi-octave simplex fractal noise cloud textures with soft organic silhouettes
   */
  private createFractalCloudTexture(type: 'cumulus' | 'cirrus' | 'sea'): THREE.Texture {
    const width = 512;
    const height = type === 'cirrus' ? 160 : 256;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const noise = createNoise2D();
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusX = width * 0.46;
    const radiusY = height * 0.44;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;

        // Elliptical boundary falloff
        const dx = (x - centerX) / radiusX;
        const dy = (y - centerY) / radiusY;
        const distSq = dx * dx + dy * dy;
        const mask = Math.max(0, 1.0 - Math.pow(distSq, 1.1));

        // 4-Octave Fractal Brownian Motion (FBM)
        const nx = x / 65.0;
        const ny = y / (type === 'cirrus' ? 35.0 : 55.0);

        let n = noise(nx, ny) * 0.50 +
          noise(nx * 2.1, ny * 2.1) * 0.28 +
          noise(nx * 4.2, ny * 4.2) * 0.15 +
          noise(nx * 8.4, ny * 8.4) * 0.07;

        n = n * 0.5 + 0.5;

        // Smooth density shaping
        let density = Math.pow(n, type === 'cirrus' ? 1.8 : 1.35) * mask;

        // Set pixel values
        data[idx + 0] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = Math.floor(Math.min(density, 1.0) * 255);
      }
    }

    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.premultiplyAlpha = true;
    return tex;
  }

  private createSunGlowTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255, 250, 240, 1.0)');
    grad.addColorStop(0.2, 'rgba(255, 225, 170, 0.75)');
    grad.addColorStop(0.5, 'rgba(255, 185, 100, 0.35)');
    grad.addColorStop(0.8, 'rgba(255, 150, 60, 0.08)');
    grad.addColorStop(1, 'rgba(255, 120, 30, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
  }

  public update(time: number, delta: number) {
    // 1. Ambient powdered snow flurries across the screen
    const positions = this.snowParticles.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3 + 0] += this.particleVelocities[i * 3 + 0] * (delta * 60);
      positions[i * 3 + 1] += this.particleVelocities[i * 3 + 1] * (delta * 60);
      positions[i * 3 + 2] += this.particleVelocities[i * 3 + 2] * (delta * 60);

      if (positions[i * 3 + 0] > 55) {
        positions[i * 3 + 0] = -55;
      }
      if (positions[i * 3 + 1] < 10) {
        positions[i * 3 + 1] = 95;
      }
      if (positions[i * 3 + 2] > 50) {
        positions[i * 3 + 2] = -45;
      }
    }

    this.snowParticles.geometry.attributes.position.needsUpdate = true;

    // 2. Summit Spindrift Wind Plume
    const spindriftPos = this.spindriftParticles.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < this.spindriftCount; i++) {
      spindriftPos[i * 3 + 0] += this.spindriftVelocities[i * 3 + 0] * (delta * 60);
      spindriftPos[i * 3 + 1] += this.spindriftVelocities[i * 3 + 1] * (delta * 60);
      spindriftPos[i * 3 + 2] += this.spindriftVelocities[i * 3 + 2] * (delta * 60);

      // Turbulence
      spindriftPos[i * 3 + 1] += Math.sin(time * 3.5 + i) * 0.02;

      // When the particle drifts far past the summit, recycle it back to the ridge
      if (spindriftPos[i * 3 + 0] > 48.0) {
        this.resetSpindriftParticle(i, false);
      }
    }

    this.spindriftParticles.geometry.attributes.position.needsUpdate = true;

    // 3. Natural drifting and gentle atmospheric floating for clouds
    for (let j = 0; j < this.clouds.length; j++) {
      const c = this.clouds[j];
      c.mesh.position.x += c.speed;
      c.mesh.position.y = c.baseY + Math.sin(time * c.bobFreq + j * 0.8) * c.bobAmp;

      if (c.mesh.position.x > c.baseX + c.rangeX) {
        c.mesh.position.x = c.baseX - c.rangeX;
      }
    }

    // 4. Subtle breathing solar flare corona
    const pulse = 1.0 + Math.sin(time * 0.75) * 0.05;
    this.sunGlow.scale.set(65 * pulse, 65 * pulse, 1);
  }
}
