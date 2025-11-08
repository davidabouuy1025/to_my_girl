// --- Scene setup ---
const scene = new THREE.Scene();

// THREE.PerspectiveCamera(FOV, aspect ratio, near clipping plane, far clipping plane)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// Create renderer and smooths jagged edges on objects.
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Sets the canvas size to fill the browser window.
renderer.setSize(window.innerWidth, window.innerHeight);

// Adds the renderer’s canvas element to the HTML body
document.body.appendChild(renderer.domElement);


// --- Add stars ---
function createStar() {
  // SphereGeometry(radius, segment)
  const geometry = new THREE.SphereGeometry(0.1, 12, 12);

  // MeshBasicMaterial({color:}) 
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // Combine into visible 3D object  
  const star = new THREE.Mesh(geometry, material);

  // Generate random positions
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));

  // Set position
  star.position.set(x, y, z);
  scene.add(star);
}

// Create 1000 stars
Array(1000).fill().forEach(createStar);


// Camera initial position
camera.position.z = 50;

// Mouse rotation variables
let isDragging = false;
let previousMouseX = 0;
let rotationSpeed = 0;

// Mouse events
document.addEventListener('mousedown', (e) => {
  isDragging = true;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaX = e.clientX - previousMouseX;
    rotationSpeed = deltaX * 0.002; // adjust sensitivity
    previousMouseX = e.clientX;
  }
});


// --- Animation loop ---
function animate() {
  requestAnimationFrame(animate);

  // rotate scene based on mouse
  scene.rotation.y += rotationSpeed;
  
  // slow down rotation gradually
  rotationSpeed *= 0.95;

  renderer.render(scene, camera);
}

animate();

// Make responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
