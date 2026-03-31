let scene, camera, renderer, particles;
let started = false;

document.getElementById("startBtn").addEventListener("click", async () => {
  if (started) return;
  started = true;

  document.getElementById("startBtn").style.display = "none";

  await startCamera();
  initThree();
  animate();
});

async function startCamera() {
  const video = document.getElementById("video");

  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: false
  });

  video.srcObject = stream;
}

function initThree() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvas"),
    alpha: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  createHeart();
}

function createHeart() {
  const geometry = new THREE.BufferGeometry();
  const count = 1200;

  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    let t = Math.random() * Math.PI * 2;

    let x = 16 * Math.pow(Math.sin(t), 3);
    let y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    let z = (Math.random() - 0.5) * 2;

    positions[i * 3] = x * 0.05;
    positions[i * 3 + 1] = y * 0.05;
    positions[i * 3 + 2] = z * 0.05;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xff3366,
    size: 0.05
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

function animate() {
  requestAnimationFrame(animate);

  if (particles) {
    particles.rotation.y += 0.01;
    particles.rotation.x += 0.005;
  }

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
