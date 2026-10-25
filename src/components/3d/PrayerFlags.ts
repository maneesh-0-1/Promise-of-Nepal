import * as THREE from 'three';

// 5 Traditional Buddhist Lungta Colors in exact sacred order
export const PRAYER_FLAG_COLORS = [
  new THREE.Color('#0077B6'), // Blue (Sky / Space)
  new THREE.Color('#FFFFFF'), // White (Air / Wind)
  new THREE.Color('#D90429'), // Red (Fire)
  new THREE.Color('#2A9D8F'), // Green (Water)
  new THREE.Color('#E9C46A'), // Yellow (Earth)
];

export class PrayerFlags {
  public group: THREE.Group;
  private flagMeshes: THREE.Mesh[] = [];
  private ropeMesh: THREE.Mesh | null = null;
  private flagMaterials: THREE.ShaderMaterial[] = [];
  private lungtaTexture: THREE.Texture | null = null;
  private windSpeed: number = 1.0;
  private windForce: number = 1.0;

  constructor(leftAnchor: THREE.Vector3, rightAnchor: THREE.Vector3, numFlags: number = 18) {
    this.group = new THREE.Group();
    this.group.name = 'TibetanLungtaPrayerFlags';

    const textureLoader = new THREE.TextureLoader();
    this.lungtaTexture = textureLoader.load('/assets/tibetan_lungta_flag_texture.jpg');

    this.buildRopeAndFlags(leftAnchor, rightAnchor, numFlags);
  }

