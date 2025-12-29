document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initCounters();
    initPortfolioFilter();
    initContactForm(); // This is the updated jQuery version
    initSmoothScrolling();
    initHyperspeedBackground();
});

// Navigation and other functions...


function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
    const startColor = { r: 220, g: 20, b: 60 };
    const endColor = { r: 220, g: 19, b: 135 };
    const maxScroll = 3000;
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        const scrollY = window.scrollY;

        let progress = Math.min(scrollY / maxScroll, 1);

        progress = progress * (2 - progress);

        const r = Math.round(startColor.r + (endColor.r - startColor.r) * progress);
        const g = Math.round(startColor.g + (endColor.g - startColor.g) * progress);
        const b = Math.round(startColor.b + (endColor.b - startColor.b) * progress);

        const opacity = 0.95 + (0.03 * progress);

        navbar.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    });
}

function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => animateCounter(stat));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statNumbers.length > 0) {
        observer.observe(document.querySelector('.about-stats'));
    }
}

function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            formMessage.textContent = 'Sending...';
            formMessage.className = 'form-message info';

            fetch('process.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        formMessage.textContent = data.message;
                        formMessage.className = 'form-message success';
                        contactForm.reset();
                    } else {
                        formMessage.textContent = data.message;
                        formMessage.className = 'form-message error';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    formMessage.textContent = 'An error occurred. Please try again.';
                    formMessage.className = 'form-message error';
                });
        });
    }
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function () {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                window.scrollTo({
                    top: contactSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }
}

function initHyperspeedBackground() {
    const effectOptions = {
        distortion: 'turbulentDistortion',
        length: 400,
        roadWidth: 10,
        islandWidth: 2,
        lanesPerRoad: 4,
        fov: 90,
        fovSpeedUp: 150,
        speedUp: 2,
        carLightsFade: 0.4,
        totalSideLightSticks: 20,
        lightPairsPerRoadWay: 40,
        shoulderLinesWidthPercentage: 0.05,
        brokenLinesWidthPercentage: 0.1,
        brokenLinesLengthPercentage: 0.5,
        lightStickWidth: [0.12, 0.5],
        lightStickHeight: [1.3, 1.7],
        movingAwaySpeed: [60, 80],
        movingCloserSpeed: [-120, -160],
        carLightsLength: [400 * 0.03, 400 * 0.2],
        carLightsRadius: [0.05, 0.14],
        carWidthPercentage: [0.3, 0.5],
        carShiftX: [-0.8, 0.8],
        carFloorSeparation: [0, 5],
        colors: {
            roadColor: 0x080808,
            islandColor: 0x0a0a0a,
            background: 0x000000,
            shoulderLines: 0xFFFFFF,
            brokenLines: 0xFFFFFF,
            leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
            rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
            sticks: 0x03B3C3,
        }
    };

    const canvas = document.createElement('canvas');
    canvas.id = 'hyperspeed-canvas';
    document.body.appendChild(canvas);

    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        createFallbackBackground();
        return;
    }

    try {
        const hyperspeedApp = new HyperspeedBackground(canvas, effectOptions);
        hyperspeedApp.init();
    } catch (error) {
        console.error('Error initializing hyperspeed background:', error);
        createFallbackBackground();
    }
}

class HyperspeedBackground {
    constructor(canvas, options) {
        this.canvas = canvas;
        this.options = options;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.materials = [];
        this.meshes = [];
        this.clock = new THREE.Clock();
        this.time = 0;
        this.speed = 1;
        this.isInteracting = false;
    }

