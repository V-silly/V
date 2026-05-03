document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     DATA E HORA
     ===================== */
  function atualizarDatas() {
    document.querySelectorAll('.data').forEach(el => {
      const raw = el.getAttribute("data-date");
      const data = raw ? new Date(raw) : new Date();

      const dia     = String(data.getDate()).padStart(2, '0');
      const mes     = String(data.getMonth() + 1).padStart(2, '0');
      const horas   = String(data.getHours()).padStart(2, '0');
      const minutos = String(data.getMinutes()).padStart(2, '0');

      el.innerText = `[LOG ${dia}/${mes} ${horas}:${minutos}]`;
    });
  }

  /* =====================
     MATRIX
     ===================== */
  const canvas  = document.getElementById("matrix");
  const ctx     = canvas.getContext("2d");
  const letters = "01";
  const fontSize = 14;
  let drops = [];
  let matrixInterval = null;

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // recalcula colunas ao redimensionar
    drops = Array.from({ length: Math.floor(canvas.width / fontSize) }, () => 1);
  }

  function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff00";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const char = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resizeCanvas();
  matrixInterval = setInterval(drawMatrix, 33);

  // redimensiona o canvas junto com a janela
  window.addEventListener("resize", () => {
    resizeCanvas();
  });

  /* =====================
     MÚSICA
     ===================== */
  window.toggleMusic = function () {
    const music = document.getElementById("bgmusic");
    const btn   = document.querySelector(".topbar button");

    if (music.paused) {
      music.play().catch(() => {});
      btn.textContent = "🔊";
      btn.classList.add("active");
    } else {
      music.pause();
      btn.textContent = "🔇";
      btn.classList.remove("active");
    }
  };

  /* =====================
     GLITCH DE TELA
     ===================== */
  let glitchActive = false;

  function triggerGlitch(duration = 500) {
    if (glitchActive) return; // evita sobreposição de glitches
    glitchActive = true;

    const overlay = document.getElementById("glitchOverlay");
    document.body.classList.add("glitch-screen");
    overlay.style.display = "block";
    document.body.style.filter = "contrast(2) brightness(1.5)";

    setTimeout(() => {
      document.body.classList.remove("glitch-screen");
      overlay.style.display = "none";
      document.body.style.filter = "";
      glitchActive = false;
    }, duration);
  }

  /* =====================
     GLITCH DE TEXTO
     ===================== */
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

  /* =====================
     EFEITO TYPING
     ===================== */
  function startTyping() {
    document.querySelectorAll('.typing').forEach(el => {
      const text = el.getAttribute('data-text');
      if (!text) return;

      el.innerText = '';
      let i = 0;

      // limpa qualquer intervalo anterior guardado no elemento
      if (el._typingInterval) clearInterval(el._typingInterval);

      el._typingInterval = setInterval(() => {
        el.innerText += text[i];
        i++;

        if (i >= text.length) {
          clearInterval(el._typingInterval);
          el._typingInterval = null;
          glitchText(el);
        }
      }, 50);
    });
  }

  /* =====================
     ABAS
     ===================== */
  window.showTab = function (tab) {
    const sound = document.getElementById("tabsound");
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }

    triggerGlitch(400);

    setTimeout(() => {
      document.querySelectorAll('.main > div').forEach(d => d.classList.add('hidden'));

      const target = document.getElementById(tab);
      if (target) {
        target.classList.remove('hidden');
      }

      startTyping();
      atualizarDatas();
    }, 300);
  };

  /* =====================
     PLAYERS DE MÚSICA
     ===================== */
  window.togglePlayer = function (id) {
    const player  = document.getElementById(id);
    if (!player) return;

    const isOpen = player.style.display === "block";

    // fecha todos os outros players
    document.querySelectorAll('[id^="player"]').forEach(p => {
      if (p.id !== id) p.style.display = "none";
    });

    player.style.display = isOpen ? "none" : "block";

    if (!isOpen) {
      triggerGlitch(300);
    }
  };

  /* =====================
     INIT
     ===================== */
  startTyping();
  atualizarDatas();

});