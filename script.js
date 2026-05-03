document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     WELCOME SCREEN
     ===================== */
  (function initWelcome() {
    const screen   = document.getElementById("welcomeScreen");
    const cvs      = document.getElementById("welcomeMatrix");
    const ctx      = cvs.getContext("2d");
    const clockEl  = document.getElementById("wcClock");
    const linesEl  = document.getElementById("wcLines");
    const enterBtn = document.getElementById("wcEnterBtn");

    cvs.width  = window.innerWidth;
    cvs.height = window.innerHeight;

    const JP_CHARS = "ABCDEF0123456789#@%&?!";
    const fs = 13;
    let drops = Array.from({ length: Math.floor(cvs.width / fs) }, () => Math.random() * 30 | 0);

    function drawWelcomeMatrix() {
      ctx.fillStyle = "rgba(0,0,0,0.055)";
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      ctx.fillStyle = "#00ff00";
      ctx.font = fs + "px monospace";
      for (let i = 0; i < drops.length; i++) {
        ctx.fillText(JP_CHARS[Math.floor(Math.random() * JP_CHARS.length)], i * fs, drops[i] * fs);
        if (drops[i] * fs > cvs.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    const matrixIv = setInterval(drawWelcomeMatrix, 33);

    function updateClock() {
      const now = new Date();
      clockEl.textContent =
        String(now.getHours()).padStart(2,"0") + ":" +
        String(now.getMinutes()).padStart(2,"0") + ":" +
        String(now.getSeconds()).padStart(2,"0");
    }
    updateClock();
    const clockIv = setInterval(updateClock, 1000);

    const steps = [
      { label: "Inicializando V",               delay: 200,  dur: 500 },
      { label: "Verificando conexao do usuario", delay: 850,  dur: 700 },
      { label: "Verificando arquivos do sistema",delay: 1700, dur: 600 },
      { label: "Verificando dados do usuario",   delay: 2450, dur: 800 },
      { label: "Verificando nivel de acesso",    delay: 3400, dur: 700 },
      { label: "Descriptografando protocolos",   delay: 4250, dur: 500 },
      { label: "Conexao segura estabelecida",    delay: 4900, dur: 400 },
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

    enterBtn.addEventListener("click", () => {
      const sound = document.getElementById("tabsound");
      if (sound) { sound.currentTime = 0; sound.play().catch(() => {}); }

      screen.style.filter = "contrast(2) brightness(1.5)";
      document.body.classList.add("glitch-screen");

      setTimeout(() => {
        document.body.classList.remove("glitch-screen");
        screen.style.filter = "";
        screen.classList.add("hide");

        setTimeout(() => {
          screen.remove();
          clearInterval(matrixIv);
          clearInterval(clockIv);
        }, 650);
      }, 350);
    });
  })();


  /* =====================
     MATRIX PRINCIPAL
     ===================== */
  const canvas   = document.getElementById("matrix");
  const ctx      = canvas.getContext("2d");
  const fontSize = 14;
  const MAIN_CHARS = "ABCDEF0123456789#@!?%&*<>[]{}";
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
      ctx.fillText(MAIN_CHARS[Math.floor(Math.random() * MAIN_CHARS.length)], i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  resizeCanvas();
  setInterval(drawMatrix, 33);
  window.addEventListener("resize", resizeCanvas);


  /* =====================
     MUSICA
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
     PIXEL BREAK TRANSITION
     ===================== */
  let pixelBreakActive = false;

  function triggerPixelBreak(cb) {
    if (pixelBreakActive) { if (cb) cb(); return; }
    pixelBreakActive = true;

    const overlay = document.getElementById("pixelBreak");
    overlay.innerHTML = "";
    overlay.classList.remove("hidden");

    const cols = 20, rows = 15;
    const W = window.innerWidth / cols;
    const H = window.innerHeight / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = document.createElement("div");
        px.className = "px-cell";
        px.style.cssText =
          "width:" + W + "px; height:" + H + "px;" +
          "left:" + (c * W) + "px; top:" + (r * H) + "px;" +
          "animation-delay:" + (Math.random() * 0.25) + "s;";
        overlay.appendChild(px);
      }
    }

    setTimeout(() => {
      if (cb) cb();
      setTimeout(() => {
        overlay.classList.add("hidden");
        overlay.innerHTML = "";
        pixelBreakActive = false;
      }, 350);
    }, 300);
  }

  let glitchActive = false;
  function triggerGlitch(duration) {
    duration = duration || 500;
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
     DATA E HORA
     ===================== */
  function atualizarDatas() {
    document.querySelectorAll(".data").forEach(el => {
      const raw  = el.getAttribute("data-date");
      const data = raw ? new Date(raw) : new Date();
      el.innerText = "[LOG " +
        String(data.getDate()).padStart(2,"0") + "/" +
        String(data.getMonth()+1).padStart(2,"0") + " " +
        String(data.getHours()).padStart(2,"0") + ":" +
        String(data.getMinutes()).padStart(2,"0") + "]";
    });
  }


  /* =====================
     ABAS
     ===================== */
  window.showTab = function (tab) {
    const sound = document.getElementById("tabsound");
    if (sound) { sound.currentTime = 0; sound.play().catch(() => {}); }

    triggerPixelBreak(function() {
      document.querySelectorAll(".main > div").forEach(function(d) { d.classList.add("hidden"); });
      const target = document.getElementById(tab);
      if (target) target.classList.remove("hidden");
      startTyping();
      atualizarDatas();
      if (tab === "terminal") initTerminal();
    });
  };


  /* =====================
     PLAYERS DE MUSICA
     ===================== */
  window.togglePlayer = function (id) {
    const player = document.getElementById(id);
    if (!player) return;
    const isOpen = player.style.display === "block";
    document.querySelectorAll('[id^="player"]').forEach(function(p) {
      if (p.id !== id) p.style.display = "none";
    });
    player.style.display = isOpen ? "none" : "block";
    if (!isOpen) triggerGlitch(300);
  };


  /* =====================
     GREP / SEARCH DIARIO
     ===================== */
  window.filterDiary = function () {
    const q = document.getElementById("grepInput").value.trim().toLowerCase();
    const entries = document.querySelectorAll("#diaryEntries .entry");
    const noResult = document.getElementById("grepNoResult");
    let count = 0;

    entries.forEach(function(e) {
      const text = (e.getAttribute("data-search") || "") + " " + e.innerText.toLowerCase();
      const match = !q || text.includes(q);
      e.style.display = match ? "" : "none";
      if (match) count++;
    });

    const countEl = document.getElementById("grepCount");
    if (q) {
      countEl.textContent = count + " resultado(s)";
      noResult.classList.toggle("hidden", count > 0);
    } else {
      countEl.textContent = "";
      noResult.classList.add("hidden");
    }
  };


  /* =====================
     TERMINAL FAKE
     ===================== */
  let terminalReady = false;

  function initTerminal() {
    if (terminalReady) return;
    terminalReady = true;
    termPrint("Sistema V -- Terminal Interativo v0.9");
    termPrint('Digite <span class="t-cmd">help</span> para ver os comandos.');
    termPrint("");
    document.getElementById("termInput").focus();
  }

  function termPrint(html, cls) {
    cls = cls || "";
    const out = document.getElementById("termOutput");
    const line = document.createElement("div");
    line.className = "term-line " + cls;
    line.innerHTML = html;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  }

  const COMMANDS = {
    help: function() {
      termPrint("Comandos disponíveis:");
      termPrint('  <span class="t-cmd">help</span>          -- mostra isso aqui (obviamente)');
      termPrint('  <span class="t-cmd">whoami</span>        -- descobre quem voce eh (spoiler: nao sou eu)');
      termPrint('  <span class="t-cmd">ls</span>            -- lista arquivos do sistema');
      termPrint('  <span class="t-cmd">cat diario</span>    -- le o diario (invadindo privacidade)');
      termPrint('  <span class="t-cmd">date</span>          -- data e hora atual');
      termPrint('  <span class="t-cmd">ping</span>          -- testa a conexao');
      termPrint('  <span class="t-cmd">uname</span>         -- info do sistema');
      termPrint('  <span class="t-cmd">clear</span>         -- limpa o terminal');
      termPrint('  <span class="t-cmd">hack</span>          -- hackeia o painel solar do Kelvin');
      termPrint('  <span class="t-cmd">sudo rm -rf /</span> -- muito corajoso...');
    },
    whoami: function() {
      termPrint("Analisando DNA digital...");
      setTimeout(function() { termPrint("Resultado: voce eh mais um mortal curioso. Bem-vindo."); }, 600);
    },
    ls: function() {
      termPrint("drwxr-xr-x  diario/");
      termPrint("drwxr-xr-x  jogos/");
      termPrint("drwxr-xr-x  musicas/");
      termPrint("-rw-r--r--  segredos.txt  <span style='color:#ff0033'>[ACESSO NEGADO]</span>");
      termPrint("-rw-r--r--  senhas.zip    <span style='color:#ff0033'>[CRIPTOGRAFADO]</span>");
      termPrint("-rw-r--r--  README.md     [nem eu sei o que tem aqui]");
    },
    "cat diario": function() {
      termPrint("[01/05] tentei fazer algo produtivo. falhou.");
      termPrint("[02/05] joguei 6h seguidas. sucesso.");
      termPrint("[03/05] site funcionando. ainda bem?.");
    },
    date: function() {
      const now = new Date();
      termPrint("DATA ATUAL: " + now.toLocaleString("pt-BR"));
      termPrint("Fuso: America/Sao_Paulo (BR-SP-001)");
    },
    ping: function() {
      termPrint("PING v-system.local -- testando...");
      setTimeout(function() { termPrint("64 bytes: seq=1 ttl=64 time=0.001ms (velocidade da luz, ne)"); }, 400);
      setTimeout(function() { termPrint("64 bytes: seq=2 ttl=64 time=0.002ms"); }, 700);
      setTimeout(function() { termPrint("64 bytes: seq=3 ttl=64 time=0.001ms"); }, 1000);
      setTimeout(function() { termPrint("-- 3 packets transmitted, 3 received, 0% loss. Voce existe."); }, 1300);
    },
    uname: function() {
      termPrint("OS: V-OS 0.9.0 LTS (Paranoid Edition)");
      termPrint("Kernel: vk-matrix-5.99");
      termPrint("Uptime: desde que voce abriu o site");
      termPrint("CPU: Intel Celeron N3050 (modo economia extrema ativado)");
      termPrint("RAM: Suficiente pra isso aqui");
    },
    clear: function() {
      document.getElementById("termOutput").innerHTML = "";
    },
    hack: function() {
      termPrint("Iniciando sequencia de hack...", "t-warn");
      setTimeout(function() { termPrint("Conectando a placa solar do Kelvin..."); }, 400);
      setTimeout(function() { termPrint("Quebrando firewall... [XXXXXXXX..] 80%"); }, 900);
      setTimeout(function() { termPrint("Quebrando firewall... [XXXXXXXXXX] 100%"); }, 1400);
      setTimeout(function() { termPrint("ERRO: O Kelvin resetou o roteador."); }, 1900);
      setTimeout(function() { termPrint("Talvez tentar hackear o chuveiro do Fabio?", "t-warn"); }, 2300);
    },
    "sudo rm -rf /": function() {
      termPrint("Senha para root:", "t-warn");
      setTimeout(function() {
        termPrint("Autenticando...");
        setTimeout(function() {
          termPrint("Deletando tudo...");
          setTimeout(function() {
            termPrint("Deletando /usr... /bin... /home...");
            setTimeout(function() {
              termPrint("Deletando /dev/brain...");
              setTimeout(function() {
                termPrint("Nao, vai nao. Voce ficou louco?", "t-warn");
              }, 600);
            }, 600);
          }, 600);
        }, 600);
      }, 800);
    },
    matrix: function() {
      termPrint("VOCE VE OS NUMEROS?", "t-warn");
      setTimeout(function() {
        for (var i = 0; i < 8; i++) {
          (function(idx) {
            setTimeout(function() {
              var s = "";
              for (var j = 0; j < 40; j++) s += Math.random() > 0.5 ? "1" : "0";
              termPrint('<span style="color:#00ff00;opacity:0.6;font-size:11px">' + s + '</span>');
            }, idx * 80);
          })(i);
        }
        setTimeout(function() { termPrint("Wake up, Neo..."); }, 700);
      }, 300);
    },
    coffee: function() {
      termPrint("Preparando cafe...");
      setTimeout(function() { termPrint("Cafe pronto. Mas e so virtual. Sinto muito."); }, 1000);
    },
    sleep: function() {
      termPrint("Boa noite. zzzz...");
      setTimeout(function() { termPrint("... nao adiantou, voce ainda esta aqui."); }, 1500);
    },
    vibes: function() {
      termPrint("CALCULANDO NIVEL DE CORTISOL...");
      setTimeout(function() {
        var v = Math.floor(Math.random() * 100);
        termPrint("Resultado: " + v + "% de Cortisol detectadas. " + (v > 70 ? "Ta bem alto." : "I Feel So close to you right now.... ."));
      }, 800);
    }
  };

  window.handleTermKey = function (e) {
    if (e.key !== "Enter") return;
    const input = document.getElementById("termInput");
    const cmd   = input.value.trim().toLowerCase();
    if (!cmd) return;

    termPrint('<span class="t-prompt">root@V:~$</span> ' + input.value);
    input.value = "";

    if (COMMANDS[cmd]) {
      COMMANDS[cmd]();
    } else {
      termPrint('bash: ' + cmd + ': comando nao encontrado. (tente <span class="t-cmd">help</span>)', "t-warn");
    }
  };


  /* =====================
     KONAMI CODE EASTER EGG
     ===================== */
  var KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  var konamiIdx = 0;

  document.addEventListener("keydown", function(e) {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) {
        konamiIdx = 0;
        triggerKonami();
      }
    } else {
      konamiIdx = 0;
    }
  });

  function triggerKonami() {
    document.getElementById("konamiOverlay").classList.remove("hidden");
    triggerGlitch(600);
    var sfx = document.getElementById("konamisfx");
    if (sfx) { sfx.currentTime = 0; sfx.play().catch(function(){}); }
  }

  window.closeKonami = function () {
    document.getElementById("konamiOverlay").classList.add("hidden");
  };


  /* =====================
     INIT
     ===================== */
  startTyping();
  atualizarDatas();

});