  private createFlagShaderMaterial(color: THREE.Color, phaseOffset: number): THREE.ShaderMaterial {
    const vertexShader = `
      uniform float uTime;
      uniform float uWindSpeed;
      uniform float uWindForce;
      uniform float uPhase;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;

      void main() {
        vUv = uv;
        vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
        
        vec3 pos = position;

        // Pinned edge at top (uv.y == 1.0 -> weight = 0.0, uv.y == 0.0 -> weight = 1.0)
        float clothHang = 1.0 - uv.y;
        float hangFactor = pow(clothHang, 1.2);

        // Wind waves traveling through the fabric
        float wave1 = sin(uTime * (uWindSpeed * 3.4) + uPhase + pos.x * 5.0) * hangFactor * 0.22;
        float wave2 = cos(uTime * (uWindSpeed * 5.1) + uPhase * 1.4 + pos.y * 4.0) * hangFactor * 0.12;
        float ripple = sin(uTime * 9.0 + uPhase * 2.1 + (pos.x + pos.y) * 14.0) * pow(hangFactor, 2.0) * 0.05;

        // Wind drift along Z (wind blowing towards the peaks)
        pos.z += (hangFactor * 0.32 * uWindForce) + wave1 + ripple;
        pos.y += wave2 * 0.5;
        pos.x += wave1 * 0.3;

        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `;

    const fragmentShader = `
      uniform vec3 uColor;
      uniform sampler2D uLungtaTexture;
      uniform vec3 uSunDir;
      uniform vec3 uSunColor;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(uSunDir);
        vec3 viewDir = normalize(cameraPosition - vWorldPos);

        // Sample authentic Lungta woodcut print
        vec4 woodcut = texture2D(uLungtaTexture, vUv);
        float ink = clamp(1.0 - woodcut.r, 0.0, 1.0);

        // Fabric color blended with sacred Lungta woodblock ink
        vec3 fabricBase = uColor;
        vec3 inkColor = vec3(0.08, 0.1, 0.14);
        vec3 clothSurface = mix(fabricBase, inkColor, ink * 0.65);

        // Two-sided soft lighting & sun backlight translucency
        float NdotL = max(abs(dot(normal, lightDir)), 0.0);
        vec3 diffuse = clothSurface * (0.45 + 0.55 * NdotL) * uSunColor;

        // Sunlight transmission (translucent cotton weave glow)
        float backlight = max(dot(-viewDir, lightDir), 0.0);
        vec3 translucency = fabricBase * pow(backlight, 2.0) * 0.35 * uSunColor;

        gl_FragColor = vec4(diffuse + translucency, 0.95);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uWindSpeed: { value: this.windSpeed },
        uWindForce: { value: this.windForce },
        uPhase: { value: phaseOffset },
        uColor: { value: color },
        uLungtaTexture: { value: this.lungtaTexture },
        uSunDir: { value: new THREE.Vector3(0.7, 0.45, -0.6).normalize() },
        uSunColor: { value: new THREE.Color('#FFD28A') },
      },
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: true,
    });

    this.flagMaterials.push(mat);
    return mat;
  }

  private buildRopeAndFlags(leftAnchor: THREE.Vector3, rightAnchor: THREE.Vector3, numFlags: number) {
    // Generate curved catenary points between leftAnchor and rightAnchor
    const ropePoints: THREE.Vector3[] = [];
    const segments = 60;
    const sagDepth = 0.65; // Natural graceful catenary dip in center

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const pt = new THREE.Vector3().lerpVectors(leftAnchor, rightAnchor, t);
      // Parabolic sag
      const sag = Math.sin(t * Math.PI) * sagDepth;
      pt.y -= sag;
      ropePoints.push(pt);
    }

    // 1. Build 3D Catenary Rope
    const ropeCurve = new THREE.CatmullRomCurve3(ropePoints);
    const ropeGeo = new THREE.TubeGeometry(ropeCurve, 64, 0.024, 8, false);
    const ropeMat = new THREE.MeshStandardMaterial({
      color: 0x4a3b2c,
      roughness: 0.9,
      metalness: 0.1,
    });
    this.ropeMesh = new THREE.Mesh(ropeGeo, ropeMat);
    this.ropeMesh.castShadow = true;
    this.group.add(this.ropeMesh);

    // 2. Build Fluttering Rectangular Prayer Flags
    const flagWidth = 0.72;
    const flagHeight = 0.92;
    const flagGeo = new THREE.PlaneGeometry(flagWidth, flagHeight, 18, 14);
    // Shift geometry origin so the top edge (y = 0) aligns with the rope
    flagGeo.translate(0, -flagHeight / 2, 0);

    const step = 1.0 / (numFlags + 1);

    for (let i = 0; i < numFlags; i++) {
      const t = step * (i + 1);
      const ropePos = ropeCurve.getPoint(t);
      const tangent = ropeCurve.getTangent(t);

      // Traditional 5 color cycle
      const colorIndex = i % PRAYER_FLAG_COLORS.length;
      const color = PRAYER_FLAG_COLORS[colorIndex];
      const phaseOffset = i * 0.85 + (i % 3) * 0.4;

      const flagMat = this.createFlagShaderMaterial(color, phaseOffset);
      const flagMesh = new THREE.Mesh(flagGeo, flagMat);

      flagMesh.position.copy(ropePos);

      // Align flag along rope tangent
      const angle = Math.atan2(tangent.y, tangent.x);
      flagMesh.rotation.z = angle;

      // Small natural variation in default hang angle
      flagMesh.rotation.y = (Math.sin(i * 1.5) * 0.08);

      flagMesh.castShadow = true;
      this.flagMeshes.push(flagMesh);
      this.group.add(flagMesh);
    }
  }

  public updateTime(elapsedTime: number) {
    for (const mat of this.flagMaterials) {
      mat.uniforms.uTime.value = elapsedTime;
    }
  }

  public setWindParams(speed: number, force: number) {
    this.windSpeed = speed;
    this.windForce = force;
    for (const mat of this.flagMaterials) {
      mat.uniforms.uWindSpeed.value = speed;
      mat.uniforms.uWindForce.value = force;
    }
  }

  public setSunDirection(sunDir: THREE.Vector3, sunColor: THREE.Color) {
    for (const mat of this.flagMaterials) {
      mat.uniforms.uSunDir.value.copy(sunDir);
      mat.uniforms.uSunColor.value.copy(sunColor);
    }
  }
}
