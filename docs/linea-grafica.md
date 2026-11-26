# Línea gráfica MedApp — «Pulso clínico»

Identidad visual del frontend para demos de clase. Objetivo: que MedApp se
reconozca al instante y no parezca un template genérico azul/gris.

## Principios

| Elemento | Decisión |
|----------|----------|
| Color primario | Teal `#0D7377` (clínico, no “hospital blue”) |
| Tipografía display | **Fraunces** — marca y títulos |
| Tipografía UI | **Figtree** — formularios, nav, cuerpo |
| Marca | Wordmark **MedApp** + monograma con trazo de pulso (SVG) |
| Atmósfera | Gradiente mist + trama de líneas diagonales |
| Superficies | Paneles translúcidos con borde jade, sin sombras pesadas |
| Estados | Badges con radio suave (no píldoras full) + borde izquierdo en tarjetas |

## Dónde vive

- Tokens y base: `frontend/src/assets/main.css`
- Fuentes: `frontend/index.html` (Google Fonts)
- Marca: `frontend/src/components/BrandMark.vue`
- Home (hero de marca): `frontend/src/views/HomeView.vue`

## Prompt útil para iterar en clase

> «Mantén la línea gráfica Pulso clínico de MedApp (teal, Fraunces/Figtree,
> BrandMark). Al añadir UI nueva, reutiliza tokens CSS existentes; no introduzcas
> Inter, púrpura ni sombras multilayers.»
