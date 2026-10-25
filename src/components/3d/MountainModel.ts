import * as THREE from 'three';
import { createNoise2D } from './noise';

export class HimalayanMountain {
  public group: THREE.Group;
  public peakMesh: THREE.Mesh;
  public distantMesh: THREE.Mesh;
  public mountainMaterial: THREE.ShaderMaterial;
  private rockTexture: THREE.Texture | null = null;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'HimalayanMountainEnvironment';

    const textureLoader = new THREE.TextureLoader();
    this.rockTexture = textureLoader.load('/assets/himalayan_rock_cliff_texture.jpg', (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(6, 6);
    });

    this.mountainMaterial = this.createMountainShaderMaterial();

    this.peakMesh = this.buildMainPeak();
    this.distantMesh = this.buildDistantAtmosphericRange();

    this.group.add(this.peakMesh);
    this.group.add(this.distantMesh);
  }

  private createMountainShaderMaterial(): THREE.ShaderMaterial {
    const customVertexShader = `
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      varying float vSlope;
      varying float vAltitude;

      void main() {
        vUv = uv;
        // Transform normal to world space so it aligns with directional light & world coordinates
        vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        
        // Slope factor: 1.0 = sheer vertical precipice, 0.0 = flat plateau
        vSlope = 1.0 - abs(vNormal.y);
        vAltitude = worldPos.y;

        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `;

    const customFragmentShader = `
      uniform sampler2D uRockTexture;
      uniform vec3 uSunDirection;
      uniform vec3 uSunColor;
      uniform vec3 uSkyColor;
      uniform vec3 uShadowColor;
      uniform vec3 uFogColor;
      uniform float uFogNear;
      uniform float uFogFar;
      uniform float uTime;

      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      varying float vSlope;
      varying float vAltitude;

      void main() {
        vec3 rawNormal = normalize(vNormal);
        vec3 lightDir = normalize(uSunDirection);
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);

        // Sample metamorphic rock texture for natural crag micro-relief
        vec4 rockTex = texture2D(uRockTexture, vUv * 6.0);

        // Realistic Himalayan snow & rock distribution:
        // Snow blankets windward faces and slopes up to 55°
        // Only sheer vertical cliffs (slope > 60°) shed snow to reveal dark granite rock
        float cliff = smoothstep(0.62, 0.82, vSlope);
        float snowAmount = 1.0 - cliff;

        // Summit peak upper slopes are completely wind-packed snow
        if (vAltitude > 35.0) {
          snowAmount = max(snowAmount, smoothstep(35.0, 52.0, vAltitude) * 0.98);
        }
        // Horizontal ridge tops and apex are always pristine snow
        if (rawNormal.y > 0.42) {
          snowAmount = max(snowAmount, 0.96);
        }

        // Perturb normal for crystalline rock facets and wind-crusted snow
        vec3 rockNormal = normalize(rawNormal + (rockTex.rgb - 0.5) * 0.36);
        vec3 snowNormal = normalize(rawNormal + vec3(sin(vWorldPosition.x * 2.2) * 0.02, 0.0, cos(vWorldPosition.z * 2.2) * 0.02));
        vec3 normal = normalize(mix(rockNormal, snowNormal, snowAmount));

        // World-space lighting
        float NdotL = max(dot(normal, lightDir), 0.0);

        // Deep metamorphic dark granite bedrock
        vec3 darkRock = vec3(0.10, 0.11, 0.14) * (0.85 + rockTex.r * 0.30);
        vec3 slateRock = vec3(0.20, 0.22, 0.26) * (0.85 + rockTex.g * 0.25);
        vec3 rockColor = mix(darkRock, slateRock, clamp(rockTex.b * 1.2, 0.0, 1.0));

        // Brilliant pure Himalayan alpine snow:
        // Sunlit faces: crisp brilliant white with delicate alpine warmth
        vec3 snowSunlit = vec3(1.0, 0.99, 0.98);
        // Shadowed faces: Rayleigh-scattered alpine sky blue
        vec3 snowShadow = vec3(0.58, 0.70, 0.86);
        vec3 snowColor = mix(snowShadow, snowSunlit, smoothstep(0.06, 0.50, NdotL));

        // Glacier ice blue in deep couloir shadows
        if (vAltitude > 28.0 && rawNormal.y > 0.32 && NdotL < 0.20) {
          snowColor = mix(snowColor, vec3(0.42, 0.72, 0.92), 0.20);
        }

        vec3 surfaceColor = mix(rockColor, snowColor, snowAmount);

        // Direct sunlight & ambient skylight bounce
        vec3 diffuseSun = uSunColor * NdotL * 1.25;
        vec3 ambientSky = mix(uShadowColor, uSkyColor, rawNormal.y * 0.5 + 0.5) * 0.55;

        // Subtle crystalline snow micro-glint
        vec3 halfVec = normalize(lightDir + viewDir);
        float microGlint = pow(max(dot(normal, halfVec), 0.0), 52.0) * snowAmount * 0.30;
        vec3 glintColor = uSunColor * microGlint;

        // Soft alpine atmospheric rim sheen
        float rim = pow(1.0 - max(dot(rawNormal, viewDir), 0.0), 4.2) * snowAmount * 0.15;
        vec3 rimColor = uSkyColor * rim;

        vec3 finalColor = surfaceColor * (diffuseSun + ambientSky) + glintColor + rimColor;

        // Atmospheric distance fog / mist
        float dist = length(vWorldPosition - cameraPosition);
        float fogFactor = clamp((dist - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
        fogFactor = pow(fogFactor, 1.25);

        gl_FragColor = vec4(mix(finalColor, uFogColor, fogFactor), 1.0);
      }
    `;

    return new THREE.ShaderMaterial({
      vertexShader: customVertexShader,
      fragmentShader: customFragmentShader,
      uniforms: {
        uRockTexture: { value: this.rockTexture },
        uSunDirection: { value: new THREE.Vector3(0.60, 0.55, 0.50).normalize() },
        uSunColor: { value: new THREE.Color('#FFFDF8') },
        uSkyColor: { value: new THREE.Color('#6E9AC8') },
        uShadowColor: { value: new THREE.Color('#142238') },
        uFogColor: { value: new THREE.Color('#182C48') },
        uFogNear: { value: 38.0 },
        uFogFar: { value: 240.0 },
        uTime: { value: 0 },
      },
      side: THREE.FrontSide,
    });
  }

  /**
   * Sculpted Iconic Himalayan Peak (Pyramidal summit horn with razor arêtes, natural erosion, and horizontal rock strata)
   */
  private buildMainPeak(): THREE.Mesh {
    const width = 150;
    const depth = 130;
    const segX = 220;
    const segY = 180;
    const geo = new THREE.PlaneGeometry(width, depth, segX, segY);
    geo.rotateX(-Math.PI / 2);

    const noise = createNoise2D();
    const pos = geo.attributes.position;

    // Peak apex is at (0, 0) in local mesh coordinates
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      const dist = Math.hypot(x, z);

      // 1. Pyramid summit profile: sharp crystalline apex
      const apexDrop = 72.0 - Math.pow(dist * 0.70, 1.04);

      // 2. Three primary razor arêtes:
      // West Arête: sweeping leftward across the skyline (-1.0, 0.28)
      const dWest = Math.abs(0.28 * x + 1.0 * z) / Math.hypot(0.28, 1.0);
      const westRidge = Math.max(0, 68.0 - Math.abs(x) * 0.58) * Math.exp(-Math.pow(dWest / 4.4, 2.0));

      // South-East Arête: descending towards front-right (0.75, 0.65)
      const dSouthEast = Math.abs(0.65 * x - 0.75 * z) / Math.hypot(0.65, 0.75);
      const southEastRidge = Math.max(0, 66.0 - Math.hypot(x, z) * 0.56) * Math.exp(-Math.pow(dSouthEast / 4.6, 2.0));

      // North-East Arête: dropping into background abyss (0.8, -0.6)
      const dNorthEast = Math.abs(0.6 * x + 0.8 * z) / Math.hypot(0.6, 0.8);
      const northEastRidge = Math.max(0, 67.0 - Math.hypot(x, z) * 0.58) * Math.exp(-Math.pow(dNorthEast / 4.5, 2.0));

      let h = Math.max(apexDrop, westRidge, southEastRidge, northEastRidge);

      // 3. Smooth multi-octave natural erosion and rock strata
      const n1 = noise(x * 0.035, z * 0.035) * 4.5;
      const n2 = noise(x * 0.09, z * 0.09) * 2.0;
      const n3 = noise(x * 0.22, z * 0.22) * 0.8;
      const strata = Math.sin((h + n1) * 0.55) * 1.2;

      let finalY = h + n1 + n2 + n3 + strata;

      // Base edge falloff into cloud blanket
      if (dist > 55) {
        const fade = Math.max(0, 1.0 - (dist - 55) / 25.0);
        finalY *= Math.pow(fade, 1.6);
      }

      pos.setY(i, Math.max(0, finalY));
    }

    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, this.mountainMaterial);
    // Positioned so the summit stands majestic and proud at X ≈ 25 in world space (right side of viewport)
    mesh.position.set(25, -6, -38);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  /**
   * Distant Himalayan Mountain Range (Silhouettes fading into Rayleigh sky haze)
   */
  private buildDistantAtmosphericRange(): THREE.Mesh {
    const width = 360;
    const depth = 85;
    const segX = 120;
    const segY = 40;
    const geo = new THREE.PlaneGeometry(width, depth, segX, segY);
    geo.rotateX(-Math.PI / 2);

    const noise = createNoise2D();
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      const nx = x * 0.014;
      const nz = z * 0.014;
      const n = (1.0 - Math.abs(noise(nx, nz))) * 34.0 + noise(nx * 2.8, nz * 2.8) * 7.0;

      let y = 14.0 + n;
      const edgeFactor = Math.max(0, Math.cos((x / width) * Math.PI));
      y *= edgeFactor;

      pos.setY(i, y);
    }

    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, this.mountainMaterial);
    mesh.position.set(0, -18, -135);
    return mesh;
  }

  public updateTime(elapsedTime: number) {
    if (this.mountainMaterial.uniforms.uTime) {
      this.mountainMaterial.uniforms.uTime.value = elapsedTime;
    }
  }

  public setLighting(
    sunDir: THREE.Vector3,
    sunColor: THREE.Color,
    skyColor: THREE.Color,
    shadowColor: THREE.Color,
    fogColor: THREE.Color
  ) {
    const uniforms = this.mountainMaterial.uniforms;
    uniforms.uSunDirection.value.copy(sunDir);
    uniforms.uSunColor.value.copy(sunColor);
    uniforms.uSkyColor.value.copy(skyColor);
    uniforms.uShadowColor.value.copy(shadowColor);
    uniforms.uFogColor.value.copy(fogColor);
  }
}
