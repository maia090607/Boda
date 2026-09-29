// Fecha y hora de la ceremonia: 20 de noviembre de 2026, 7:30 p.m. (Valledupar, Colombia UTC-5)
const FECHA_BODA = new Date("2026-11-20T19:30:00-05:00");

function actualizarContador() {
  const ahora = new Date();
  const diferencia = FECHA_BODA - ahora;

  const el = {
    dias: document.getElementById("dias"),
    horas: document.getElementById("horas"),
    minutos: document.getElementById("minutos"),
    segundos: document.getElementById("segundos"),
  };
  if (!el.dias) return;

  if (diferencia <= 0) {
    el.dias.textContent = "00";
    el.horas.textContent = "00";
    el.minutos.textContent = "00";
    el.segundos.textContent = "00";
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
  const segundos = Math.floor((diferencia / 1000) % 60);

  el.dias.textContent = String(dias).padStart(2, "0");
  el.horas.textContent = String(horas).padStart(2, "0");
  el.minutos.textContent = String(minutos).padStart(2, "0");
  el.segundos.textContent = String(segundos).padStart(2, "0");
}

actualizarContador();
setInterval(actualizarContador, 1000);

// Animación de aparición al hacer scroll (igual al efecto del video de referencia)
const elementosRevelar = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada, i) => {
        if (entrada.isIntersecting) {
          setTimeout(() => entrada.target.classList.add("mostrar"), i % 6 * 80);
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  elementosRevelar.forEach((el) => observador.observe(el));
} else {
  elementosRevelar.forEach((el) => el.classList.add("mostrar"));
}

// Deslizamiento automático: la tarjeta baja sola, al llegar al final
// espera, vuelve arriba y repite. Si el invitado toca o desliza,
// se pausa unos segundos y luego continúa. No se activa si el usuario
// prefiere movimiento reducido.
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // El CSS de la página usa scroll suave, pero eso frena el avance
  // cuadro por cuadro: se fuerza scroll instantáneo y solo el regreso
  // arriba usa animación suave explícita.
  document.documentElement.style.scrollBehavior = "auto";

  var VELOCIDAD = 60; // píxeles por segundo (base cuando no hay música)
  var ESPERA_INICIO = 2.5; // segundos quieto al volver arriba en cada ciclo
  var ESPERA_FINAL = 2.5; // segundos quieto al llegar abajo
  var PAUSA_USUARIO = 7; // segundos de pausa tras tocar/deslizar
  var espera = 1.2; // primera bajada arranca rápido tras el primer toque
  var regresando = false;
  var ultimaInteraccion = 0;
  var ultimoTiempo = null;
  var velSuave = VELOCIDAD; // velocidad al ritmo de la música (suavizada)
  var iniciado = false; // la tarjeta empieza a moverse al primer toque
  var arranqueTiempo = 0; // ignora los eventos del toque que arranca

  ["wheel", "touchstart", "touchmove", "mousedown", "keydown"].forEach(function (ev) {
    window.addEventListener(ev, function () {
      // el mismo toque genera pointerdown+touchstart+click: no pausar por él
      if (Date.now() - arranqueTiempo < 800) return;
      ultimaInteraccion = Date.now();
    }, { passive: true });
  });

  // Primer toque: arranca el recorrido al instante, el contenido
  // empieza a subir de una vez (sin castigar con la pausa de 7s)
  function arrancar() {
    if (iniciado) return;
    iniciado = true;
    espera = 0;
    arranqueTiempo = Date.now();
    ultimaInteraccion = Date.now() - PAUSA_USUARIO * 1000 - 1000;
    ["pointerdown", "touchstart", "click", "keydown"].forEach(function (ev) {
      window.removeEventListener(ev, arrancar);
    });
  }
  ["pointerdown", "touchstart", "click", "keydown"].forEach(function (ev) {
    window.addEventListener(ev, arrancar, { passive: true });
  });

  function paso(tiempo) {
    if (ultimoTiempo === null) ultimoTiempo = tiempo;
    var dt = Math.min((tiempo - ultimoTiempo) / 1000, 0.1);
    ultimoTiempo = tiempo;

    if (!iniciado) {
      requestAnimationFrame(paso);
      return;
    }

    if (espera > 0) {
      espera -= dt;
    } else if (!regresando && Date.now() - ultimaInteraccion > PAUSA_USUARIO * 1000) {
      var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        if (window.scrollY + 2 >= maxScroll) {
          regresando = true;
          setTimeout(function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(function () {
              regresando = false;
              espera = ESPERA_INICIO;
            }, 1500);
          }, ESPERA_FINAL * 1000);
        } else {
          // Al ritmo de la música: la velocidad sigue la energía
          // de la canción (graves). Sin música, velocidad base.
          var energia = -1;
          if (window.__energiaMusica) {
            try { energia = window.__energiaMusica(); } catch (e) { energia = -1; }
          }
          var objetivo = (typeof energia === "number" && energia >= 0)
            ? (30 + energia * 100)
            : VELOCIDAD;
          velSuave += (objetivo - velSuave) * Math.min(1, dt * 3);
          window.scrollBy(0, velSuave * dt);
        }
      }
    }
    requestAnimationFrame(paso);
  }

  requestAnimationFrame(paso);
})();

// Música de fondo: suena en loop mientras baja la tarjeta
(function () {
  var audio = document.getElementById("musica");
  var btn = document.getElementById("btn-musica");
  if (!audio || !btn) return;
  audio.loop = true;
  audio.volume = 1;
  audio.preload = "auto";
  try { audio.load(); } catch (err0) {}
  // Si el toque llegó antes de que hubiera datos, reintentar en cuanto cargue
  var quiereSonar = false;
  function reproducir() {
    var r = null;
    try { r = audio.play(); } catch (errA) { return; }
    if (r && r.then) { r.then(sonar).catch(function () {}); }
    else { sonar(); }
  }
  audio.addEventListener("canplay", function () {
    if (quiereSonar && audio.paused) reproducir();
  });

  // Sin procesador de audio: el elemento suena directo a la salida,
  // así no se traba en ningún teléfono. Velocidad de scroll constante.
  window.__energiaMusica = function () { return -1; };

  function sonar() {
    btn.classList.add("sonando");
    btn.textContent = "♫";
  }
  function callar() {
    btn.classList.remove("sonando");
    btn.textContent = "♪";
  }
  // Tocar cualquier parte de la pantalla la enciende (una sola vez)
  function alTocar(e) {
    if (e && e.target && (e.target === btn || btn.contains(e.target))) return;
    quiereSonar = true;
    reproducir();
    window.removeEventListener("pointerdown", alTocar);
    window.removeEventListener("touchstart", alTocar);
    window.removeEventListener("click", alTocar);
    window.removeEventListener("keydown", alTocar);
  }
  window.addEventListener("pointerdown", alTocar, { passive: true });
  window.addEventListener("touchstart", alTocar, { passive: true });
  window.addEventListener("click", alTocar);
  window.addEventListener("keydown", alTocar);

  // Botón: si está sonando se para, si no está sonando se reproduce
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (audio.paused) {
      quiereSonar = true;
      reproducir();
    } else {
      quiereSonar = false;
      try { audio.pause(); } catch (err2) {}
      callar();
    }
  });

  // si el sistema la pausa al ocultar la pestaña, reanudar al volver
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && quiereSonar && audio.paused) reproducir();
  });
})();
