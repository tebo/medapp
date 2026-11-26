# Prompt 16 — Línea gráfica «Oliva y miel»

Prompt usado (o reutilizable) para la identidad visual del frontend:

> En MedApp (Vue 3 + Vite), define e implementa la línea gráfica **«Oliva y miel»**.
>
> Requisitos:
> 1. Tokens CSS en `frontend/src/assets/main.css`: primario oliva `#3F6B52`,
>    primario oscuro `#2F5240`, soft `#E4EDE6`, acento miel `#C4923A`, tinta
>    cálida `#2A241C`, bordes piedra `#D9CFC2`, superficies marfil translúcidas.
> 2. Tipografía: **Fraunces** (marca y títulos) + **Figtree** (UI). Cargarlas en
>    `frontend/index.html` vía Google Fonts. No uses Inter, Roboto ni system-ui
>    como tipografía principal.
> 3. Componente `BrandMark.vue`: monograma SVG con trazo de pulso; úsalo en
>    NavBar, Home, Login y Register.
> 4. Home con hero a sangre: marca MedApp como señal principal, un headline, un
>    párrafo corto y un grupo de CTAs. Fondo gradiente oliva → miel con trazo
>    tipo ECG. Sin cards en el hero.
> 5. Atmósfera global: fondo arena/melocotón + trama diagonal suave (no flat
>    gray). Nav sticky en café cálido.
> 6. Badges y filtros con radio suave (no píldoras `999px`). Tarjetas de cita con
>    borde izquierdo según estado.
> 7. Documenta la identidad en `docs/linea-grafica.md` y enlázala desde el README.
>
> Restricciones: no púrpura, no terracota como acento principal, no sombras
> multilayers, no emojis en la marca. Reutiliza tokens en cualquier UI nueva.

## Archivos tocados (referencia)

- `frontend/index.html`
- `frontend/src/assets/main.css`
- `frontend/src/components/BrandMark.vue`
- `frontend/src/components/NavBar.vue`
- `frontend/src/components/AppointmentCard.vue`
- `frontend/src/components/StatusFilter.vue`
- `frontend/src/views/HomeView.vue`
- `frontend/src/views/LoginView.vue`
- `frontend/src/views/RegisterView.vue`
- `frontend/src/views/DashboardPatient.vue`
- `frontend/src/views/DashboardDoctor.vue`
- `frontend/src/views/GuiaIAView.vue`
- `docs/linea-grafica.md`
- `README.md`
