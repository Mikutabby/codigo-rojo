# 💣 CÓDIGO ROJO — Desactiva la bomba

Juego web de puzzles: una bomba con cronómetro, módulos para resolver y un
manual de reglas que tenés que consultar bajo presión. Single-player,
100% offline, sin dependencias.

## Jugar

```bash
# Opción 1: abrir directo
xdg-open index.html

# Opción 2: servidor local
python3 -m http.server 8788
# → http://127.0.0.1:8788
```

## Cómo se juega

1. Elegí dificultad: **FÁCIL** (3 módulos · 5:00), **NORMAL** (5 · 5:30),
   **EXPERTO** (7 · 6:30).
2. Resolvé **todos** los módulos antes de que se acabe el tiempo.
3. **3 errores (strikes) = explosión.**
4. El **MANUAL** (botón arriba a la derecha) tiene las reglas de cada módulo.
   Casi todo depende del **número de serie** y las **baterías** de la bomba.

## Módulos

| Módulo | Qué hay que hacer |
|---|---|
| 📜 Acertijo | Enigma escrito, elige la respuesta correcta |
| 🧩 Deducción | Caso lógico con pistas, una sola respuesta válida |
| 🔌 Cables | Cortá UN cable según la tabla del manual |
| 🔴 Botón | Presioná/soltá según color, etiqueta, baterías y reloj |
| 🎯 Simon | Repetí la secuencia con el color *mapeado* (manual) |
| 🔣 Símbolos | Presioná los 4 símbolos en el orden de la columna del manual |
| 🔤 Contraseña | Formá una palabra de la lista rotando las letras |
| 🔢 Código | Deducí el código de 4 dígitos (pistas + nº de serie) |

## Tecnicismos

- HTML/CSS/JS puro — sin frameworks ni build.
- Sonido 100% procedural con WebAudio (ticks, alarmas, explosión).
- Iconos SVG propios (la PC no tiene fuentes emoji).
- Récords en `localStorage`.
- Responsive (probado a 390px) y `prefers-reduced-motion` respetado.
- Tests e2e con Playwright: victoria, derrota, retry, los 8 módulos, móvil.

## Archivos

```
index.html      pantallas y estructura
css/style.css   tema CRT militar, scanlines, glitch, shake
js/icons.js     iconos SVG
js/audio.js     motor de sonido procedural
js/manual.js    contenido del Manual del Desarmador
js/modules.js   generadores + lógica de los 8 módulos
js/game.js      estado, temporizador, strikes, flujo
```
