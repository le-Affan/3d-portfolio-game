/**
 * 3D Portfolio Game - Main JavaScript File
 * Built with Three.js for immersive portfolio exploration
 * Author: Affan Shaikh
 */

// Global variables
let scene, camera, renderer, controls;
let player = { height: 1.8, speed: 12, jumpHeight: 20, grounded: false };
let raycaster, mouse, projectsData = null;
let platforms = [];
let infoScreens = [];
let particles = [];
let clock;

// Movement variables
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let velocity, direction;
let prevTime = performance.now();

// Initialize the game
async function init() {
    try {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            throw new Error('Three.js failed to load. Please check your internet connection.');
        }
        
        console.log('Three.js loaded successfully');
        
        // Initialize Three.js variables now that library is loaded
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        clock = new THREE.Clock();
        velocity = new THREE.Vector3();
        direction = new THREE.Vector3();
        
        // Load project data
        try {
            const response = await fetch('./projects.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            projectsData = await response.json();
        } catch (fetchError) {
            console.warn('Failed to load projects.json, using fallback data:', fetchError);
            // Use embedded fallback data
            projectsData = {
                "personalInfo": {
                    "name": "Affan Shaikh",
                    "email": "shaikhaffan.work@gmail.com",
                    "linkedin": "https://www.linkedin.com/in/affan-shaikh-ml/",
                    "github": "https://github.com/le-Affan"
                },
                "projects": [
                    {
                        "id": "data-analyst-agent",
                        "name": "Data Analyst AI Agent",
                        "description": "Built AI agent for dynamic data analysis and Q&A across CSV, Excel, Text, PDF, Image, and Audio. Automated visualizations using Matplotlib and Seaborn.",
                        "techStack": ["Python", "LLaMA-4 Maverick", "Together.ai API"],
                        "githubUrl": "https://github.com/le-Affan/Data-Analyst-Agent",
                        "position": { "x": 0, "y": 2, "z": 0 },
                        "color": "#00ff88"
                    },
                    {
                        "id": "crypto-trading-bot",
                        "name": "Crypto Trading Bot",
                        "description": "Developed Python CLI bot supporting mock market, limit, and stop-limit orders. Implemented input validation and systematic logging.",
                        "techStack": ["Python", "python-binance", "CLI", "Logging"],
                        "githubUrl": "https://github.com/le-Affan/basic_binance_bot",
                        "position": { "x": 15, "y": 2, "z": -10 },
                        "color": "#ff6b35"
                    },
                    {
                        "id": "pdf-processing-tool",
                        "name": "PDF Processing Tool",
                        "description": "Extracted structured outlines from PDFs for Adobe Connect The Dots Hackathon 2025. Dockerized solution for reproducible execution.",
                        "techStack": ["Python", "PDFplumber", "Docker", "Regex", "JSON"],
                        "githubUrl": "https://github.com/le-Affan/PDF-Outline-Extractor",
                        "position": { "x": -15, "y": 2, "z": -10 },
                        "color": "#4ecdc4"
                    }
                ]
            };
        }
        
        console.log('Projects loaded:', projectsData);
        
        // Setup Three.js scene
        setupScene();
        setupLighting();
        setupPlayer();
        setupControls();
        setupEventListeners();
        
        // Create game world
        await createWorld();
        
        // Hide loading screen
        document.getElementById('loading').style.display = 'none';
        
        // Start render loop
        animate();
        
    } catch (error) {
        console.error('Failed to initialize game:', error);
        document.getElementById('loading').innerHTML = `
            <h1>Failed to load game</h1>
            <p>Error: ${error.message}</p>
            <p>Please check console for details</p>
            <button onclick="location.reload()" style="background:#00ff88;color:black;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;font-size:16px;">Retry</button>
        `;
    }
}

function setupScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 0, 100);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, player.height, 5);
    
    // Create renderer
    const canvas = document.getElementById('gameCanvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

function setupLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    // Main directional light (like sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);
    
    // Add some colorful point lights for ambiance
    const colors = [0x00ff88, 0xff6b35, 0x4ecdc4, 0x845ec2];
    const positions = [
        [20, 10, 20],
        [-20, 10, 20],
        [20, 10, -20],
        [-20, 10, -20]
    ];
    
    colors.forEach((color, index) => {
        const light = new THREE.PointLight(color, 0.3, 30);
        light.position.set(...positions[index]);
        scene.add(light);
    });
}

function setupPlayer() {
    // Player is represented by the camera position
    camera.position.y = player.height;
}

