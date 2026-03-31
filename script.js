let scene, camera, renderer, particles, textMesh;
let scaleFactor = 1;
let started = false;

document.getElementById("startBtn").addEventListener("click", async () => {
  if (started) return;
  started = true;

  document.getElementById("startBtn").style.display = "none";

  await startCamera();
  initThree();
  initHands();
  animate();
});

// CAMERA
async function startCamera() {
  const video = document.getElementById("video");

  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" }
  });

  video.srcObject = stream;
}

// THREE INIT
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
  createText();
}

// ❤️ HEART
function createHeart() {
  const geometry = new THREE.BufferGeometry();
  const count = 1500;

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

    positions[i * 3] = x * 0.08;
    positions[i * 3 + 1] = y * 0.08;
    positions[i * 3 + 2] = z * 0.08;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xff3366,
    size: 0.06
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

// ❤️ TEXT (Mehboob ❤️ Sameera)
function createText() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 512;
  canvas.height = 256;

  ctx.fillStyle = "white";
  ctx.font = "bold 40px Arial";
  ctx.textAlign = "center";

  ctx.fillText("Mehboob ❤️ Sameera", 256, 130);

  const texture = new THREE.CanvasTexture(canvas);

  const material = new THREE.SpriteMaterial({ map: texture });

  textMesh = new THREE.Sprite(material);
  textMesh.scale.set(3, 1.5, 1);

  scene.add(textMesh);
}

// 🤚 HAND CONTROL
function initHands() {
  const video = document.getElementById("video");

  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
  });

  hands.onResults((results) => {
    if (results.multiHandLandmarks.length > 0) {
      const lm = results.multiHandLandmarks[0];

      let thumbY = lm[4].y;
      let indexY = lm[8].y;

      if (thumbY < indexY) {
        scaleFactor += 0.03;
      } else {
        scaleFactor -= 0.03;
      }

      scaleFactor = Math.max(0.5, Math.min(2.5, scaleFactor));
    }
  });

  const cam = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 320,
    height: 240
  });

  cam.start();
}

// ANIMATE
function animate() {
  requestAnimationFrame(animate);

  if (particles) {
    particles.rotation.y += 0.01;
    particles.scale.set(scaleFactor, scaleFactor, scaleFactor);
  }

  renderer.render(scene, camera);
    }
