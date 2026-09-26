# Tarjeta virtual · Yeimer & Gaymys

Invitación de boda en formato de página web, construida con la misma
estructura y animaciones del video de referencia que compartiste (mismo
orden de secciones, mismos efectos, mismos íconos), con el contenido de
Yeimer y Gaymys.

## Estructura de carpetas

```
tarjeta-yeimer-gaymys/
├── index.html          ← la tarjeta (toda la página, 8 secciones)
├── css/
│   └── style.css       ← estilos (colores, tipografía, animaciones)
├── js/
│   └── script.js        ← contador regresivo + animaciones al hacer scroll
├── fotos/
│   ├── LEEME.txt        ← guía de qué foto va en cada lugar
│   ├── foto1.jpg        ← (agrégalas tú, ver fotos/LEEME.txt)
│   ├── foto2.jpg
│   ├── foto3.jpg
│   ├── foto5.jpg
│   ├── foto6.jpg
│   ├── foto7.jpg
│   ├── foto8.jpg
│   ├── foto9.jpg
│   ├── foto10.jpg
│   └── foto11.jpg
└── README.md            ← este archivo
```

## Secciones (en este orden, igual que el video)

1. **Portada** — foto de fondo, nombres, fecha, contador regresivo, flecha
   "Desliza Arriba"
2. **¡Nos Casamos!** — mensaje en fuente cursiva + foto con borde dentado
3. **Itinerario** — línea de tiempo con íconos (Iglesia, ¡Sí quiero!,
   Instantes eternos, Cóctel, Comida, Fiesta)
4. **Nuestro Amor** — collage de 6 fotos en 2 columnas
5. **Cita bíblica** — 1 Juan 4:16, fondo rosado con bordes ondulados
6. **Nuestra Fiesta** — Dress Code, Música (botón para agregar canciones),
   Lluvia de Sobres
7. **Comparte las fotos de la Boda** — foto de fondo + hashtag
8. **Recomendaciones** — "Niños: Dulces Sueños" (fiesta solo para adultos)

## Cómo agregar las fotos

Abre `fotos/LEEME.txt`: ahí está la lista exacta de qué número de foto va en
cada sección. Solo copia tus fotos a la carpeta `fotos/` con esos nombres
(`foto1.jpg`, `foto2.jpg`...) y el código las toma automáticamente. No hay
que tocar el HTML ni el CSS para eso.

Mientras no pongas una foto, esa sección se ve con un marco decorativo en
tonos beige y dorado, así que puedes revisar o compartir la tarjeta desde ya
y actualizar las fotos después.

## Cómo verla

**Opción rápida (solo para ti):** haz doble clic en `index.html` y se abre
en tu navegador.

**Para compartir con los invitados**, sube toda la carpeta a un hosting
gratuito, por ejemplo:
- **Netlify Drop** (netlify.com/drop): arrastras la carpeta completa y te da
  un link al instante.
- **GitHub Pages**: si usas GitHub, subes la carpeta a un repositorio y
  activas Pages.
- Cualquier hosting compartido normal (subes la carpeta por FTP).

No necesitas configurar nada especial: son solo archivos HTML/CSS/JS y las
fotos.

## Pendientes que puedes completar más adelante

- **Itinerario**: solo dejé confirmada la hora de la ceremonia (7:00 PM).
  Las demás horas (¡Sí quiero!, cóctel, comida, fiesta) están marcadas
  "Por confirmar" porque el PDF original decía que faltaba validar minuto a
  minuto con la wedding planner. Para completarlas, busca en `index.html`
  la sección `<!-- 3. ITINERARIO -->` y reemplaza cada "Por confirmar" por
  la hora real (ej: `<strong>8:00 PM</strong>`).
- **Recepción**: falta la ubicación exacta de Casa Campo Villa María —
  puedes agregarla donde quieras dentro de la sección de Itinerario.
- **Hashtag**: puse `#YeimerYGaymys` en la sección "Comparte las fotos de la
  Boda" — cámbialo si ya tienen uno definido (búscalo en `index.html`,
  sección `<!-- 7. COMPARTE LAS FOTOS -->`).
- **Playlist Music**: el botón dorado "Playlist Music" todavía no tiene
  enlace real (`href="#"`). Cuando tengas un formulario o link de Spotify
  para que los invitados agreguen canciones, reemplaza el `#` por ese link
  en `index.html`, sección `<!-- 6. NUESTRA FIESTA -->`.

## Lo que no se replicó

El cierre del video original con el logo "Boutique" y la promoción de la
cuenta de TikTok del creador no se incluyó, porque es la marca/publicidad
de quien hizo ese video, no contenido de la invitación en sí.
