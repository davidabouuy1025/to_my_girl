// --- Scene setup ---
function sceneSetup() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return { scene, camera, renderer };
}
const { scene, camera, renderer } = sceneSetup();

//  ------------------------------------------------

// --- Add Texts ---
function createText(text, x, y, z, style) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = style;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });

    const geometry = new THREE.PlaneGeometry(12, 3);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
}
// Edit here ↓↓↓
createText("🎂 Happy Birthday 🎉", 0, 8, 0, 'bold 100px Arial');
createText("19", 7, 0, 0, 'bold 250px Verdana')
createText("Click Me", -7, 1, 1, 'bold italic 50px Verdana')
createText("Click Me", 0, -2, 7, 'bold italic 50px Verdana')


// --- Load Sound ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// List of audio files
const audioFiles = [
    'audio/audio1.mp3',
    'audio/audio2.mp3',
    'audio/audio3.mp3',
    'audio/audio4.mp3'
];

const audioFile = [
    'audio/audio10.mp3',
    'audio/audio11.mp3'
]

// Preload sounds
const heartAudioList = audioFile.map(src => {
    const a = new Audio(src);
    a.volume = 1;
    return a;
});

const audioList = audioFiles.map(src => {
    const a = new Audio(src);
    a.volume = 1;
    return a;
});

function createStar() {
    const geometry = new THREE.SphereGeometry(0.1, 12, 12);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
    star.position.set(x, y, z);
    scene.add(star);
}
Array(3500).fill().forEach(createStar);


const cakeParts = [];

// --- Add Cake ---
function createCake(scene) {
    const layerHeights = [2.5, 2, 1.5, 0.8];
    const layerRadii = [4.5, 3.5, 2.5, 1.8];
    const layerColors = [0xff9999, 0xffcc99, 0x99ccff, 0xcc99ff];
    let currentY = -5;
    let currentZ = 2;

    for (let i = 0; i < 4; i++) {
        const geometry = new THREE.CylinderGeometry(layerRadii[i], layerRadii[i], layerHeights[i], 64);
        const material = new THREE.MeshStandardMaterial({
            color: layerColors[i],
            emissive: new THREE.Color(layerColors[i]).multiplyScalar(0.5),
            roughness: 0.5,
            metalness: 0.2
        });
        const layer = new THREE.Mesh(geometry, material);
        currentY += layerHeights[i] / 2;
        layer.position.set(0, currentY, currentZ);
        scene.add(layer);
        cakeParts.push(layer);

        const stripeGeo = new THREE.TorusGeometry(layerRadii[i] * 1, 0.05, 8, 100);
        const stripeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff0f0, emissiveIntensity: 0.2 });
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.rotation.x = Math.PI / 2;
        stripe.position.set(0, currentY + layerHeights[i] / 2 - 0.05, currentZ + 0.1);
        scene.add(stripe);

        currentY += layerHeights[i] / 2;
    }

    const candleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
    const candleMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff44, emissiveIntensity: 0.6 });
    const flameMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });

    const topLayerRadius = layerRadii[layerRadii.length - 1];
    const topLayerHeight = layerHeights[layerHeights.length - 1];
    const topY = currentY - topLayerHeight / 2 + 0.4;

    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const radius = topLayerRadius * 0.7;

        const candle = new THREE.Mesh(candleGeometry, candleMaterial);
        candle.position.set(Math.cos(angle) * radius, topY, currentZ + Math.sin(angle) * radius);
        scene.add(candle);
        cakeParts.push(candle);

        const flameGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.set(Math.cos(angle) * radius, topY + 0.35, currentZ + Math.sin(angle) * radius);
        scene.add(flame);

        const glow = new THREE.PointLight(0xffaa00, 0.8, 3);
        glow.position.copy(flame.position);
        scene.add(glow);
    }
}
createCake(scene);

// --- Add love ---
let heartMesh;
let spinning = false;
let spinTime = 0;
const maxSpinDuration = 70; // frames, ~1.5-2 seconds

function createLoveInteractive() {
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, 3, -3, 3, -3, 0);
    heartShape.bezierCurveTo(-3, -3, 0, -4, 0, -6);
    heartShape.bezierCurveTo(0, -4, 3, -3, 3, 0);
    heartShape.bezierCurveTo(3, 3, 0, 3, 0, 0);

    const extrudeSettings = {
        depth: 0.5,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 2
    };

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({
        color: 0xff0000,         // normal red
        metalness: 0.3,
        roughness: 0.4,
        emissive: 0x660000,     // subtle glow normally
        emissiveIntensity: 0.3
    });

    heartMesh = new THREE.Mesh(geometry, material);
    heartMesh.scale.set(0.7, 0.5, 0.7);
    heartMesh.position.set(-7, 2, 0);
    scene.add(heartMesh);

    // Add click listener using Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('click', (event) => {
        // Convert mouse coords to normalized device coords
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(heartMesh);
        if (intersects.length > 0) {
            spinning = true;
            spinTime = 0;
            heartMesh.material.emissive.set(0xff0000);
        }
    });
}
createLoveInteractive();