function setupControls() {
    // Try to setup PointerLockControls, fallback if not available
    try {
        if (typeof THREE.PointerLockControls !== 'undefined') {
            controls = new THREE.PointerLockControls(camera, document.body);
            scene.add(controls.getObject());
            
            // Handle pointer lock events
            controls.addEventListener('lock', function() {
                document.getElementById('instructions').style.display = 'none';
                document.getElementById('hud').style.display = 'block';
                document.getElementById('crosshair').style.display = 'block';
            });
            
            controls.addEventListener('unlock', function() {
                document.getElementById('hud').style.display = 'none';
                document.getElementById('crosshair').style.display = 'none';
            });
        } else {
            throw new Error('PointerLockControls not available');
        }
    } catch (error) {
        console.warn('PointerLockControls failed, using fallback:', error);
        
        // Create a simple fallback controls object
        controls = {
            getObject: function() { return camera; },
            lock: function() {
                document.getElementById('instructions').style.display = 'none';
                document.getElementById('hud').style.display = 'block';
                document.getElementById('crosshair').style.display = 'block';
                this.isLocked = true;
            },
            unlock: function() {
                document.getElementById('hud').style.display = 'none';
                document.getElementById('crosshair').style.display = 'none';
                this.isLocked = false;
            },
            isLocked: false,
            moveRight: function(distance) { 
                camera.translateX(-distance); 
            },
            moveForward: function(distance) { 
                camera.translateZ(-distance); 
            },
            addEventListener: function() {}
        };
        
        // Setup mouse controls for fallback
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', function(event) {
            if (!controls.isLocked) return;
            
            mouseX += event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            mouseY += event.movementY || event.mozMovementY || event.webkitMovementY || 0;
            
            camera.rotation.y = -mouseX * 0.002;
            camera.rotation.x = -mouseY * 0.002;
            camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));
        });
    }
}

function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    
    // Mouse controls for clicking screens
    document.addEventListener('click', onMouseClick);
    
    // Window resize
    window.addEventListener('resize', onWindowResize);
}

function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
        case 'Space':
            if (player.grounded) jump();
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
}

function onMouseClick(event) {
    if (!controls.isLocked) return;
    
    // Check for clicks on info screens
    checkScreenClicks();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function jump() {
    velocity.y += player.jumpHeight;
    player.grounded = false;
}

async function createWorld() {
    // Create ground
    createGround();
    
    // Create project platforms and info screens
    await createProjectPlatforms();
    
    // Create particle effects
    createParticles();
    
    // Create welcome screen
    createWelcomeScreen();
}

function createGround() {
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x1a1a1a,
        transparent: true,
        opacity: 0.8
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Add grid pattern to ground
    const gridHelper = new THREE.GridHelper(100, 50, 0x00ff88, 0x333333);
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
}

async function createProjectPlatforms() {
    projectsData.projects.forEach((project, index) => {
        createPlatform(project);
        createInfoScreen(project);
    });
}

function createPlatform(project) {
    // Platform geometry
    const platformGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 8);
    const platformMaterial = new THREE.MeshLambertMaterial({ 
        color: project.color,
        emissive: project.color,
        emissiveIntensity: 0.2
    });
    
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(project.position.x, project.position.y, project.position.z);
    platform.castShadow = true;
    platform.receiveShadow = true;
    
    // Add glow effect
    const glowGeometry = new THREE.CylinderGeometry(3.5, 3.5, 0.1, 8);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: project.color,
        transparent: true,
        opacity: 0.3
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(platform.position);
    glow.position.y -= 0.3;
    
    scene.add(platform);
    scene.add(glow);
    platforms.push({ platform, glow, project });
    
    // Add floating particles around platform
    createPlatformParticles(project);
}

function createInfoScreen(project) {
    // Create screen geometry
    const screenGeometry = new THREE.PlaneGeometry(6, 4);
    
    // Create canvas for screen content
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 342;
    const ctx = canvas.getContext('2d');
    
    // Draw screen content
    drawScreenContent(ctx, project);
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    const screenMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.9
    });
    
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(
        project.position.x,
        project.position.y + 4,
        project.position.z
    );
    
    // Make screen face the player spawn point
    screen.lookAt(0, screen.position.y, 5);
    
    // Add screen border/frame
    const borderGeometry = new THREE.PlaneGeometry(6.2, 4.2);
    const borderMaterial = new THREE.MeshBasicMaterial({ 
        color: project.color,
        transparent: true,
        opacity: 0.7
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.copy(screen.position);
    border.position.z -= 0.01;
    border.lookAt(0, border.position.y, 5);
    
    scene.add(border);
    scene.add(screen);
    
    infoScreens.push({ screen, border, project, canvas, texture });
}

function drawScreenContent(ctx, project) {
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 512, 342);
    
    // Draw border
    ctx.strokeStyle = project.color;
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 492, 322);
    
    // Title
    ctx.fillStyle = project.color;
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(project.name, 256, 50);
    
    // Description (word wrap)
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    const words = project.description.split(' ');
    let line = '';
    let y = 90;
    const maxWidth = 470;
    
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, 30, y);
            line = words[n] + ' ';
            y += 20;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, 30, y);
    
    // Tech stack
    ctx.fillStyle = project.color;
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Tech Stack:', 30, y + 40);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    const techText = project.techStack.join(' • ');
    ctx.fillText(techText, 30, y + 65);
    
    // GitHub link button
    ctx.fillStyle = project.color;
    ctx.fillRect(30, y + 85, 150, 35);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('View on GitHub', 105, y + 107);
    
    // Contact links
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('LinkedIn • GitHub • Email', 200, y + 107);
}

