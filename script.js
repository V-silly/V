window.handleTermKey = window.handleTermKey || function() {};
window.filterDiary = window.filterDiary || function() {};

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
    // Fecha o overlay e ativa o modo destruição após um delay dramático
    setTimeout(function() {
      triggerGlitch(400);
      setTimeout(activateDestructionMode, 500);
    }, 300);
  };


  /* =====================
     DESTRUCTION MODE
     ===================== */
  var destructionActive = false;
  var destroyedCount = 0;
  var shotsFired = 0;
  var ammoLeft = 30;
  var shootSfxPool = [];
  var SHOOT_SFX_COUNT = 4;

  // Pre-carrega pool de sons de tiro (AudioContext para gerarmos beeps sintéticos sem arquivo externo)
  var audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    }
    return audioCtx;
  }

  function playShootSound() {
    var ctx = getAudioCtx();
    if (!ctx) return;
    try {
      // Cria um som de tiro sintético: burst de ruído curto com pitch descendente
      var bufferSize = ctx.sampleRate * 0.08;
      var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      }
      var source = ctx.createBufferSource();
      source.buffer = buffer;

      var gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      var filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
      filter.Q.value = 0.5;

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start();
    } catch(e) {}
  }

  function playEmptySound() {
    var ctx = getAudioCtx();
    if (!ctx) return;
    try {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
  }

  function playReloadSound() {
    var ctx = getAudioCtx();
    if (!ctx) return;
    try {
      [0, 0.12, 0.25].forEach(function(t, i) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300 + i * 150, ctx.currentTime + t);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.1);
      });
    } catch(e) {}
  }

  function createCrosshair() {
    var ch = document.createElement("div");
    ch.id = "god-crosshair";
    ch.innerHTML = '<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="22" cy="22" r="11" stroke="#00ff00" stroke-width="1.5"/>' +
      '<circle cx="22" cy="22" r="2.5" fill="#00ff00"/>' +
      '<line x1="22" y1="2" x2="22" y2="13" stroke="#00ff00" stroke-width="1.5"/>' +
      '<line x1="22" y1="31" x2="22" y2="42" stroke="#00ff00" stroke-width="1.5"/>' +
      '<line x1="2" y1="22" x2="13" y2="22" stroke="#00ff00" stroke-width="1.5"/>' +
      '<line x1="31" y1="22" x2="42" y2="22" stroke="#00ff00" stroke-width="1.5"/>' +
      '<circle cx="22" cy="22" r="6" stroke="#00ff00" stroke-width="0.5" opacity="0.4"/>' +
      '</svg>';
    ch.style.cssText = "position:fixed;pointer-events:none;z-index:999998;transform:translate(-50%,-50%);left:-100px;top:-100px;transition:left 0.02s,top 0.02s;";
    document.body.appendChild(ch);
    return ch;
  }

  function createHUD() {
    var hud = document.createElement("div");
    hud.id = "destruction-hud";
    hud.innerHTML =
      '<div id="dhud-title">// MODO DEUS //</div>' +
      '<div id="dhud-ammo">AMMO: <span id="dhud-ammo-n">30</span>/30</div>' +
      '<div id="dhud-kills">DESTRUÍDOS: <span id="dhud-kills-n">0</span></div>' +
      '<div id="dhud-shots">TIROS: <span id="dhud-shots-n">0</span></div>' +
      '<div id="dhud-acc">PRECISÃO: <span id="dhud-acc-n">--%</span></div>' +
      '<div id="dhud-hint">ESC = sair &nbsp;|&nbsp; R = recarregar</div>';
    hud.style.cssText =
      "position:fixed;bottom:20px;right:20px;z-index:999997;" +
      "background:rgba(0,0,0,0.88);color:#00ff00;font-family:'Courier New',monospace;" +
      "font-size:12px;padding:14px 18px;border:1px solid #00ff00;" +
      "box-shadow:0 0 20px rgba(0,255,0,0.3);line-height:2;letter-spacing:1px;min-width:200px;";
    document.body.appendChild(hud);
    document.getElementById("dhud-title").style.cssText =
      "font-family:'Orbitron',monospace;font-size:10px;letter-spacing:4px;color:#00ff00;" +
      "margin-bottom:6px;animation:glitch 0.6s infinite;border-bottom:1px solid #003300;padding-bottom:6px;";
    document.getElementById("dhud-hint").style.cssText =
      "font-size:10px;color:#005500;margin-top:4px;border-top:1px solid #001a00;padding-top:4px;";
  }

  function updateHUD() {
    var ammoEl = document.getElementById("dhud-ammo-n");
    var killsEl = document.getElementById("dhud-kills-n");
    var shotsEl = document.getElementById("dhud-shots-n");
    var accEl = document.getElementById("dhud-acc-n");
    if (!ammoEl) return;
    ammoEl.textContent = ammoLeft;
    killsEl.textContent = destroyedCount;
    shotsEl.textContent = shotsFired;
    var acc = shotsFired > 0 ? Math.round((destroyedCount / shotsFired) * 100) : 0;
    accEl.textContent = acc + "%";
    // Cor do ammo muda conforme esvazia
    var ammoParent = document.getElementById("dhud-ammo");
    if (ammoLeft <= 5) ammoParent.style.color = "#ff0033";
    else if (ammoLeft <= 10) ammoParent.style.color = "#ff6600";
    else ammoParent.style.color = "#00ff00";
  }

  function addBulletHole(x, y) {
    var hole = document.createElement("div");
    hole.style.cssText =
      "position:fixed;left:" + x + "px;top:" + y + "px;" +
      "width:14px;height:14px;border-radius:50%;" +
      "background:radial-gradient(circle,#000 35%,#222 55%,transparent 70%);" +
      "border:1.5px solid #003300;pointer-events:none;" +
      "transform:translate(-50%,-50%);z-index:99990;";
    // Rachaduras ao redor
    for (var i = 0; i < 5; i++) {
      var crack = document.createElement("div");
      var angle = (360 / 5) * i + Math.random() * 20;
      var len = 8 + Math.random() * 10;
      crack.style.cssText =
        "position:absolute;left:50%;top:50%;width:" + len + "px;height:1px;" +
        "background:#003300;transform-origin:0 50%;transform:rotate(" + angle + "deg);opacity:0.7;";
      hole.appendChild(crack);
    }
    document.body.appendChild(hole);
    setTimeout(function() {
      if (hole.parentNode) hole.parentNode.removeChild(hole);
    }, 8000);
  }

  function spawnFragments(x, y, color) {
    color = color || "#00ff00";
    for (var i = 0; i < 10; i++) {
      var f = document.createElement("div");
      var size = 4 + Math.random() * 6;
      var angle = (Math.PI * 2 / 10) * i + Math.random() * 0.5;
      var dist = 30 + Math.random() * 60;
      var tx = Math.cos(angle) * dist;
      var ty = Math.sin(angle) * dist;
      f.style.cssText =
        "position:fixed;left:" + x + "px;top:" + y + "px;" +
        "width:" + size + "px;height:" + size + "px;" +
        "background:" + color + ";border-radius:2px;pointer-events:none;z-index:99995;" +
        "transition:transform 0.5s ease,opacity 0.5s ease;opacity:0.9;";
      document.body.appendChild(f);
      (function(el, dtx, dty) {
        requestAnimationFrame(function() {
          el.style.transform = "translate(" + dtx + "px," + dty + "px) rotate(" + (Math.random()*360) + "deg)";
          el.style.opacity = "0";
        });
        setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 600);
      })(f, tx, ty);
    }
  }

  function showKillMessage(x, y) {
    var msgs = ["DESTRUÍDO", "ELIMINADO", "404 NOT FOUND", "DELETADO", "POOF", "KABOOM", "NULL", "SEGFAULT", "RIP"];
    var msg = msgs[Math.floor(Math.random() * msgs.length)];
    var el = document.createElement("div");
    el.textContent = msg;
    el.style.cssText =
      "position:fixed;left:" + x + "px;top:" + (y - 20) + "px;" +
      "color:#00ff00;font-family:'Courier New',monospace;font-size:12px;font-weight:bold;" +
      "letter-spacing:2px;pointer-events:none;z-index:999996;" +
      "text-shadow:0 0 8px #00ff00;transition:transform 0.6s ease,opacity 0.6s ease;";
    document.body.appendChild(el);
    requestAnimationFrame(function() {
      el.style.transform = "translateY(-40px)";
      el.style.opacity = "0";
    });
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 700);
  }

  function showReloadMsg() {
    var el = document.createElement("div");
    el.textContent = "// RECARREGANDO //";
    el.style.cssText =
      "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);" +
      "color:#00ff00;font-family:'Orbitron',monospace;font-size:16px;letter-spacing:4px;" +
      "pointer-events:none;z-index:999999;text-shadow:0 0 20px #00ff00;";
    document.body.appendChild(el);
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 800);
  }

  function activateDestructionMode() {
    if (destructionActive) return;
    destructionActive = true;
    destroyedCount = 0;
    shotsFired = 0;
    ammoLeft = 30;

    document.body.style.cursor = "none";
    var crosshair = createCrosshair();
    createHUD();
    updateHUD();

    // Mensagem de entrada
    var introMsg = document.createElement("div");
    introMsg.textContent = "// MODO DESTRUIÇÃO ATIVADO — CLIQUE PARA ATIRAR //";
    introMsg.style.cssText =
      "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);" +
      "color:#00ff00;font-family:'Orbitron',monospace;font-size:14px;letter-spacing:3px;" +
      "pointer-events:none;z-index:999999;text-shadow:0 0 20px #00ff00;text-align:center;";
    document.body.appendChild(introMsg);
    setTimeout(function() { if (introMsg.parentNode) introMsg.parentNode.removeChild(introMsg); }, 2000);

    function onMouseMove(e) {
      crosshair.style.left = e.clientX + "px";
      crosshair.style.top  = e.clientY + "px";
    }

    function onShoot(e) {
      // Ignora cliques no HUD e na mira
      if (e.target.closest && e.target.closest("#destruction-hud")) return;

      if (ammoLeft <= 0) {
        playEmptySound();
        var noAmmoEl = document.getElementById("dhud-ammo");
        if (noAmmoEl) { noAmmoEl.style.animation = "glitch 0.2s 3"; }
        return;
      }

      ammoLeft--;
      shotsFired++;
      playShootSound();

      // Vibração da tela
      document.body.style.transform = "translate(" + (Math.random()*4-2) + "px," + (Math.random()*4-2) + "px)";
      setTimeout(function() { document.body.style.transform = ""; }, 60);

      addBulletHole(e.clientX, e.clientY);
      spawnFragments(e.clientX, e.clientY);

      // Descobre o elemento alvo (ignora HUD, crosshair, canvas, body, html)
      var ignore = ["god-crosshair","destruction-hud","matrix","welcomeMatrix","glitchOverlay","pixelBreak"];
      var target = document.elementFromPoint(e.clientX, e.clientY);

      var validTarget = target &&
        target !== document.body &&
        target !== document.documentElement &&
        !ignore.some(function(id) { return target.id === id || (target.closest && target.closest("#destruction-hud")); }) &&
        target.tagName !== "CANVAS";

      if (validTarget) {
        destroyedCount++;
        showKillMessage(e.clientX, e.clientY);
        // Anima a destruição
        target.style.transition = "transform 0.25s ease, opacity 0.25s ease, filter 0.25s ease";
        target.style.filter = "brightness(3) contrast(2)";
        target.style.transform = "scale(0.85) skewX(" + (Math.random()*10-5) + "deg)";
        target.style.opacity = "0";
        setTimeout(function() {
          if (target.parentNode) target.parentNode.removeChild(target);
        }, 260);
      }

      updateHUD();

      if (ammoLeft <= 0) {
        setTimeout(function() {
          var emptyEl = document.createElement("div");
          emptyEl.textContent = "// SEM MUNIÇÃO — PRESSIONE R PARA RECARREGAR //";
          emptyEl.style.cssText =
            "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);" +
            "color:#ff0033;font-family:'Orbitron',monospace;font-size:13px;letter-spacing:3px;" +
            "pointer-events:none;z-index:999999;text-shadow:0 0 20px #ff0033;text-align:center;";
          document.body.appendChild(emptyEl);
          setTimeout(function() { if (emptyEl.parentNode) emptyEl.parentNode.removeChild(emptyEl); }, 2500);
        }, 200);
      }
    }

    function onKeyDown(e) {
      if (e.key === "Escape") {
        exitDestructionMode();
      }
      if (e.key === "r" || e.key === "R") {
        if (ammoLeft < 30) {
          playReloadSound();
          showReloadMsg();
          ammoLeft = 30;
          updateHUD();
        }
      }
    }

    function exitDestructionMode() {
      destructionActive = false;
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("click", onShoot);
      document.removeEventListener("keydown", onKeyDown);
      var ch = document.getElementById("god-crosshair");
      var hud = document.getElementById("destruction-hud");
      if (ch) ch.parentNode.removeChild(ch);
      if (hud) hud.parentNode.removeChild(hud);

      // Mostra placar final
      var summary = document.createElement("div");
      summary.innerHTML =
        '<div style="font-family:Orbitron,monospace;font-size:13px;letter-spacing:3px;margin-bottom:12px;animation:glitch 0.5s infinite">// MODO DESTRUIÇÃO ENCERRADO //</div>' +
        '<div>ELEMENTOS DESTRUÍDOS: <span style="color:#00ff00">' + destroyedCount + '</span></div>' +
        '<div>TIROS DISPARADOS: <span style="color:#00ff00">' + shotsFired + '</span></div>' +
        '<div>PRECISÃO: <span style="color:#00ff00">' + (shotsFired > 0 ? Math.round((destroyedCount/shotsFired)*100) : 0) + '%</span></div>' +
        '<div style="margin-top:12px;font-size:10px;color:#005500">ESC fechou o modo</div>';
      summary.style.cssText =
        "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);" +
        "background:rgba(0,0,0,0.95);color:#00ff00;font-family:'Courier New',monospace;" +
        "font-size:13px;padding:24px 32px;border:1px solid #00ff00;" +
        "box-shadow:0 0 30px rgba(0,255,0,0.4);z-index:999999;text-align:center;line-height:2;letter-spacing:1px;";
      document.body.appendChild(summary);
      setTimeout(function() {
        summary.style.transition = "opacity 0.5s";
        summary.style.opacity = "0";
        setTimeout(function() { if (summary.parentNode) summary.parentNode.removeChild(summary); }, 500);
      }, 3000);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("click", onShoot);
    document.addEventListener("keydown", onKeyDown);
  }


  /* =====================
     INIT
     ===================== */
  startTyping();
  atualizarDatas();

});