    init() {
        this.initRenderer();
        this.initScene();
        this.initCamera();
        this.createTunnel();
        this.createLights();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 50, 300);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
    }

    createTunnel() {
        const tunnelGeometry = new THREE.CylinderGeometry(8, 12, 100, 32, 100, true);

        const tunnelMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0x8B0000) },
                color2: { value: new THREE.Color(0xDC143C) },
                speed: { value: this.speed }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                uniform float time;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    
                    // Add some distortion
                    float distortion = sin(position.y * 0.5 + time * 2.0) * 0.2;
                    vec3 newPosition = position + normal * distortion;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float speed;
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    // Create moving stripes effect
                    float stripe = sin(vPosition.z * 0.5 - time * speed * 5.0) * 0.5 + 0.5;
                    vec3 color = mix(color1, color2, stripe);
                    
                    // Add radial gradient
                    float distanceFromCenter = length(vUv - 0.5);
                    float alpha = 1.0 - smoothstep(0.3, 0.5, distanceFromCenter);
                    
                    gl_FragColor = vec4(color, alpha * 0.6);
                }
            `,
            transparent: true,
            side: THREE.BackSide
        });

        this.materials.push(tunnelMaterial);

        const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
        tunnel.rotation.x = Math.PI / 2;
        this.scene.add(tunnel);
        this.meshes.push(tunnel);
    }

    createLights() {
        const lightCount = 50;
        const lightGeometry = new THREE.SphereGeometry(0.1, 8, 8);

        for (let i = 0; i < lightCount; i++) {
            const lightMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
                transparent: true,
                opacity: 0.8
            });

            const light = new THREE.Mesh(lightGeometry, lightMaterial);

            const radius = 6 + Math.random() * 4;
            const angle = Math.random() * Math.PI * 2;
            const height = Math.random() * 80 - 40;

            light.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                height
            );

            light.userData = {
                speed: 2 + Math.random() * 3,
                radius: radius,
                angle: angle
            };

            this.scene.add(light);
            this.meshes.push(light);
            this.materials.push(lightMaterial);
        }
    }

    createParticles() {
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const radius = Math.random() * 15;
            const angle = Math.random() * Math.PI * 2;
            const height = Math.random() * 100 - 50;

            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = Math.sin(angle) * radius;
            positions[i * 3 + 2] = height;

            colors[i * 3] = 0.8 + Math.random() * 0.2;
            colors[i * 3 + 1] = Math.random() * 0.3;
            colors[i * 3 + 2] = 0.2 + Math.random() * 0.3;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.userData = {
            speed: 3
        };

        this.scene.add(particles);
        this.meshes.push(particles);
        this.materials.push(particleMaterial);
    }

    setupEventListeners() {
        const handleInteractionStart = () => {
            this.isInteracting = true;
            this.speed = 3;
        };

        const handleInteractionEnd = () => {
            this.isInteracting = false;
            this.speed = 1;
        };

        window.addEventListener('mousedown', handleInteractionStart);
        window.addEventListener('mouseup', handleInteractionEnd);
        window.addEventListener('touchstart', handleInteractionStart, { passive: true });
        window.addEventListener('touchend', handleInteractionEnd, { passive: true });

        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();
        this.time += delta;

        this.materials.forEach(material => {
            if (material.uniforms && material.uniforms.time) {
                material.uniforms.time.value = this.time;
                material.uniforms.speed.value = this.speed;
            }
        });

        this.meshes.forEach(mesh => {
            if (mesh.userData.speed) {
                mesh.position.z += mesh.userData.speed * this.speed * delta;

                if (mesh.position.z > 50) {
                    mesh.position.z = -50;
                }
            }

            if (mesh.userData.radius !== undefined) {
                mesh.userData.angle += delta * 0.5 * this.speed;
                mesh.position.x = Math.cos(mesh.userData.angle) * mesh.userData.radius;
                mesh.position.y = Math.sin(mesh.userData.angle) * mesh.userData.radius;
            }
        });

        this.camera.rotation.z = Math.sin(this.time * 0.5) * 0.05;

        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        this.materials.forEach(material => material.dispose());
        this.meshes.forEach(mesh => {
            if (mesh.geometry) mesh.geometry.dispose();
        });
        this.renderer.dispose();
    }
}

function createFallbackBackground() {
    const canvas = document.getElementById('hyperspeed-canvas');
    if (canvas) {
        canvas.style.background = 'linear-gradient(45deg, #000000, #220000, #000000)';
        canvas.style.backgroundSize = '400% 400%';
        canvas.style.animation = 'gradientShift 15s ease infinite';

        const style = document.createElement('style');
        style.textContent = `
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
    }
}
