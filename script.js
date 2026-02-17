/**
 * Olla Gitana: El Juego - Visual & Gameplay Overhaul v6
 * Author: Subagent (OpenClaw)
 * Date: 2026-02-16
 */

// --- CONFIGURATION ---
const CONFIG = {
    GAME_WIDTH: window.innerWidth,
    GAME_HEIGHT: window.innerHeight,
    PLAYER_WIDTH: 100,
    PLAYER_HEIGHT: 70, 
    ITEM_SIZE: 55, // Slightly larger
    SPAWN_RATE: 70,
    LEVEL_THRESHOLD: 100,
    MAX_LIVES: 3,
    MAX_LEVELS: 20,
    
    DIFFICULTY: {
        easy: { speed: 2, accel: 0.3, prefix: '[E]', label: 'FÁCIL 🐢', 
            classes: 'from-green-400 to-green-600 shadow-[0_6px_0_#15803d] active:shadow-[0_2px_0_#15803d]' },
        normal: { speed: 3, accel: 0.5, prefix: '[N]', label: 'NORMAL 🥘', 
            classes: 'from-blue-400 to-blue-600 shadow-[0_6px_0_#1d4ed8] active:shadow-[0_2px_0_#1d4ed8]' },
        hard: { speed: 5, accel: 0.8, prefix: '[H]', label: 'DIFÍCIL 🔥', 
            classes: 'from-red-400 to-red-600 shadow-[0_6px_0_#b91c1c] active:shadow-[0_2px_0_#b91c1c]' }
    }
};

// --- ASSETS ---
const PUMPKIN_KEY = 'TOTANERA';
const ZARANGOLLO_KEY = 'ZARANGOLLO';

