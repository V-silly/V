document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     WELCOME SCREEN
     ===================== */
  (function initWelcome() {
    const screen  = document.getElementById("welcomeScreen");
    const cvs     = document.getElementById("welcomeMatrix");
    const ctx     = cvs.getContext("2d");
    const clockEl = document.getElementById("wcClock");
    const linesEl = document.getElementById("wcLines");
    const enterBtn = document.getElementById("wcEnterBtn");

    // canvas matrix
    cvs.width  = window.innerWidth;
    cvs.height = window.innerHeight;

    const fs = 13;
    let drops = Array.from({ length: Math.floor(cvs.width / fs) }, () => Math.random() * 30 | 0);

    function drawWelcomeMatrix() {
      ctx.fillStyle = "rgba(0,0,0,0.055)";
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      ctx.fillStyle = "#00ff00";
      ctx.font = fs + "px monospace";
      for (let i = 0; i < drops.length; i++) {
        ctx.fillText(Math.random() > 0.5 ? "1" : "0", i * fs, drops[i] * fs);
        if (drops[i] * fs > cvs.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    const matrixIv = setInterval(drawWelcomeMatrix, 33);

    // relógio
    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      clockEl.textContent = h + ":" + m + ":" + s;
    }
    updateClock();
    const clockIv = setInterval(updateClock, 1000);

    // sequência de boot
    const steps = [
      { label: "Inicializando V",              delay: 200,  dur: 500 },
      { label: "Verificando conexão do usuário",  delay: 850,  dur: 700 },
      { label: "Verificando arquivos do sistema", delay: 1700, dur: 600 },
      { label: "Verificando dados do usuário",    delay: 2450, dur: 800 },
      { label: "Verificando nível de acesso",     delay: 3400, dur: 700 },
      { label: "Descriptografando protocolos",    delay: 4250, dur: 500 },
      { label: "Conexão segura estabelecida",     delay: 4900, dur: 400 },
    ];

    steps.forEach(s => {
      setTimeout(() => {
        const row = document.createElement("div");
        row.className = "wc-line";
        row.innerHTML =
          '<span class="wc-prefix">[SYS]</span>' +
          '<span>' + s.label + '</span>' +
          '<span class="wc-status wc-s-wait">PROC...</span>';
        linesEl.appendChild(row);
        requestAnimationFrame(() => row.classList.add("show"));

        setTimeout(() => {
          const st = row.querySelector(".wc-status");
          st.className = "wc-status wc-s-ok";
          st.textContent = "[ OK ]";
        }, s.dur);
      }, s.delay);
    });

    // barra de progresso e reveal
    const revealAt = 5500;
    setTimeout(() => {
      document.getElementById("wcDivider").style.opacity = "1";
      const wrap = document.getElementById("wcProgressWrap");
      const fill = document.getElementById("wcProgressFill");
      wrap.style.opacity = "1";
      let w = 0;
      const iv = setInterval(() => {
        w += 2;
        fill.style.width = w + "%";
        if (w >= 100) {
          clearInterval(iv);
          setTimeout(() => {
            document.getElementById("wcWelcome").classList.add("show");
            document.querySelector(".wc-sysinfo").style.opacity = "1";
          }, 150);
        }
      }, 15);
    }, revealAt);

    // botão ENTRAR
    enterBtn.addEventListener("click", () => {
      // toca som de aba se disponível
      const sound = document.getElementById("tabsound");
      if (sound) { sound.currentTime = 0; sound.play().catch(() => {}); }

      // glitch de saída
      screen.style.filter = "contrast(2) brightness(1.5)";
      document.body.classList.add("glitch-screen");

      setTimeout(() => {
        document.body.classList.remove("glitch-screen");
        screen.style.filter = "";
        screen.classList.add("hide");

        // remove do DOM depois da transição
        setTimeout(() => {
          screen.remove();
          clearInterval(matrixIv);
          clearInterval(clockIv);
        }, 650);
      }, 350);
    });
  })();


  /* =====================
     DATA E HORA
     ===================== */
  function atualizarDatas() {
    document.querySelectorAll(".data").forEach(el => {
      const raw  = el.getAttribute("data-date");
      const data = raw ? new Date(raw) : new Date();

      const dia     = String(data.getDate()).padStart(2, "0");
      const mes     = String(data.getMonth() + 1).padStart(2, "0");
      const horas   = String(data.getHours()).padStart(2, "0");
      const minutos = String(data.getMinutes()).padStart(2, "0");

      el.innerText = `[LOG ${dia}/${mes} ${horas}:${minutos}]`;
    });
  }

  /* =====================
     MATRIX PRINCIPAL
     ===================== */
  const canvas  = document.getElementById("matrix");
  const ctx     = canvas.getContext("2d");
  const fontSize = 14;
  let drops = [];

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = Array.from({ length: Math.floor(canvas.width / fontSize) }, () => 1);
  }

  function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff00";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
      ctx.fillText(Math.random() > 0.5 ? "1" : "0", i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  resizeCanvas();
  setInterval(drawMatrix, 33);
  window.addEventListener("resize", resizeCanvas);

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
    if (glitchActive) return;
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
        .map((char, index) => index < i ? char : chars[Math.floor(Math.random() * chars.length)])
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
    document.querySelectorAll(".typing").forEach(el => {
      const text = el.getAttribute("data-text");
      if (!text) return;
      el.innerText = "";
      let i = 0;
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
    if (sound) { sound.currentTime = 0; sound.play().catch(() => {}); }

    triggerGlitch(400);

    setTimeout(() => {
      document.querySelectorAll(".main > div").forEach(d => d.classList.add("hidden"));
      const target = document.getElementById(tab);
      if (target) target.classList.remove("hidden");
      startTyping();
      atualizarDatas();
    }, 300);
  };

  /* =====================
     PLAYERS DE MÚSICA
     ===================== */
  window.togglePlayer = function (id) {
    const player = document.getElementById(id);
    if (!player) return;
    const isOpen = player.style.display === "block";
    document.querySelectorAll('[id^="player"]').forEach(p => {
      if (p.id !== id) p.style.display = "none";
    });
    player.style.display = isOpen ? "none" : "block";
    if (!isOpen) triggerGlitch(300);
  };

  /* =====================
     INIT
     ===================== */
  startTyping();
  atualizarDatas();

});