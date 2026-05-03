document.addEventListener("DOMContentLoaded", () => {

/* Data e hora */ 
function atualizarDatas() {
  const elementos = document.querySelectorAll('.data');

  elementos.forEach(el => {
    const agora = new Date();

    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');

    el.innerText = `Dia ${dia}/${mes} - ${horas}:${minutos}`;
  });
}

/* MATRIX */
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = "01";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) drops[i] = 1;

function drawMatrix() {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0f0";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
      drops[i] = 0;

    drops[i]++;
  }
}
setInterval(drawMatrix, 33);

/* MUSIC */
window.toggleMusic = function() {
  const music = document.getElementById("bgmusic");
  const btn = document.querySelector(".topbar button");

  if (music.paused) {
    music.play();
    btn.innerText = "🔊";
    btn.classList.add("active");
  } else {
    music.pause();
    btn.innerText = "🔇";
    btn.classList.remove("active");
  }
};

/* TABS */
window.showTab = function(tab) {

  // 🔊 SOM
  const sound = document.getElementById("tabsound");
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  //GLITCH
  triggerGlitch(500);

  setTimeout(() => {
    document.querySelectorAll('.main > div').forEach(d => d.classList.add('hidden'));
    document.getElementById(tab).classList.remove('hidden');
    startTyping();
    atualizarDatas();
  }, 300);
}

/* GLITCH */
function glitchText(element) {
  const original = element.innerText;
  const chars = "!@#$%^&*()_+=-[]{}<>?/";

  let i = 0;
  const interval = setInterval(() => {
    element.innerText = original
      .split("")
      .map((char, index) => {
        if (index < i) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");

    i++;

    if (i > original.length) {
      clearInterval(interval);
      element.innerText = original;
    }
  }, 20);
}

/* TYPING + GLITCH */
function startTyping() {
  document.querySelectorAll('.typing').forEach(el => {
    const text = el.getAttribute('data-text');
    el.innerText = '';
    let i = 0;

    const interval = setInterval(() => {
      el.innerText += text[i];
      i++;

      if (i >= text.length) {
        clearInterval(interval);
        glitchText(el);
      }

    }, 50);
  });
}

function triggerGlitch(duration = 1000) {
  const overlay = document.getElementById("glitchOverlay");

  document.body.classList.add("glitch-screen");
  overlay.style.display = "block";

  
  document.body.style.filter = "contrast(2) brightness(1.5)";

  setTimeout(() => {
    document.body.classList.remove("glitch-screen");
    overlay.style.display = "none";

    
    document.body.style.filter = "";
  }, duration);
}

window.togglePlayer = function(id) {
  const player = document.getElementById(id);
  player.style.display = player.style.display === "none" ? "block" : "none";
}

startTyping();
atualizarDatas();

});