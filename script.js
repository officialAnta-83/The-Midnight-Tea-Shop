// The Midnight Tea Shop — Game Logic
// Created by Antabin Das | Copyright © 2026 Antabin Das

const CREATOR_NAME = "Antabin Das";

const INGREDIENTS = [
    { id: "starlight_honey", name: "Starlight Honey", icon: "🍯", tag: "Sweetness • Warmth" },
    { id: "moon_dew", name: "Moon Dew", icon: "💧", tag: "Clarity • Quiet" },
    { id: "cinna_ember", name: "Cinnamon Ember", icon: "🔥", tag: "Hearth • Nostalgia" },
    { id: "frost_petal", name: "Frostpetal", icon: "❄️", tag: "Winter • Stillness" },
    { id: "whisper_mint", name: "Whispering Mint", icon: "🌿", tag: "Breath • Memory" },
    { id: "amber_resin", name: "Amber Resin", icon: "✨", tag: "Time • Golden" }
];

const VISITORS = [
    {
        id: "arthur",
        name: "Arthur",
        epithet: "The Elderly Clockmaker",
        color: "#80deea",
        initialDialogue: '“My hands still remember the tiny brass gears... yet I cannot recall the <span class="dialogue-hint-highlight">golden hour</span> when my apprentice finished his <span class="dialogue-hint-highlight">first chime</span>.”',
        recipe: ["amber_resin", "cinna_ember"],
        wrongHint: "That blend has a different warmth. Think of gilded time and a cozy workshop hearth.",
        restoredDialogue: '“Ah... the afternoon sun through the workshop glass, and the first clear chime ringing out! Thank you, keeper.”',
        keepsakeIcon: "🕰️",
        keepsakeName: "Gilded Chime Gear",
        memorySummary: "Heard the apprentice's first clock chime glow in golden evening light."
    },
    {
        id: "clara",
        name: "Clara",
        epithet: "The Quiet Astronomer",
        color: "#ce93d8",
        initialDialogue: '“I mapped a thousand constellations, but the night I finally saw a <span class="dialogue-hint-highlight">shooting star</span> feels like <span class="dialogue-hint-highlight">silver water</span> slipping through my fingers.”',
        recipe: ["moon_dew", "starlight_honey"],
        wrongHint: "Try pairing something cool and clear with a touch of celestial sweetness.",
        restoredDialogue: '“Yes... a streak of honey-gold light across midnight skies, quiet as falling dew.”',
        keepsakeIcon: "🔭",
        keepsakeName: "Starlit Brass Lens",
        memorySummary: "Watched a quiet shooting star streak across a midnight sky."
    },
    {
        id: "julian",
        name: "Julian",
        epithet: "The Winter Violinist",
        color: "#90caf9",
        initialDialogue: '“The snow outside was <span class="dialogue-hint-highlight">crystalline and still</span>, yet inside the cottage the melody felt <span class="dialogue-hint-highlight">fresh and breathing</span>.”',
        recipe: ["frost_petal", "whisper_mint"],
        wrongHint: "Look for winter stillness paired with a clear, living breath.",
        restoredDialogue: '“Every note hung in the frosty air like silver mist—alive, gentle, and whole.”',
        keepsakeIcon: "🎻",
        keepsakeName: "Frost-Strung Bow",
        memorySummary: "Played a winter melody inside a quiet, frost-kissed cottage."
    },
    {
        id: "sora",
        name: "Sora",
        epithet: "The Lantern Painter",
        color: "#ffcc80",
        initialDialogue: '“My pigments faded into fog, save for one <span class="dialogue-hint-highlight">sweet glow</span> and a <span class="dialogue-hint-highlight">soft whisper</span> along the harbor.”',
        recipe: ["starlight_honey", "whisper_mint"],
        wrongHint: "Combine a gentle, sweet radiance with a quiet breath of air.",
        restoredDialogue: '“Warm paper lanterns swaying by the water, painted in honey and evening breeze.”',
        keepsakeIcon: "🏮",
        keepsakeName: "Harbor Lantern Sketch",
        memorySummary: "Painted glowing paper lanterns along a calm evening harbor."
    }
];

let currentVisitorIdx = 0;
let selectedIngredients = [];
let isRestored = false;
let isBrewing = false;
const unlockedKeepsakes = [];

const titleScreen = document.getElementById("title-screen");
const gameScreen = document.getElementById("game-screen");
const ledgerScreen = document.getElementById("ledger-screen");
const startShiftBtn = document.getElementById("start-shift-btn");
const quickPlayLink = document.getElementById("quick-play-link");
const restartShiftBtn = document.getElementById("restart-shift-btn");
const ingredientsGrid = document.getElementById("ingredients-grid");
const selectionCounter = document.getElementById("selection-counter");
const brewSlot0 = document.getElementById("brew-slot-0");
const brewSlot1 = document.getElementById("brew-slot-1");
const clearBrewBtn = document.getElementById("clear-brew-btn");
const brewTeaBtn = document.getElementById("brew-tea-btn");
const teapotSvg = document.getElementById("teapot-svg");
const spiritSvgContainer = document.getElementById("spirit-svg-container");
const spiritAura = document.getElementById("spirit-aura");
const spiritNameEl = document.getElementById("spirit-name");
const spiritEpithetEl = document.getElementById("spirit-epithet");
const spiritDialogueEl = document.getElementById("spirit-dialogue");
const spiritActionRow = document.getElementById("spirit-action-row");
const visitorCounterText = document.getElementById("visitor-counter-text");
const spiritStatusBadge = document.getElementById("spirit-status-badge");
const toastBanner = document.getElementById("toast-banner");

