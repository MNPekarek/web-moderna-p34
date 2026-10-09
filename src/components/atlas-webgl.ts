import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  uniform float uProgress;
  void main() {
    vUv = uv;
    float column = floor(uv.x * 12.0);
    float phase = clamp((uProgress - column * 0.018) / 0.80, 0.0, 1.0);
    float depth = sin(phase * 3.14159265) * (0.012 + mod(column, 3.0) * 0.004);
    vec3 displaced = position;
    displaced.z += depth;
    displaced.x += sin(phase * 3.14159265) * (mod(column, 2.0) - 0.5) * 0.012;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform sampler2D uCurrent;
  uniform sampler2D uNext;
  uniform float uProgress;
  uniform float uAspect;
  varying vec2 vUv;

  float ease(float x) {
    return x * x * (3.0 - 2.0 * x);
  }

  void main() {
    vec2 uv = vUv;
    float imageAspect = 1.775;
    if (uAspect > imageAspect) {
      uv.y = (uv.y - 0.5) * (imageAspect / uAspect) + 0.5;
    } else {
      uv.x = (uv.x - 0.5) * (uAspect / imageAspect) + 0.5;
    }
    float band = floor(vUv.x * 12.0);
    float delay = band * 0.018;
    float p = ease(clamp((uProgress - delay) / 0.80, 0.0, 1.0));
    float aperture = sin(p * 3.14159265);
    float direction = mod(band, 2.0) < 1.0 ? -1.0 : 1.0;
    float depth = aperture * (0.009 + mod(band, 3.0) * 0.003);
    float sweep = (p - 0.5) * 0.026;
    vec2 currentUv = uv + vec2(sweep + direction * depth, depth * 0.28 / max(uAspect, 0.7));
    vec2 nextUv = uv - vec2((1.0 - p) * 0.025 - direction * depth, depth * 0.2 / max(uAspect, 0.7));
    float glass = sin(uv.y * 34.0 + band * 1.7) * 0.0018 * aperture;
    currentUv.x += glass;
    nextUv.x -= glass;
    vec4 currentColor = texture2D(uCurrent, currentUv);
    vec4 nextColor = texture2D(uNext, nextUv);
    float seam = smoothstep(0.485, 0.5, fract(vUv.x * 12.0));
    seam *= 1.0 - smoothstep(0.5, 0.515, fract(vUv.x * 12.0));
    vec3 color = mix(currentColor.rgb, nextColor.rgb, p);
    color += seam * aperture * 0.055;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export type AtlasRenderer = {
  transitionTo: (src: string) => Promise<void>;
  resize: () => void;
  setVisible: (visible: boolean) => void;
  dispose: () => void;
};

function loadTexture(loader: THREE.TextureLoader, src: string) {
  return new Promise<THREE.Texture>((resolve, reject) => {
    loader.load(src, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      resolve(texture);
    }, undefined, reject);
  });
}

export async function createAtlasRenderer(canvas: HTMLCanvasElement, initialSrc: string): Promise<AtlasRenderer> {
  const container = canvas.parentElement;
  if (!container) throw new Error("Atlas canvas requires a container");

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
  camera.position.z = 1;
  const loader = new THREE.TextureLoader();
  let currentTexture = await loadTexture(loader, initialSrc);
  let nextTexture = currentTexture;
  let visible = true;
  let frame = 0;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uCurrent: { value: currentTexture },
      uNext: { value: nextTexture },
      uProgress: { value: 0 },
      uAspect: { value: 1 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  });
  const geometry = new THREE.PlaneGeometry(2, 2, 48, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
    material.uniforms.uAspect.value = width / Math.max(height, 1);
    if (visible) renderer.render(scene, camera);
  };
  resize();

  const transitionTo = async (src: string) => {
    cancelAnimationFrame(frame);
    nextTexture = await loadTexture(loader, src);
    material.uniforms.uNext.value = nextTexture;
    material.uniforms.uProgress.value = 0;
    const start = performance.now();
    const duration = 1420;

    await new Promise<void>((resolve) => {
      const render = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        material.uniforms.uProgress.value = progress;
        if (visible) renderer.render(scene, camera);
        if (progress < 1) frame = requestAnimationFrame(render);
        else resolve();
      };
      frame = requestAnimationFrame(render);
    });

    if (currentTexture !== nextTexture) currentTexture.dispose();
    currentTexture = nextTexture;
    material.uniforms.uCurrent.value = currentTexture;
    material.uniforms.uProgress.value = 0;
  };

  return {
    transitionTo,
    resize,
    setVisible(value) { visible = value; if (visible) renderer.render(scene, camera); },
    dispose() {
      cancelAnimationFrame(frame);
      currentTexture.dispose();
      if (nextTexture !== currentTexture) nextTexture.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