// --- Add Image ---
function createImage(path, w, h, x, y, z) {
    const loader = new THREE.TextureLoader();
    loader.load(path, (texture) => {
        texture.encoding = THREE.sRGBEncoding;
        const geometry = new THREE.PlaneGeometry(w, h);
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const photo = new THREE.Mesh(geometry, material);
        photo.position.set(x, y, z);
        scene.add(photo);
    });
}

// Edit here ↓↓↓
createImage('personal_img/9.jpg', 15, 15, 42, -11, -10);
createImage('personal_img/2.jpg', 22, 25, -25, 20, -25);
createImage('personal_img/3.jpg', 30, 33, -40, -25, -40);
createImage('personal_img/4.jpg', 12, 17, -37, -9, -5);
createImage('personal_img/5.jpg', 30, 30, 60, 20, -20);
createImage('personal_img/6.jpg', 25, 25, 33, 30, -30);
createImage('personal_img/7.jpg', 20, 20, 45, 5, -40);
createImage('personal_img/8.jpg', 30, 30, -75, 25, -40);
createImage('personal_img/1.jpg', 35, 35, 40, -30, -40);
createImage('personal_img/us.jpg', 600, 300, 10, 0, 250);

//  ------------------------------------------------

// Ambient light for general illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Directional light for shading
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);


// --- Camera position ---
camera.position.set(0, 0, 25);
camera.lookAt(0, 0, 0);


// --- Mouse rotation with front view restriction ---
let isDragging = false;
let autoRotate = true;
let previousMouseX = 0;
let rotationY = 0;
let rotationSpeed = 0;

const minRotation = -Math.PI;
const maxRotation = Math.PI;

document.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
    autoRotate = false;  // stop auto-spin while dragging
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    // optionally you can resume autoRotate after a delay
    // autoRotate = true;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        rotationSpeed = deltaX * 0.002;
        rotationY += rotationSpeed;
        rotationY = Math.max(minRotation, Math.min(maxRotation, rotationY));
        previousMouseX = e.clientX;
    }
});

document.addEventListener('wheel', (event) => {
    const zoomSpeed = 0.01;
    camera.position.z += event.deltaY * zoomSpeed;
    camera.position.z = Math.max(13, Math.min(40, camera.position.z));

    // restore auto-rotation after zoom
    if (!isDragging) autoRotate = true;
});

// --- Detect clicks on cake ---
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cakeParts);

    if (intersects.length > 0) {
        // pick random sound
        const randomIndex = Math.floor(Math.random() * audioList.length);
        const sound = audioList[randomIndex];

        // stop any currently playing sounds
        audioList.forEach(a => { a.pause(); a.currentTime = 0; });

        // play new one
        sound.play();

        // visual feedback
        const obj = intersects[0].object;
        obj.material.emissive.set(0xff0000);
        setTimeout(() => obj.material.emissive.set(0x000000), 400);
    }
});

// --- Detect clicks on heart ---
const raycasterHeart = new THREE.Raycaster();
const mouseHeart = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouseHeart.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseHeart.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycasterHeart.setFromCamera(mouseHeart, camera);
    const intersects = raycasterHeart.intersectObject(heartMesh);

    if (intersects.length > 0) {
        // pick random sound
        const randomIndex = Math.floor(Math.random() * heartAudioList.length);
        const sound = heartAudioList[randomIndex];

        // stop any currently playing sounds
        heartAudioList.forEach(a => { a.pause(); a.currentTime = 0; });

        // play new one
        sound.play();

        // Heart glow + spin effect
        spinning = true;
        spinTime = 0;
        heartMesh.material.emissive.set(0xff0000);
    }
});

// --- Animation loop ---
function animate() {
    requestAnimationFrame(animate);

    // --- Auto-spin ---
    if (!isDragging) {
        scene.rotation.y += 0.001; // slow continuous rotation
    }

    // --- Drag / momentum ---
    if (isDragging || Math.abs(rotationSpeed) > 0.0001) {
        scene.rotation.y += rotationSpeed;
        rotationSpeed *= 0.25; // damping
    }

    // Heart spinning
    if (spinning && heartMesh) {
        heartMesh.rotation.y += 0.5;
        spinTime++;
        if (spinTime > maxSpinDuration) {
            spinning = false;
            heartMesh.material.emissive.set(0xff0000);
        }

    }

    renderer.render(scene, camera);
}
animate();

// --- Responsive ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