function createPlatformParticles(project) {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = project.position.x + (Math.random() - 0.5) * 10;
        positions[i3 + 1] = project.position.y + Math.random() * 8;
        positions[i3 + 2] = project.position.z + (Math.random() - 0.5) * 10;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: project.color,
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particles.push(particleSystem);
}

function createParticles() {
    // Background ambient particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = Math.random() * 50;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00ff88,
        size: 0.05,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    
    const backgroundParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(backgroundParticles);
    particles.push(backgroundParticles);
}

function createWelcomeScreen() {
    // Create welcome screen at spawn
    const screenGeometry = new THREE.PlaneGeometry(8, 5);
    
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    
    // Draw welcome content
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 512, 320);
    
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 492, 300);
    
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Welcome!', 256, 60);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText(`I'm ${projectsData.personalInfo.name}`, 256, 100);
    
    ctx.font = '16px Arial';
    ctx.fillText('Explore my projects by jumping between platforms', 256, 140);
    ctx.fillText('Click on floating screens to visit links', 256, 165);
    
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Use WASD to move, SPACE to jump', 256, 210);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText('LinkedIn • GitHub • Email available on project screens', 256, 250);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.9
    });
    
    const welcomeScreen = new THREE.Mesh(screenGeometry, material);
    welcomeScreen.position.set(0, 6, -2);
    scene.add(welcomeScreen);
}

function checkScreenClicks() {
    // Cast ray from camera
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    
    // Check intersections with info screens
    const screenMeshes = infoScreens.map(screen => screen.screen);
    const intersects = raycaster.intersectObjects(screenMeshes);
    
    if (intersects.length > 0) {
        const clickedScreen = intersects[0].object;
        const screenData = infoScreens.find(s => s.screen === clickedScreen);
        
        if (screenData) {
            // Check if click is on GitHub button area (rough approximation)
            const uv = intersects[0].uv;
            
            // GitHub button is roughly in the lower left area
            if (uv.x > 0.05 && uv.x < 0.35 && uv.y < 0.25) {
                window.open(screenData.project.githubUrl, '_blank');
            } else {
                // Show contact options
                showContactOptions();
            }
        }
    }
}

function showContactOptions() {
    const options = [
        { name: 'LinkedIn', url: projectsData.personalInfo.linkedin },
        { name: 'GitHub', url: projectsData.personalInfo.github },
        { name: 'Email', url: `mailto:${projectsData.personalInfo.email}` }
    ];
    
    const choice = prompt('Contact options:\n1. LinkedIn\n2. GitHub\n3. Email\n\nEnter 1, 2, or 3:');
    
    if (choice >= 1 && choice <= 3) {
        window.open(options[choice - 1].url, '_blank');
    }
}

function updateMovement() {
    const time = performance.now();
    const delta = (time - prevTime) / 1000;
    
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 9.8 * 8.0 * delta; // gravity
    
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();
    
    if (moveForward || moveBackward) velocity.z -= direction.z * player.speed * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * player.speed * delta;
    
    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    
    controls.getObject().position.y += (velocity.y * delta);
    
    // Ground collision
    if (controls.getObject().position.y < player.height) {
        velocity.y = 0;
        controls.getObject().position.y = player.height;
        player.grounded = true;
    }
    
    prevTime = time;
}

function animateParticles() {
    const time = clock.getElapsedTime();
    
    particles.forEach((particleSystem, index) => {
        if (index === 0) {
            // Animate background particles
            particleSystem.rotation.y = time * 0.1;
        } else {
            // Animate platform particles
            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] += Math.sin(time + i) * 0.01;
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    updateMovement();
    animateParticles();
    
    // Animate platform glows
    platforms.forEach(({ glow }) => {
        glow.material.opacity = 0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
    });
    
    renderer.render(scene, camera);
}

// Game start function
function startGame() {
    controls.lock();
}

// Initialize game when page loads
window.addEventListener('load', init);
