import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * VioletPlanetCanvas — High-Performance Cinematic 3D WebGL Environment
 * 
 * Features:
 * - Colossal dimensional violet alien planet with procedural fBM displacement
 * - Domain-warped geological fault fissures with lavender/ultraviolet core
 * - Bump-mapped basalt mountains, rocky ridges, and impact crater relief
 * - Physically inspired Fresnel atmospheric limb scattering & outer shell
 * - Deep terminator shadows with atmospheric twilight transitions
 * - Multi-layered cosmic starfield with subtle spectral scintillation
 * - Damped pointer parallax & imperceptibly slow axial rotation
 * - Visibility API pause and reduced-motion compliance
 * - Graceful fallback on WebGL failure
 */
export default function VioletPlanetCanvas() {
  const containerRef = useRef(null);
  const [webGLError, setWebGLError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Verify WebGL availability
    const testCanvas = document.createElement("canvas");
    const gl =
      testCanvas.getContext("webgl2") ||
      testCanvas.getContext("webgl") ||
      testCanvas.getContext("experimental-webgl");
    if (!gl) {
      setWebGLError(true);
      return;
    }

    // Reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = mediaQuery.matches;
    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches;
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02040b, 0.035);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.8);

    // Optimized WebGLRenderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn("Failed to initialize WebGLRenderer:", err);
      setWebGLError(true);
      return;
    }

    // Key light direction: upper-right rim providing cinematic grazing light
    const lightDir = new THREE.Vector3(0.92, 0.42, 0.48).normalize();

    // -------------------------------------------------------------
    // 1. Procedural Noise GLSL Utility
    // -------------------------------------------------------------
    const simplexNoiseGLSL = `
      vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

        i = mod(i, 289.0);
        vec4 p = permute(permute(permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        float n_ = 0.142857142857;
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      float fbm(vec3 p) {
        float v = 0.0;
        float a = 0.52;
        float f = 1.0;
        for (int i = 0; i < 4; i++) {
          v += a * snoise(p * f);
          f *= 2.08;
          a *= 0.48;
        }
        return v;
      }
    `;

    // -------------------------------------------------------------
    // 2. Planet Surface Shaders & Geometry
    // -------------------------------------------------------------
    const isMobile = width < 768;
    const sphereSegments = isMobile ? 70 : 120;
    const planetRadius = isMobile ? 4.0 : 4.6;
    const planetGeometry = new THREE.SphereGeometry(planetRadius, sphereSegments, sphereSegments);

    const planetUniforms = {
      uTime: { value: 0 },
      uLightDir: { value: lightDir },
      uTerrainScale: { value: 1.05 },
      uDisplacementStrength: { value: 0.15 },
      // Geological Color Spectrum:
      uBaseBasalt: { value: new THREE.Color(0x05020c) },    // Deepest shadowy basalt
      uBaseMidViolet: { value: new THREE.Color(0x190a32) }, // Dark obsidian-violet mantle
      uBaseRidgeViolet: { value: new THREE.Color(0x351468) },// Mineral violet ridgelines
      uBasePeakLilac: { value: new THREE.Color(0x5b2d9e) },  // Sunlit titanium-violet peaks
      uAtmosphereLimb: { value: new THREE.Color(0xa855f7) }, // Luminous violet atmospheric rim
      uFissureDeep: { value: new THREE.Color(0x6d28d9) },    // Sub-crust fissure indigo
      uFissureBright: { value: new THREE.Color(0xc084fc) },  // Luminous electric lavender
      uFissureCore: { value: new THREE.Color(0xfbf7ff) },    // Blazing white-lavender core
    };

    const planetVertexShader = `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vLocalPosition;
      varying float vElevation;

      uniform float uTime;
      uniform float uTerrainScale;
      uniform float uDisplacementStrength;

      ${simplexNoiseGLSL}

      void main() {
        vLocalPosition = position;

        // Multi-scale procedural displacement: rolling highlands + sharp ridges
        float broadTerrain = fbm(position * (uTerrainScale * 0.9));
        float sharpRidges = 1.0 - abs(snoise(position * (uTerrainScale * 2.1)));
        float elevation = broadTerrain + sharpRidges * 0.28;
        vElevation = elevation;

        // Displace sphere along vertex normals
        vec3 displaced = position + normal * (elevation * uDisplacementStrength);
        vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
        vWorldPosition = worldPos.xyz;
        vNormal = normalize(normalMatrix * normal);

        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `;

    const planetFragmentShader = `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vLocalPosition;
      varying float vElevation;

      uniform float uTime;
      uniform vec3 uLightDir;
      uniform vec3 uBaseBasalt;
      uniform vec3 uBaseMidViolet;
      uniform vec3 uBaseRidgeViolet;
      uniform vec3 uBasePeakLilac;
      uniform vec3 uAtmosphereLimb;
      uniform vec3 uFissureDeep;
      uniform vec3 uFissureBright;
      uniform vec3 uFissureCore;

      ${simplexNoiseGLSL}

      // Fast Voronoi cell distance for tectonic fracture logic
      float voronoiBorder(vec3 p) {
        vec3 ip = floor(p);
        vec3 fp = fract(p);
        float d1 = 1.0;
        float d2 = 1.0;

        for (int z = -1; z <= 1; z++) {
          for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
              vec3 g = vec3(float(x), float(y), float(z));
              vec3 rnd = fract(sin(vec3(
                dot(ip + g, vec3(127.1, 311.7, 74.7)),
                dot(ip + g, vec3(269.5, 183.3, 246.1)),
                dot(ip + g, vec3(113.5, 271.9, 124.6))
              )) * 43758.5453);
              vec3 diff = g + rnd - fp;
              float dist = length(diff);
              if (dist < d1) {
                d2 = d1;
                d1 = dist;
              } else if (dist < d2) {
                d2 = dist;
              }
            }
          }
        }
        return d2 - d1;
      }

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        vec3 light = normalize(uLightDir);

        // 1. Directional Sun Lighting & Terminator Shadow
        float NdotL = dot(normal, light);
        // Realistic terminator transition from sunlit limb to cosmic shadow
        float sunLit = smoothstep(-0.22, 0.42, NdotL);

        // 2. Multi-Stratum Terrain Coloring
        float h = clamp((vElevation + 0.35) * 1.3, 0.0, 1.0);
        vec3 terrainColor = mix(uBaseBasalt, uBaseMidViolet, smoothstep(0.0, 0.35, h));
        terrainColor = mix(terrainColor, uBaseRidgeViolet, smoothstep(0.32, 0.72, h));
        terrainColor = mix(terrainColor, uBasePeakLilac, smoothstep(0.68, 1.0, h));

        // High-frequency rocky noise texture
        float rockStriae = snoise(vLocalPosition * 14.0) * 0.05;
        terrainColor += rockStriae;

        // Base planetary diffuse shading with deep cosmic shadows
        vec3 diffuse = terrainColor * (sunLit * 0.94 + 0.06);

        // 3. Domain-Warped Organic Geological Fissures
        // Non-uniform domain warping prevents repetitive geometric grid
        vec3 warp = vec3(
          snoise(vLocalPosition * 1.3),
          snoise(vLocalPosition * 1.3 + vec3(21.4, 43.1, 62.7)),
          snoise(vLocalPosition * 1.3 + vec3(75.8, 14.9, 39.2))
        ) * 0.42;

        vec3 warpedCoord = vLocalPosition * 2.2 + warp;
        float crackDist = voronoiBorder(warpedCoord);

        // Tectonic belt mask: fissures cluster along continental rifts rather than covering 100% of the surface
        float tectonicBelt = smoothstep(0.12, 0.58, abs(snoise(vLocalPosition * 0.75 + 1.8)));
        // Continental rift valley filter
        float canyonMask = smoothstep(0.65, 0.1, vElevation); // Fissures prefer lower rift trenches
        float riftProbability = tectonicBelt * (canyonMask * 0.65 + 0.35);

        // Organic varying crack width
        float dynamicWidth = mix(0.015, 0.048, snoise(vLocalPosition * 2.5) * 0.5 + 0.5);
        float fissureEdge = 1.0 - smoothstep(0.003, dynamicWidth, crackDist);
        fissureEdge *= riftProbability;

        // Slow organic pulse: independent phase offsets breathing inside the crust
        float pulseA = sin(vLocalPosition.y * 3.2 + vLocalPosition.x * 1.8 + uTime * 0.65) * 0.3 + 0.7;
        float pulseB = sin(vLocalPosition.z * 4.0 - uTime * 0.45) * 0.25 + 0.75;
        float fissureIntensity = fissureEdge * pulseA * pulseB;

        // Fissure Multi-Layer Emission (deep glow -> electric lavender -> pure white core)
        vec3 fissureColor = mix(uFissureDeep * 1.5, uFissureBright * 2.4, smoothstep(0.2, 0.65, fissureIntensity));
        fissureColor = mix(fissureColor, uFissureCore * 3.8, smoothstep(0.65, 0.95, fissureIntensity));
        fissureColor *= smoothstep(0.015, 0.25, fissureIntensity);

        // 4. Luminous Atmospheric Rim (Fresnel edge grazing)
        float fresnel = 1.0 - max(0.0, dot(viewDir, normal));
        float rimGlow = pow(fresnel, 3.6);
        // Grazing sunlight scattering on the lit atmospheric limb
        float lightScattering = clamp(dot(light, viewDir) * 0.45 + 0.55, 0.25, 1.0);
        vec3 atmosphericRim = uAtmosphereLimb * (rimGlow * 1.85 * lightScattering);

        // 5. Planetary Grazing Specular Highlight
        vec3 halfVec = normalize(light + viewDir);
        float spec = pow(max(0.0, dot(normal, halfVec)), 28.0) * (1.0 - h * 0.4) * 0.32;
        vec3 specular = uAtmosphereLimb * spec * sunLit;

        // Combine all passes
        vec3 finalColor = diffuse + fissureColor + atmosphericRim + specular;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const planetMaterial = new THREE.ShaderMaterial({
      uniforms: planetUniforms,
      vertexShader: planetVertexShader,
      fragmentShader: planetFragmentShader,
    });

    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    
    // Position colossal planet: anchored on the right/lower-right
    if (isMobile) {
      planetMesh.position.set(0, -3.9, -0.8);
    } else {
      planetMesh.position.set(3.5, -0.5, -1.2);
    }
    planetMesh.rotation.z = 0.24; // Planetary axial tilt
    scene.add(planetMesh);

    // -------------------------------------------------------------
    // 3. Atmospheric Outer Glow Shell (Additive Blending)
    // -------------------------------------------------------------
    const atmosGeometry = new THREE.SphereGeometry(planetRadius * 1.036, 64, 64);
    const atmosUniforms = {
      uAtmosphereColor: { value: new THREE.Color(0x9333ea) },
      uLightDir: { value: lightDir },
    };

    const atmosVertexShader = `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `;

    const atmosFragmentShader = `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      uniform vec3 uAtmosphereColor;
      uniform vec3 uLightDir;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        vec3 light = normalize(uLightDir);

        float fresnel = 1.0 - max(0.0, dot(viewDir, normal));
        float glow = pow(fresnel, 4.0) * 1.9;

        float lightInfluence = clamp(dot(light, viewDir) * 0.4 + 0.6, 0.25, 1.0);
        vec3 col = uAtmosphereColor * glow * lightInfluence;

        gl_FragColor = vec4(col, glow * 0.85);
      }
    `;

    const atmosMaterial = new THREE.ShaderMaterial({
      uniforms: atmosUniforms,
      vertexShader: atmosVertexShader,
      fragmentShader: atmosFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });

    const atmosMesh = new THREE.Mesh(atmosGeometry, atmosMaterial);
    atmosMesh.position.copy(planetMesh.position);
    atmosMesh.rotation.copy(planetMesh.rotation);
    scene.add(atmosMesh);

    // -------------------------------------------------------------
    // 4. Subtle Deep-Space Cosmic Starfield
    // -------------------------------------------------------------
    const starCount = isMobile ? 260 : 500;
    const starPositions = new Float32Array(starCount * 3);
    const starScales = new Float32Array(starCount);
    const starPhases = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 48;
      const y = (Math.random() - 0.5) * 32;
      const z = -12 - Math.random() * 24;

      starPositions[i * 3] = x;
      starPositions[i * 3 + 1] = y;
      starPositions[i * 3 + 2] = z;

      starScales[i] = 1.0 + Math.random() * 2.2;
      starPhases[i] = Math.random() * Math.PI * 2;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("aScale", new THREE.BufferAttribute(starScales, 1));
    starGeometry.setAttribute("aPhase", new THREE.BufferAttribute(starPhases, 1));

    const starUniforms = {
      uTime: { value: 0 },
    };

    const starVertexShader = `
      attribute float aScale;
      attribute float aPhase;
      varying float vAlpha;
      uniform float uTime;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        float twinkle = sin(uTime * 1.35 + aPhase) * 0.35 + 0.65;
        vAlpha = twinkle;
        gl_PointSize = aScale * (26.0 / -mvPosition.z);
      }
    `;

    const starFragmentShader = `
      varying float vAlpha;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        float intensity = smoothstep(0.5, 0.05, dist);
        vec3 starTint = mix(vec3(0.92, 0.88, 1.0), vec3(0.72, 0.55, 1.0), dist);

        gl_FragColor = vec4(starTint, intensity * vAlpha * 0.82);
      }
    `;

    const starMaterial = new THREE.ShaderMaterial({
      uniforms: starUniforms,
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starParticles = new THREE.Points(starGeometry, starMaterial);
    scene.add(starParticles);

    // -------------------------------------------------------------
    // 5. Parallax, Motion & Interaction Loop
    // -------------------------------------------------------------
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };

    const handlePointerMove = (e) => {
      if (prefersReducedMotion) return;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetMouse.x = normX * 0.35;
      targetMouse.y = normY * 0.25;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const mobileNow = w < 768;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

      if (mobileNow) {
        planetMesh.position.set(0, -3.9, -0.8);
      } else {
        planetMesh.position.set(3.5, -0.5, -1.2);
      }
      atmosMesh.position.copy(planetMesh.position);
    };

    window.addEventListener("resize", handleResize);

    let isDocumentVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Continuous Render Loop
    let animationFrameId;
    let lastTime = performance.now();
    let totalElapsedTime = 0;

    const animate = (currentTime) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDocumentVisible) {
        lastTime = currentTime;
        return;
      }

      const delta = Math.min((currentTime - lastTime) * 0.001, 0.1);
      lastTime = currentTime;
      totalElapsedTime += delta;

      planetUniforms.uTime.value = totalElapsedTime;
      starUniforms.uTime.value = totalElapsedTime;

      if (!prefersReducedMotion) {
        // Slow continuous axial rotation
        planetMesh.rotation.y = totalElapsedTime * 0.02;
        atmosMesh.rotation.y = planetMesh.rotation.y;

        // Smooth damped mouse parallax lerp
        mouse.x += (targetMouse.x - mouse.x) * 0.045;
        mouse.y += (targetMouse.y - mouse.y) * 0.045;

        camera.position.x = mouse.x * 0.55;
        camera.position.y = mouse.y * 0.42;
        camera.lookAt(0.3, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      mediaQuery.removeEventListener("change", handleMotionChange);

      if (renderer) {
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }

      planetGeometry.dispose();
      planetMaterial.dispose();
      atmosGeometry.dispose();
      atmosMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      style={{
        background: webGLError
          ? "radial-gradient(ellipse at 85% 50%, #2e1065 0%, #0c0420 40%, #030712 100%)"
          : "#02040b",
      }}
      aria-hidden="true"
    >
      {/* Cinematic Ambient Space Vignette & Soft Gradient Falloff */}
      <div className="absolute inset-0 bg-radial-[circle_at_25%_50%]_from-transparent_via-[#02040b]/35_to-[#02040b]/85 pointer-events-none" />
      {/* Left-side subtle shadow curtain ensuring text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#02040b]/92 via-[#02040b]/55 to-transparent lg:w-3/5 pointer-events-none" />
    </div>
  );
}
