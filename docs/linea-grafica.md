# Línea gráfica MedApp — «Oliva y miel»

Identidad visual cálida del frontend para demos de clase. Objetivo: que MedApp
se sienta humana y cercana, sin caer en el look genérico cream + terracota.

## Principios

| Elemento | Decisión |
|----------|----------|
| Color primario | Oliva `#3F6B52` |
| Acento | Miel / ámbar `#C4923A` (no terracota) |
| Tipografía display | **Fraunces** — marca y títulos |
| Tipografía UI | **Figtree** — formularios, nav, cuerpo |
| Marca | Wordmark **MedApp** + monograma con trazo de pulso (SVG) |
| Atmósfera | Arena cálida + lavado melocotón + trama diagonal suave |
| Superficies | Paneles marfil translúcidos, borde piedra |
| Estados | Badges con radio suave + borde izquierdo en tarjetas |

## Dónde vive

- Tokens y base: `frontend/src/assets/main.css`
- Fuentes: `frontend/index.html` (Google Fonts)
- Marca: `frontend/src/components/BrandMark.vue`
- Home (hero de marca): `frontend/src/views/HomeView.vue`

## Prompt útil para iterar en clase

> «Mantén la línea gráfica Oliva y miel de MedApp (oliva `#3F6B52`, acento miel
> `#C4923A`, Fraunces/Figtree, BrandMark). Al añadir UI nueva, reutiliza tokens
> CSS existentes; no introduzcas Inter, púrpura, terracota ni sombras multilayers.»