function showToast(msg) {
    toastBanner.textContent = msg;
    toastBanner.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
        toastBanner.classList.remove("show");
    }, 2800);
}

function renderSpiritSvg(visitor, restored) {
    const fillColor = restored ? "#ffe082" : visitor.color;
    const glowColor = restored ? "rgba(255, 224, 130, 0.75)" : "rgba(128, 222, 234, 0.45)";
    spiritSvgContainer.classList.remove("ascending");
    spiritSvgContainer.innerHTML = `
        <svg width="185" height="185" viewBox="0 0 185 185" fill="none" style="filter: drop-shadow(0 0 16px ${glowColor});">
            <path d="M52 145 C52 92, 58 42, 92.5 42 C127 42, 133 92, 133 145 C121 136, 111 148, 99 140 C89 134, 79 148, 67 140 C61 136, 56 141, 52 145 Z"
                  fill="${fillColor}" fill-opacity="${restored ? '0.88' : '0.62'}" stroke="#fff8e1" stroke-width="1.5" stroke-opacity="0.7"/>
            <circle cx="78" cy="84" r="4.2" fill="#1b1428"/>
            <circle cx="107" cy="84" r="4.2" fill="#1b1428"/>
            <path d="${restored ? 'M83 97 Q92.5 106 102 97' : 'M85 99 Q92.5 95 100 99'}"
                  stroke="#1b1428" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        </svg>
    `;
}

function renderIngredients() {
    ingredientsGrid.innerHTML = "";
    INGREDIENTS.forEach(ing => {
        const isSelected = selectedIngredients.includes(ing.id);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ingredient-card" + (isSelected ? " selected" : "");
        btn.disabled = isRestored || isBrewing || (!isSelected && selectedIngredients.length >= 2);
        btn.innerHTML = `
            <div class="ing-icon-wrap">${ing.icon}</div>
            <div class="ing-info">
                <span class="ing-name">${ing.name}</span>
                <span class="ing-tags">${ing.tag}</span>
            </div>
        `;
        btn.addEventListener("click", () => toggleIngredient(ing.id));
        ingredientsGrid.appendChild(btn);
    });
}

function toggleIngredient(id) {
    if (isRestored || isBrewing) return;
    if (selectedIngredients.includes(id)) {
        selectedIngredients = selectedIngredients.filter(item => item !== id);
    } else if (selectedIngredients.length < 2) {
        selectedIngredients.push(id);
    }
    updateBrewUI();
    renderIngredients();
}

function updateBrewUI() {
    selectionCounter.textContent = `${selectedIngredients.length} / 2 Ingredients`;
    const ing0 = INGREDIENTS.find(i => i.id === selectedIngredients[0]);
    const ing1 = INGREDIENTS.find(i => i.id === selectedIngredients[1]);

    brewSlot0.textContent = ing0 ? `${ing0.icon} ${ing0.name}` : "Select 1st Essence";
    brewSlot0.classList.toggle("filled", Boolean(ing0));

    brewSlot1.textContent = ing1 ? `${ing1.icon} ${ing1.name}` : "Select 2nd Essence";
    brewSlot1.classList.toggle("filled", Boolean(ing1));

    clearBrewBtn.disabled = isRestored || isBrewing || selectedIngredients.length === 0;
    brewTeaBtn.disabled = isRestored || isBrewing || selectedIngredients.length !== 2;
}

function loadVisitor(index) {
    currentVisitorIdx = index;
    selectedIngredients = [];
    isRestored = false;
    isBrewing = false;

    const visitor = VISITORS[currentVisitorIdx];
    visitorCounterText.textContent = `Visitor ${currentVisitorIdx + 1} of ${VISITORS.length}`;
    spiritStatusBadge.textContent = "● Awaiting Tea";
    spiritStatusBadge.style.color = "var(--spirit-cyan)";
    spiritAura.classList.remove("restored");

    spiritNameEl.textContent = visitor.name;
    spiritEpithetEl.textContent = visitor.epithet;
    spiritDialogueEl.innerHTML = visitor.initialDialogue;
    spiritActionRow.innerHTML = "";

    renderSpiritSvg(visitor, false);
    renderIngredients();
    updateBrewUI();
}