const ASSETS = {
    GOOD_BASE: [PUMPKIN_KEY, '🍐', '🌿'],
    BAD_BASE: ['💊', '💉'],
    GOOD_EXTRAS: ['🧆', '🌶️', '🥔', '🥖', '🥕', '🧅', '🧄', '🍅', '🍆', '🌽', '🍄', '🥦', '🥒', '🥬', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥗', '🍲', '🥣'],
    BAD_EXTRAS: ['🚬', '💩', '💀', '💣', '🦠', '🧫', '🩸', '🦴', '🕷️', '🦂', '🦟', '🪰', '🪳', '🐜', '🐌', '🐛', '🤢', '🤮', '👺', '👹'],

    BACKGROUNDS: {
        START: "url('background.jpg')",
        GAME: [
            "url('bg_1.jpg')", "url('bg_2.jpg')", "url('bg_3.jpg')", "url('bg_4.jpg')", "url('bg_5.jpg')",
            "url('bg_6.jpg')", "url('bg_7.jpg')", "url('bg_8.jpg')", "url('bg_9.jpg')", "url('bg_10.jpg')",
            "url('bg_11.jpg')", "url('bg_12.jpg')", "url('bg_13.jpg')", "url('bg_14.jpg')"
        ]
    },

    TEXTS: {
        LEVEL_UP: [
            "¡Acho, qué bueno!", "¡Picoesquina!", "¡Vaya tela!", "¡Ole tu pijo!", 
            "¡Menudo estropicio!", "¡Arrea!", "¡Zarangollo Power!", "¡Gusa!", 
            "¡Llimón!", "¡Paparajote!", "¡Zagala, dale!", "¡A la fresca!", 
            "¡Sobaquillo!", "¡Encaramarse!", "¡Esclafarse!", "¡Follonero!", 
            "¡Emperifollá!", "¡Miaja!", "¡Panizo!", "¡Tira p'alante!"
        ],
        GAME_OVER: ["¡Ojete calor!", "¡Menudo pijo!", "¡Gambitero!", "¡Te has 'quedao' pajarito!", "¡Acho, pijo, huevo!", "¡Se te ha ido la olla!"],
        GOOD_HIT: ["¡Toma!", "¡Ole!", "¡Acho!", "¡Dale!", "¡Rico!", "¡Ñam!", "¡Sabor!", "¡Murcia!", "¡Huerta!", "¡Fresco!"]
    }
};

// --- VISUAL FX ENGINE ---
const VFX = {
    particles: [],
    foregroundClouds: [],
    floatingTexts: [],

    init: function() {
        this.particles = [];
        this.foregroundClouds = [];
        this.floatingTexts = [];
        // Init clouds
        for(let i=0; i<10; i++) {
            this.foregroundClouds.push({
                x: Math.random() * CONFIG.GAME_WIDTH,
                y: CONFIG.GAME_HEIGHT - Math.random() * 150,
                size: 50 + Math.random() * 100,
                speed: 0.5 + Math.random() * 1,
                alpha: 0.1 + Math.random() * 0.2
            });
        }
    },

    spawnConfetti: function(x, y) {
        const colors = ['#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#FF69B4'];
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 1.5) * 15,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02,
                type: 'confetti',
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.2
            });
        }
    },

    spawnSmoke: function(x, y) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 5,
                vy: -Math.random() * 5,
                size: Math.random() * 20 + 10,
                life: 1.0,
                decay: 0.015,
                type: 'smoke'
            });
        }
    },

    spawnText: function(x, y, text, color = '#FFF', size = 30) {
        this.floatingTexts.push({
            x: x,
            y: y,
            text: text,
            color: color,
            size: size,
            life: 1.0,
            vy: -2
        });
    },

    update: function() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            if (p.type === 'confetti') {
                p.vy += 0.5; // Gravity
                p.rotation += p.rotSpeed;
            } else if (p.type === 'smoke') {
                p.size += 0.5; // Expand
                p.vy *= 0.95; // Slow down
            }

            if (p.life <= 0) this.particles.splice(i, 1);
        }

        // Update floating texts
        if (!this.floatingTexts) this.floatingTexts = [];
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            let t = this.floatingTexts[i];
            t.y += t.vy;
            t.life -= 0.02;
            if (t.life <= 0) this.floatingTexts.splice(i, 1);
        }

        // Update clouds
        for(let cloud of this.foregroundClouds) {
            cloud.x -= cloud.speed;
            if(cloud.x + cloud.size < 0) {
                cloud.x = CONFIG.GAME_WIDTH + cloud.size;
                cloud.y = CONFIG.GAME_HEIGHT - Math.random() * 150;
            }
        }
    },

    draw: function(ctx) {
        // Draw Particles
        for (let p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.life;
            if (p.type === 'confetti') {
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            } else if (p.type === 'smoke') {
                ctx.fillStyle = `rgba(100, 100, 100, ${p.life * 0.5})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // Draw Floating Texts
        for (let t of this.floatingTexts) {
            ctx.save();
            ctx.globalAlpha = t.life;
            ctx.fillStyle = t.color;
            ctx.font = `bold ${t.size}px 'Luckiest Guy', sans-serif`;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.strokeText(t.text, t.x, t.y);
            ctx.fillText(t.text, t.x, t.y);
            ctx.restore();
        }

        // Draw Foreground Clouds (Fog)
        for(let cloud of this.foregroundClouds) {
            ctx.fillStyle = `rgba(255, 255, 255, ${cloud.alpha})`;
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};

// --- AUDIO ENGINE ---
const AudioEngine = {
    ctx: null,
    musicElement: null,
    badHitElement: null, 
    levelUpSpecialElement: null,
    isMusicEnabled: false,

    init: function() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.ctx = new AudioContext();
        }
        
        // Prevent multiple initializations of music element reference
        if (!this.musicElement) {
             this.musicElement = document.getElementById('bgMusic');
        }

        if (!this.badHitElement) {
            this.badHitElement = new Audio('hit.mp3'); 
            this.badHitElement.volume = 0.8;
        }

        if (!this.levelUpSpecialElement) {
            this.levelUpSpecialElement = new Audio('levelup_special.mp3');
            this.levelUpSpecialElement.volume = 1.0;
            this.levelUpSpecialElement.load(); // Preload
        }
    },

    toggleMusic: function() {
        if (!this.musicElement) this.init();
        
        if (this.musicElement.paused) {
            this.musicElement.play().then(() => {
                this.isMusicEnabled = true;
                this.updateUI(true);
            }).catch(e => console.warn("Audio blocked:", e));
        } else {
            this.musicElement.pause();
            this.isMusicEnabled = false;
            this.updateUI(false);
        }
    },

    ensureMusicPlaying: function() {
        if (this.musicElement && this.musicElement.paused) {
            this.musicElement.play().then(() => {
                this.isMusicEnabled = true;
                this.updateUI(true);
            }).catch(e => console.log("Autoplay blocked until interaction"));
        }
    },

    updateUI: function(isPlaying) {
        const hudBtn = document.getElementById('musicToggle');
        const startBtn = document.getElementById('startMusicToggle');
        
        const icon = isPlaying ? "🔊" : "🔇";
        const colorClass = isPlaying ? "bg-gray-800/90" : "bg-red-500";

        if (hudBtn) {
            hudBtn.innerText = icon;
            hudBtn.className = `pointer-events-auto text-white rounded-full w-10 h-10 flex items-center justify-center border-2 border-gray-500 hover:bg-gray-700 transition-colors shadow-lg ml-2 ${colorClass}`;
        }
        if (startBtn) {
            startBtn.innerHTML = `<span>${isPlaying ? '🔊' : '🎵'}</span> ${isPlaying ? 'Música: ON' : 'Música: OFF'}`;
            if (isPlaying) {
                startBtn.classList.remove('bg-purple-600', 'hover:bg-purple-500', 'animate-pulse');
                startBtn.classList.add('bg-green-600', 'hover:bg-green-500');
            } else {
                startBtn.classList.remove('bg-green-600', 'hover:bg-green-500');
                startBtn.classList.add('bg-purple-600', 'hover:bg-purple-500');
            }
        }
    },

    playTone: function(type) {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume().catch(console.error);

        if (type === 'good') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            const now = this.ctx.currentTime;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'heart') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            const now = this.ctx.currentTime;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1000, now);
            osc.frequency.linearRampToValueAtTime(2000, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        } else if (type === 'bad') {
            if (this.badHitElement) {
                this.badHitElement.currentTime = 0;
                this.badHitElement.play().catch(() => this.playSynthBad());
            } else {
                this.playSynthBad();
            }
        }
    },

    playLevelUp: function(level) {
        const specialLevels = [5, 10, 15, 20];
        if (specialLevels.includes(level)) {
             if (this.levelUpSpecialElement) {
                this.levelUpSpecialElement.currentTime = 0;
                this.levelUpSpecialElement.play().catch(console.warn);
             }
        }
    },

    playSynthBad: function() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        const now = this.ctx.currentTime;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    }
};

// --- STATE ---
let state = {
    isRunning: false,
    isPaused: false,
    score: 0,
    lives: CONFIG.MAX_LIVES,
    level: 1,
    speed: 0, 
    acceleration: 0,
    difficulty: 'normal',
    frames: 0,
    items: [],
    playerX: CONFIG.GAME_WIDTH / 2 - CONFIG.PLAYER_WIDTH / 2,
    lastPlayerX: CONFIG.GAME_WIDTH / 2 - CONFIG.PLAYER_WIDTH / 2,
    playerVelocity: 0,
    heartSpawnedForLevel: false,
    lastBgIndex: -1,
    levelUpPause: false // New state for Level Up pause
};

let currentDiffIndex = 1; // 0: Easy, 1: Normal, 2: Hard
const difficultyKeys = ['easy', 'normal', 'hard'];

// --- DOM ELEMENTS ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hud = document.getElementById('hud');
const scoreDisplay = document.getElementById('scoreDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const musicToggle = document.getElementById('musicToggle');
const startMusicToggle = document.getElementById('startMusicToggle');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const pauseScreen = document.getElementById('pauseScreen');
const rankingScreen = document.getElementById('rankingScreen');
const levelUpMsg = document.getElementById('levelUpMsg');
const newLevelNum = document.getElementById('newLevelNum');
const finalScoreDisplay = document.getElementById('finalScore');
const leaderboardBody = document.getElementById('leaderboardBody');
const fullLeaderboardBody = document.getElementById('fullLeaderboardBody');
const submitScoreBtn = document.getElementById('submitScoreBtn');
const playerNameInput = document.getElementById('playerName');
const instructionsModal = document.getElementById('instructionsModal');
const difficultyToggle = document.getElementById('difficultyToggle');

// --- RESIZE ---
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    CONFIG.GAME_WIDTH = canvas.width;
    CONFIG.GAME_HEIGHT = canvas.height;
    if (state.playerX > canvas.width - CONFIG.PLAYER_WIDTH) {
        state.playerX = canvas.width - CONFIG.PLAYER_WIDTH;
    }
}
window.addEventListener('resize', resize);
resize();

// --- BACKGROUNDS ---
function setBackground(type) {
    let bg;
    if (type === 'start' || type === 'gameover') {
        bg = ASSETS.BACKGROUNDS.START;
    } else {
        // Pick random game bg avoiding repetition
        let idx;
        const bgs = ASSETS.BACKGROUNDS.GAME;
        do {
            idx = Math.floor(Math.random() * bgs.length);
        } while (idx === state.lastBgIndex && bgs.length > 1);
        
        state.lastBgIndex = idx;
        bg = bgs[idx];
    }
    document.body.style.backgroundImage = bg;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
}

// --- GAME LOGIC ---
function getItemPool() {
    const goodCount = Math.min(ASSETS.GOOD_EXTRAS.length, state.level - 1);
    const badCount = Math.min(ASSETS.BAD_EXTRAS.length, state.level - 1);
    const currentGood = [...ASSETS.GOOD_BASE, ...ASSETS.GOOD_EXTRAS.slice(0, goodCount)];
    const currentBad = [...ASSETS.BAD_BASE, ...ASSETS.BAD_EXTRAS.slice(0, badCount)];
    return { good: currentGood, bad: currentBad };
}

function handleInput(x) {
    if (state.isPaused || !state.isRunning || state.levelUpPause) return;
    let targetX = x - CONFIG.PLAYER_WIDTH / 2;
    state.playerX = Math.max(0, Math.min(CONFIG.GAME_WIDTH - CONFIG.PLAYER_WIDTH, targetX));
}
canvas.addEventListener('mousemove', e => handleInput(e.clientX));
canvas.addEventListener('touchmove', e => { e.preventDefault(); handleInput(e.touches[0].clientX); }, { passive: false });
canvas.addEventListener('touchstart', e => { e.preventDefault(); handleInput(e.touches[0].clientX); }, { passive: false });

function drawPot(x, y, w, h) {
    ctx.save();
    
    // Squash & Stretch Calculation
    // Velocity is mostly difference between frames. 
    // If moving fast, stretch width (scaleX > 1), squash height (scaleY < 1).
    const stretchFactor = Math.min(Math.abs(state.playerVelocity) * 0.005, 0.3);
    const scaleX = 1 + stretchFactor;
    const scaleY = 1 - stretchFactor;
    
    // Pivot around bottom center
    const centerX = x + w/2;
    const bottomY = y + h;
    
    ctx.translate(centerX, bottomY);
    ctx.scale(scaleX, scaleY);
    ctx.translate(-centerX, -bottomY);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + h - 5, w/2, 10, 0, 0, Math.PI*2);
    ctx.fill();

    // Body - Shiny Metal
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, '#666');
    grad.addColorStop(1, '#222');
    ctx.fillStyle = grad;
    
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 10);
    ctx.lineTo(x + w - 10, y + 10);
    ctx.quadraticCurveTo(x + w, y + h, x + w/2, y + h);
    ctx.quadraticCurveTo(x, y + h, x + 10, y + 10);
    ctx.fill();
    // Rim
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + 10, w/2 - 5, 8, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    // Handles
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#222';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 20);
    ctx.quadraticCurveTo(x - 15, y + 25, x + 12, y + 40);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + w - 12, y + 20);
    ctx.quadraticCurveTo(x + w + 15, y + 25, x + w - 12, y + 40);
    ctx.stroke();
    
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.ellipse(x + w/2 - 10, y + h/2, w/4, h/3, -0.2, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
}

function startGame(difficulty) {
    AudioEngine.init();
    AudioEngine.ensureMusicPlaying();
    VFX.init();
    
    const settings = CONFIG.DIFFICULTY[difficulty];
    
    state = {
        isRunning: true,
        isPaused: false,
        score: 0,
        lives: CONFIG.MAX_LIVES,
        level: 1,
        speed: settings.speed,
        acceleration: settings.accel,
        difficulty: difficulty,
        frames: 0,
        items: [],
        playerX: canvas.width / 2 - CONFIG.PLAYER_WIDTH / 2,
        lastPlayerX: canvas.width / 2 - CONFIG.PLAYER_WIDTH / 2,
        playerVelocity: 0,
        heartSpawnedForLevel: false,
        lastBgIndex: -1,
        combo: 0,
        levelUpPause: false
    };

    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    rankingScreen.classList.add('hidden');
    hud.classList.remove('hidden');
    
    setBackground('game');
    updateHUD();
    requestAnimationFrame(gameLoop);
}

function togglePause() {
    if (!state.isRunning || state.levelUpPause) return;
    state.isPaused = !state.isPaused;
    if (state.isPaused) pauseScreen.classList.remove('hidden');
    else {
        pauseScreen.classList.add('hidden');
        requestAnimationFrame(gameLoop);
    }
}

function gameLoop() {
    if (!state.isRunning || state.isPaused) return;

    if (!state.levelUpPause) {
        update();
    }
    
    // Even if paused by level up, we might want to draw (or just freeze)
    // But since we want to "PAUSE the spawning/movement", we skip update() but call draw() 
    // to keep rendering frame.
    draw(); 
    
    state.frames++;
    requestAnimationFrame(gameLoop);
}

function update() {
    // Update physics variables
    state.playerVelocity = state.playerX - state.lastPlayerX;
    state.lastPlayerX = state.playerX;

    const spawnRate = Math.max(20, CONFIG.SPAWN_RATE - (state.level * 2));
    if (state.frames % spawnRate === 0) spawnItem();

    const potTop = CONFIG.GAME_HEIGHT - CONFIG.PLAYER_HEIGHT;
    const potLeft = state.playerX + 10;
    const potRight = state.playerX + CONFIG.PLAYER_WIDTH - 10;

    for (let i = state.items.length - 1; i >= 0; i--) {
        let item = state.items[i];
        item.y += item.speed;

        // Bobbing Animation Update (sway)
        item.bobOffset = Math.sin(state.frames * 0.05) * 2; 

        if (
            item.y + item.size/2 > potTop && 
            item.y < potTop + 20 &&
            item.x + item.size/2 > potLeft &&
            item.x + item.size/2 < potRight
        ) {
            handleCollision(item, i);
            continue;
        }
        if (item.y > CONFIG.GAME_HEIGHT) {
            // Missed a good item -> reset combo
            if (item.type === 'good' || item.type === 'zarangollo') {
                 state.combo = 0;
            }
            state.items.splice(i, 1);
        }
    }

    VFX.update();
}

function spawnItem() {
    if (state.level % 5 === 0 && !state.heartSpawnedForLevel && Math.random() < 0.15) {
        state.items.push({
            x: Math.random() * (CONFIG.GAME_WIDTH - CONFIG.ITEM_SIZE),
            y: -CONFIG.ITEM_SIZE,
            size: CONFIG.ITEM_SIZE,
            type: 'heart',
            text: '❤️', 
            speed: state.speed * 1.1,
            bobOffset: 0
        });
        state.heartSpawnedForLevel = true;
        return;
    }

    // Zarangollo Supremo (5% chance)
    if (Math.random() < 0.05) {
        state.items.push({
            x: Math.random() * (CONFIG.GAME_WIDTH - CONFIG.ITEM_SIZE),
            y: -CONFIG.ITEM_SIZE,
            size: CONFIG.ITEM_SIZE * 1.3,
            type: 'zarangollo',
            text: ZARANGOLLO_KEY,
            speed: state.speed * 1.5, // Faster!
            bobOffset: 0
        });
        return;
    }

    const pool = getItemPool();
    const isBad = Math.random() < 0.3;
    const sourceArray = isBad ? pool.bad : pool.good;
    // Ensure randomization
    const text = sourceArray[Math.floor(Math.random() * sourceArray.length)];
    const x = Math.random() * (CONFIG.GAME_WIDTH - CONFIG.ITEM_SIZE);
    
    state.items.push({
        x: x, y: -CONFIG.ITEM_SIZE, size: CONFIG.ITEM_SIZE,
        type: isBad ? 'bad' : 'good', text: text,
        speed: state.speed + (Math.random() * 1.5),
        bobOffset: 0
    });
}

function handleCollision(item, index) {
    const cx = item.x + item.size / 2;
    const cy = item.y + item.size / 2;

    state.items.splice(index, 1);
    
    // Calculate Combo Multiplier
    const currentCombo = state.combo || 0;
    const multiplier = 1 + (currentCombo * 0.2); 
    
    if (item.type === 'heart') {
        state.lives++;
        if (state.lives > 5) state.lives = 5; 
        state.combo = (state.combo || 0) + 1;
        AudioEngine.playTone('heart');
        VFX.spawnConfetti(cx, cy); 
        VFX.spawnText(cx, cy - 50, "¡VIDA EXTRA!", '#ff4d4d', 30);
        updateHUD();
        return;
    }

    if (item.type === 'zarangollo') {
        const pts = Math.floor(50 * multiplier);
        state.score += pts;
        state.combo = (state.combo || 0) + 1;
        AudioEngine.playTone('good');
        VFX.spawnConfetti(cx, cy);
        VFX.spawnText(cx, cy - 50, `¡ZARANGOLLO! +${pts}`, '#FFD700', 40);
        if (state.combo > 1) VFX.spawnText(cx, cy - 80, `COMBO x${multiplier.toFixed(1)}`, '#FFD700', 30);
        checkLevelUp();
    } else if (item.type === 'good') {
        const pts = Math.floor(10 * multiplier);
        state.score += pts;
        state.combo = (state.combo || 0) + 1;
        AudioEngine.playTone('good');
        VFX.spawnConfetti(cx, cy);
        
        if (state.combo > 1) {
             const phrases = ASSETS.TEXTS.GOOD_HIT;
             // Ensure random pick
             const phrase = phrases[Math.floor(Math.random() * phrases.length)];
             VFX.spawnText(cx, cy - 30, `${phrase} x${multiplier.toFixed(1)}`, '#ffff00', 25 + Math.min(20, state.combo * 2));
        } else {
             VFX.spawnText(cx, cy - 30, `+${pts}`, '#fff', 25);
        }
        
        checkLevelUp();
    } else {
        state.lives--;
        state.combo = 0; 
        AudioEngine.playTone('bad');
        VFX.spawnSmoke(cx, cy);
        VFX.spawnText(cx, cy - 30, "¡PUAJ!", '#555', 40);
        document.body.classList.add('shake-screen');
        setTimeout(() => document.body.classList.remove('shake-screen'), 500);
        if (state.lives <= 0) gameOver();
    }
    updateHUD();
}

function checkLevelUp() {
    const projectedLevel = Math.floor(state.score / CONFIG.LEVEL_THRESHOLD) + 1;
    if (projectedLevel > state.level && state.level < CONFIG.MAX_LEVELS) {
        state.level = projectedLevel;
        state.speed += state.acceleration; 
        state.heartSpawnedForLevel = false;
        setBackground('game'); 
        AudioEngine.playLevelUp(state.level);
        showLevelUpParams();
    }
}

function showLevelUpParams() {
    newLevelNum.innerText = state.level;
    const container = document.getElementById('levelUpMsg');
    const msgBox = container.firstElementChild;
    
    // Pick unique message (avoid repeating last one if possible)
    let msg;
    const msgs = ASSETS.TEXTS.LEVEL_UP;
    msg = msgs[Math.floor(Math.random() * msgs.length)];
    
    msgBox.querySelector('h2').innerText = msg;
    container.classList.remove('hidden');
    msgBox.classList.remove('scale-0');
    msgBox.classList.add('scale-100');
    
    // PAUSE GAMEPLAY LOGIC
    state.levelUpPause = true;

    setTimeout(() => {
        msgBox.classList.remove('scale-100');
        msgBox.classList.add('scale-0');
        setTimeout(() => {
            container.classList.add('hidden');
            // RESUME GAMEPLAY
            state.levelUpPause = false;
        }, 300);
    }, 3000); // 3 seconds pause
}

function drawHeart(x, y, size) {
    ctx.save();
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 10;
    const grad = ctx.createRadialGradient(x + size/2, y + size/3, size/4, x + size/2, y + size/2, size);
    grad.addColorStop(0, '#ff4d4d');
    grad.addColorStop(1, '#990000');
    ctx.fillStyle = grad;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x + size / 2, y + size / 5);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + size);
    ctx.bezierCurveTo(x + size / 2, y + (size + topCurveHeight) / 2, x + size, y + (size + topCurveHeight) / 2, x + size, y + topCurveHeight);
    ctx.bezierCurveTo(x + size, y, x + size / 2, y, x + size / 2, y + size / 5);
    ctx.fill();
    ctx.restore();
}

// Custom Totanera Pumpkin Drawing
function drawPumpkin(x, y, size) {
    ctx.save();
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x + size/2, y + size - 2, size/2.5, size/10, 0, 0, Math.PI*2);
    ctx.fill();

    // Body (Green/Orange mottled)
    const centerX = x + size/2;
    const centerY = y + size/2 + 5;
    const rx = size/2;
    const ry = size/2.5; // Flattened
    
    // Main Body Gradient (Green bottom, Orange top/spots)
    const grad = ctx.createRadialGradient(centerX, centerY - 10, 5, centerX, centerY, size/2);
    grad.addColorStop(0, '#e67e22'); // Orange center/top
    grad.addColorStop(0.6, '#d35400');
    grad.addColorStop(1, '#2d4d20'); // Greenish bottom (Totanera style)
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, rx, ry, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Ribs (Bezier lines)
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Center rib
    ctx.ellipse(centerX, centerY, rx * 0.2, ry, 0, 0, Math.PI*2);
    ctx.stroke();
    // Side ribs
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, rx * 0.6, ry * 0.95, 0, 0, Math.PI*2);
    ctx.stroke();
    
    // Stem
    ctx.fillStyle = '#3e2723';
    ctx.beginPath();
    ctx.moveTo(centerX - 5, centerY - ry + 5);
    ctx.quadraticCurveTo(centerX, centerY - ry - 15, centerX + 10, centerY - ry - 10);
    ctx.lineTo(centerX + 8, centerY - ry);
    ctx.lineTo(centerX - 5, centerY - ry + 5);
    ctx.fill();

    ctx.restore();
}

function drawSpotlight() {
    // Spotlight Effect centered on Pot
    const centerX = state.playerX + CONFIG.PLAYER_WIDTH / 2;
    const centerY = CONFIG.GAME_HEIGHT - CONFIG.PLAYER_HEIGHT / 2;

    const grad = ctx.createRadialGradient(centerX, centerY, 100, centerX, centerY, 800);
    grad.addColorStop(0, 'rgba(0,0,0,0)'); // Clear center
    grad.addColorStop(0.4, 'rgba(0,0,0,0.1)'); 
    grad.addColorStop(1, 'rgba(0,0,0,0.7)'); // Dark edges

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawPot(state.playerX, CONFIG.GAME_HEIGHT - CONFIG.PLAYER_HEIGHT - 10, CONFIG.PLAYER_WIDTH, CONFIG.PLAYER_HEIGHT);
    
    ctx.font = `${CONFIG.ITEM_SIZE}px serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    for (let item of state.items) {
        // Apply bobbing offset
        const renderX = item.x + (item.bobOffset || 0);

        if (item.type === 'heart') {
            drawHeart(renderX, item.y, item.size);
        } else if (item.text === PUMPKIN_KEY) {
            drawPumpkin(renderX, item.y, item.size);
        } else {
            // Apply visual polish to emojis
            ctx.save();
            
            // Glow for Good items
            if(item.type === 'good') {
                ctx.shadowColor = 'gold';
                ctx.shadowBlur = 15;
            }

            // Sway rotation
            const rot = (item.bobOffset || 0) * 0.05;
            ctx.translate(renderX + item.size/2, item.y + item.size/2);
            ctx.rotate(rot);
            ctx.translate(-(renderX + item.size/2), -(item.y + item.size/2));

            ctx.filter = 'drop-shadow(0px 4px 2px rgba(0,0,0,0.3)) saturate(1.2)';
            ctx.fillText(item.text, renderX, item.y);
            ctx.restore();
        }
    }

    VFX.draw(ctx);
    drawSpotlight();
}

function updateHUD() {
    scoreDisplay.innerText = state.score;
    livesDisplay.innerText = state.lives;
    levelDisplay.innerText = state.level;
}

function gameOver() {
    state.isRunning = false;
    hud.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    setBackground('gameover');
    
    gameOverScreen.querySelector('h1').innerText = ASSETS.TEXTS.GAME_OVER[Math.floor(Math.random() * ASSETS.TEXTS.GAME_OVER.length)];
    finalScoreDisplay.innerText = state.score;
    
    submitScoreBtn.disabled = false;
    submitScoreBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    document.getElementById('submitMsg').innerText = "";
    
    // Load top 5 for current difficulty
    loadLeaderboard(state.difficulty, leaderboardBody, 5);
}

// --- SUPABASE & LEADERBOARD ---
const SUPABASE_URL = "https://yzcyebzvfmpvjxhqgdne.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Y3llYnp2Zm1wdmp4aHFnZG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjY3MDMsImV4cCI6MjA4NjgwMjcwM30.xQyrvUA6ci7o3cbY5W_GggN9AWYAFCbogUpdhXSwBBg";
const MOCK_DB_KEY = 'olla_gitana_scores_v4';

async function getScores(difficulty) {
    const prefix = CONFIG.DIFFICULTY[difficulty].prefix;
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/scores?select=*&order=score.desc&limit=500`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        if (res.ok) {
            const allScores = await res.json();
            // Filter by prefix
            return allScores
                .filter(s => s.name.startsWith(prefix))
                .map(s => ({ ...s, name: s.name.replace(prefix, '').trim() }))
                .slice(0, 100);
        }
    } catch(e) { console.warn("Offline mode", e); }
    
    // Fallback LocalStorage
    let scores = JSON.parse(localStorage.getItem(MOCK_DB_KEY) || "[]");
    return scores
        .filter(s => s.diff === difficulty)
        .sort((a,b) => b.score - a.score)
        .slice(0, 100);
}

async function saveScore(name, score) {
    const diffKey = state.difficulty;
    const prefix = CONFIG.DIFFICULTY[diffKey].prefix;
    const fullName = `${prefix} ${name}`;
    
    try {
        await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
            method: 'POST',
            headers: { 
                'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json', 'Prefer': 'return=minimal' 
            },
            body: JSON.stringify({ name: fullName, score })
        });
    } catch(e) {
        let scores = JSON.parse(localStorage.getItem(MOCK_DB_KEY) || "[]");
        scores.push({ name, score, diff: diffKey });
        localStorage.setItem(MOCK_DB_KEY, JSON.stringify(scores));
    }
}

async function loadLeaderboard(difficulty, targetElement, limit = 100) {
    targetElement.innerHTML = '<tr><td colspan="3" class="text-center py-4">Cargando...</td></tr>';
    const scores = await getScores(difficulty);
    const displayScores = scores.slice(0, limit);
    
    if (displayScores.length === 0) {
        targetElement.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-gray-500">Aún no hay zagales aquí.</td></tr>';
        return;
    }

    targetElement.innerHTML = displayScores.map((s, i) => `
        <tr class="${i < 3 ? 'text-yellow-400 font-bold' : ''} hover:bg-white/5 transition-colors">
            <td class="p-2">${i + 1}</td>
            <td class="p-2">${s.name}</td>
            <td class="p-2 text-right text-mono">${s.score}</td>
        </tr>
    `).join('');
}

// --- EVENT LISTENERS ---
// Difficulty Toggle
function updateDifficultyUI() {
    const key = difficultyKeys[currentDiffIndex];
    const conf = CONFIG.DIFFICULTY[key];
    
    difficultyToggle.innerText = conf.label; 
    
    // Reset base classes then add dynamic ones
    difficultyToggle.className = `w-full bg-gradient-to-b border-4 border-white rounded-full py-4 hover:translate-y-1 transition-all transform hover:scale-105 font-game text-xl md:text-2xl uppercase tracking-wide text-white ${conf.classes}`;
}

difficultyToggle.addEventListener('click', () => {
    currentDiffIndex = (currentDiffIndex + 1) % difficultyKeys.length;
    updateDifficultyUI();
});

// Start Button
document.getElementById('btnStartGame').addEventListener('click', () => {
    const diff = difficultyKeys[currentDiffIndex];
    startGame(diff);
});

// Instructions Modal
document.getElementById('btnInstructions').addEventListener('click', () => {
    instructionsModal.classList.remove('hidden');
});
const closeInst = () => instructionsModal.classList.add('hidden');
document.getElementById('closeInstructionsBtn').addEventListener('click', closeInst);
document.getElementById('closeInstructionsBtnBottom').addEventListener('click', closeInst);


document.getElementById('restartBtn').addEventListener('click', () => startGame(state.difficulty));
document.getElementById('resumeBtn').addEventListener('click', togglePause);
document.getElementById('hud').addEventListener('click', (e) => {
    if (e.target !== musicToggle) togglePause();
});

// Ranking Screen Logic
document.getElementById('rankingBtn').addEventListener('click', () => {
    rankingScreen.classList.remove('hidden');
    loadLeaderboard('easy', fullLeaderboardBody); // Default view
    updateTabs('easy');
});

document.getElementById('closeRankingBtn').addEventListener('click', () => {
    rankingScreen.classList.add('hidden');
});

// Ranking Tabs
const tabs = document.querySelectorAll('.ranking-tab');
tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        const diff = e.target.getAttribute('data-diff');
        updateTabs(diff);
        loadLeaderboard(diff, fullLeaderboardBody);
    });
});

function updateTabs(activeDiff) {
    tabs.forEach(tab => {
        const diff = tab.getAttribute('data-diff');
        const isActive = diff === activeDiff;
        
        // Reset classes
        tab.className = 'ranking-tab flex-1 py-3 rounded-t-xl font-bold uppercase text-sm border-x-2 border-t-2 transition-all transform';
        
        if (isActive) {
            tab.classList.add('text-white', 'shadow-lg', 'translate-y-1', 'border-white/20');
            if (diff === 'easy') tab.classList.add('bg-green-600');
            if (diff === 'normal') tab.classList.add('bg-blue-600');
            if (diff === 'hard') tab.classList.add('bg-red-600');
        } else {
            tab.classList.add('bg-gray-700', 'text-gray-400', 'border-transparent', 'hover:bg-gray-600');
        }
    });
    
    // Border color of container
    const container = rankingScreen.querySelector('.border-4');
    container.classList.remove('border-green-600', 'border-blue-600', 'border-red-600', 'border-yellow-500');
    if (activeDiff === 'easy') container.classList.add('border-green-600');
    else if (activeDiff === 'normal') container.classList.add('border-blue-600');
    else if (activeDiff === 'hard') container.classList.add('border-red-600');
    else container.classList.add('border-yellow-500');
}

// Music Controls
function handleMusicToggle(e) {
    e.stopPropagation();
    AudioEngine.toggleMusic();
}
musicToggle.addEventListener('click', handleMusicToggle);
startMusicToggle.addEventListener('click', handleMusicToggle);

submitScoreBtn.addEventListener('click', () => {
    const val = playerNameInput.value.trim(); // Allow mixed case and special chars
    if (val) {
        saveScore(val, state.score).then(() => {
            loadLeaderboard(state.difficulty, leaderboardBody, 5);
            document.getElementById('submitMsg').innerText = "¡Guardado!";
            submitScoreBtn.disabled = true;
            submitScoreBtn.classList.add('opacity-50', 'cursor-not-allowed');
        });
    }
});

// Prevent Context Menu
window.addEventListener('contextmenu', e => e.preventDefault());

// Init
updateDifficultyUI(); // Init button state
AudioEngine.init();
setBackground('start');

// --- PRELOAD ---
function preloadImages() {
    const images = [
        ASSETS.BACKGROUNDS.START.replace(/url\(['"](.+)['"]\)/, '$1'),
        ...ASSETS.BACKGROUNDS.GAME.map(bg => bg.replace(/url\(['"](.+)['"]\)/, '$1'))
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    console.log("Backgrounds preloaded:", images.length);
}

preloadImages();
