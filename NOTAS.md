# V OS — Guia de Referência

## Estrutura de Arquivos

```
projeto/
├── index.html        ← estrutura do site
├── style.css         ← visual e animações
├── script.js         ← lógica e efeitos
└── assets/
    └── sounds/
        ├── virtual_vibes-glitch-sound-effect-hd-379466_[cut_1sec].mp3
        └── humanstudioedm-cyberpunk-techno-510219 (1).mp3
```

---

## Publicar no GitHub Pages

```bash
git add .
git commit -m "update"
git push
```

---

## Como adicionar conteúdo

### Nova entrada no diário / jogos / filmes

```html
<div class="entry">
  <b class="data" data-date="ANO-MES-DIATHORA:MINUTO"></b><br>
  <p class="glow">Título ou destaque</p>
  <p>Texto comum aqui</p>
  <img src="URL_DA_IMAGEM" width="300" alt="">
</div>
```

**Exemplo de data:** `data-date="2026-05-10T21:30"` → aparece como `[LOG 10/05 21:30]`  
**Sem data:** `<b class="data"></b>` → usa a data/hora atual automaticamente

---

### Nova música com player Spotify

1. Abra a música no Spotify
2. Clique nos `...` → Compartilhar → Incorporar → copie o `src` do iframe
3. Cole abaixo, trocando `playerX` por um número novo (player3, player4...)

```html
<div class="entry">
  <b class="data" data-date="ANO-MES-DIATHORA:MINUTO"></b><br>
  <p>Nome da Música - Artista</p>
  <p class="glow">Comentário sobre a música</p>

  <button onclick="togglePlayer('playerX')">▶ Ouvir</button>

  <div id="playerX" style="display:none; margin-top:10px;">
    <iframe
      style="border-radius:12px"
      src="https://open.spotify.com/embed/track/ID_DA_MUSICA?utm_source=generator&theme=0"
      width="100%" height="352" frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Nome da Música no Spotify">
    </iframe>
  </div>
</div>
```

---

### Novo patch

```html
<div class="entry">Patch X - descrição do que mudou</div>
```

---

## Classes de texto disponíveis

| Classe | Efeito | Uso |
|---|---|---|
| `class="glow"` | Texto brilhando em verde | `<p class="glow">texto</p>` |
| `class="glitch"` | Glitch animado contínuo (leve) | `<p class="glitch">texto</p>` |
| `class="glitch-strong" data-text="texto"` | Glitch com camadas cortadas | `<p class="glitch-strong" data-text="texto">texto</p>` |
| `class="typing" data-text="[TÍTULO]"` | Efeito de digitação + glitch | `<h2 class="typing" data-text="[TÍTULO]"></h2>` |

> **Melhor combinação para títulos:** `class="typing"` com `data-text`  
> **Melhor combinação para texto:** `class="glitch-strong"` (lembre de colocar o mesmo texto no `data-text` e dentro da tag)

---

## Estrutura de uma aba nova

Para criar uma aba nova (ex: "Anime"), faça em 3 lugares:

**1. No sidebar (index.html):**
```html
<button onclick="showTab('anime')">Anime</button>
```

**2. No main (index.html):**
```html
<div id="anime" class="hidden">
  <h2 class="typing" data-text="[ANIME]"></h2>
  <!-- conteúdo aqui -->
</div>
```

**3. No patches, registre:**
```html
<div class="entry">Patch X - Adicionada aba Anime</div>
```

---

## Efeitos do script

| Função | O que faz |
|---|---|
| `toggleMusic()` | Liga/desliga a música de fundo |
| `showTab('id')` | Troca de aba com glitch + som |
| `togglePlayer('playerX')` | Abre/fecha player do Spotify |
| `triggerGlitch(ms)` | Dispara glitch de tela por X milissegundos |

---

## Variáveis de cor (style.css)

Para mudar a cor do site inteiro, edite só estas linhas no topo do `style.css`:

```css
:root {
  --green:      #00ff00;  ← cor principal
  --green-dim:  #00aa00;  ← cor secundária / hover
  --green-dark: #001100;  ← fundo escuro dos botões
  --black:      #000000;  ← fundo geral
}
```

---

## Observações importantes

- Caminhos de áudio usam `/` (barra normal), nunca `\` (barra invertida)
- Todo player novo precisa de um `id` único: `player3`, `player4`...
- O `data-text` do `typing` deve ser idêntico ao que aparece — é ele que digita
- O `data-text` do `glitch-strong` deve ser igual ao texto dentro da tag
- Imagens sem legenda usam `alt=""` — não deixe o atributo faltando