function updateKeepsakeShelf() {
    for (let i = 0; i < VISITORS.length; i++) {
        const slot = document.getElementById(`slot-${i}`);
        if (unlockedKeepsakes[i]) {
            slot.textContent = unlockedKeepsakes[i].keepsakeIcon;
            slot.title = `${unlockedKeepsakes[i].keepsakeName} (${unlockedKeepsakes[i].name})`;
            slot.classList.add("unlocked");
        } else {
            slot.textContent = "?";
            slot.title = "Locked Keepsake";
            slot.classList.remove("unlocked");
        }
    }
}

function handleBrewTea() {
    if (selectedIngredients.length !== 2 || isBrewing || isRestored) return;
    isBrewing = true;
    updateBrewUI();
    renderIngredients();
    teapotSvg.classList.add("teapot-brewing");
    spiritDialogueEl.innerHTML = '<em>Warm steam curls upward, carrying hints of starlight and memory...</em>';

    setTimeout(() => {
        teapotSvg.classList.remove("teapot-brewing");
        isBrewing = false;

        const visitor = VISITORS[currentVisitorIdx];
        const isMatch =
            visitor.recipe.includes(selectedIngredients[0]) &&
            visitor.recipe.includes(selectedIngredients[1]) &&
            selectedIngredients[0] !== selectedIngredients[1];

        if (isMatch) {
            isRestored = true;
            spiritAura.classList.add("restored");
            renderSpiritSvg(visitor, true);
            spiritStatusBadge.textContent = "✦ Memory Restored";
            spiritStatusBadge.style.color = "var(--gold-bright)";
            spiritDialogueEl.innerHTML = visitor.restoredDialogue;

            if (!unlockedKeepsakes.some(k => k.id === visitor.id)) {
                unlockedKeepsakes.push(visitor);
                updateKeepsakeShelf();
            }

            const isLast = currentVisitorIdx === VISITORS.length - 1;
            spiritActionRow.innerHTML = `
                <button type="button" class="primary-btn" id="next-visitor-btn" style="padding: 10px 24px; font-size: 0.92rem;">
                    ${isLast ? "Finish Shift" : "Next Visitor"}
                </button>
            `;
            document.getElementById("next-visitor-btn").addEventListener("click", () => {
                spiritSvgContainer.classList.add("ascending");
                setTimeout(() => {
                    if (isLast) {
                        showLedgerScreen();
                    } else {
                        loadVisitor(currentVisitorIdx + 1);
                    }
                }, 450);
            });
            showToast(`Keepsake Unlocked: ${visitor.keepsakeName}`);
        } else {
            selectedIngredients = [];
            spiritDialogueEl.innerHTML = `${visitor.wrongHint}<br><br>${visitor.initialDialogue}`;
            updateBrewUI();
            renderIngredients();
            showToast("The tea settles quietly—try another pair.");
        }
    }, 950);
}

function showLedgerScreen() {
    gameScreen.style.display = "none";
    ledgerScreen.style.display = "block";
    const ledgerList = document.getElementById("ledger-list");
    ledgerList.innerHTML = "";

    VISITORS.forEach(v => {
        const card = document.createElement("div");
        card.className = "ledger-card";
        card.innerHTML = `
            <div class="ledger-keepsake-icon">${v.keepsakeIcon}</div>
            <div>
                <h4>${v.name}</h4>
                <div class="ledger-keepsake-title">${v.keepsakeName}</div>
                <p class="ledger-memory-text">${v.memorySummary}</p>
            </div>
        `;
        ledgerList.appendChild(card);
    });
}

function startGame() {
    titleScreen.style.display = "none";
    ledgerScreen.style.display = "none";
    gameScreen.style.display = "grid";
    loadVisitor(0);
}

clearBrewBtn.addEventListener("click", () => {
    if (isBrewing || isRestored) return;
    selectedIngredients = [];
    updateBrewUI();
    renderIngredients();
});

brewTeaBtn.addEventListener("click", handleBrewTea);
startShiftBtn.addEventListener("click", startGame);
if (quickPlayLink) {
    quickPlayLink.addEventListener("click", (e) => {
        e.preventDefault();
        startGame();
    });
}

restartShiftBtn.addEventListener("click", () => {
    unlockedKeepsakes.length = 0;
    updateKeepsakeShelf();
    ledgerScreen.style.display = "none";
    gameScreen.style.display = "grid";
    loadVisitor(0);
});

let audioCtx = null;
let soundEnabled = false;
const audioToggleBtn = document.getElementById("audio-toggle-btn");
const audioIcon = document.getElementById("audio-icon");
const audioText = document.getElementById("audio-text");

function playSoftNote(freq = 440) {
    if (!soundEnabled) return;
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
    }
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, audioCtx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 1.15);
}

audioToggleBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    audioIcon.textContent = soundEnabled ? "🔊" : "🔇";
    audioText.textContent = soundEnabled ? "Sound On" : "Sound Off";
    if (soundEnabled) playSoftNote(523.25);
});

const canvas = document.getElementById("atmosphere-canvas");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 70 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.75,
        r: Math.random() * 1.6 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.008
    }));
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
        s.phase += s.speed;
        const alpha = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 244, 214, ${alpha.toFixed(2)})`;
        ctx.fill();
    });
    requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawStars();
updateKeepsakeShelf();
