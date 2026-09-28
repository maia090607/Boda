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

  var VELOCIDAD = 85; // píxeles por segundo
  var ESPERA_INICIO = 2.5; // segundos antes de empezar a bajar
  var ESPERA_FINAL = 2.5; // segundos quieto al llegar abajo
  var PAUSA_USUARIO = 7; // segundos de pausa tras tocar/deslizar
  var espera = ESPERA_INICIO;
  var regresando = false;
  var ultimaInteraccion = 0;
  var ultimoTiempo = null;

  ["wheel", "touchstart", "touchmove", "mousedown", "keydown"].forEach(function (ev) {
    window.addEventListener(ev, function () {
      ultimaInteraccion = Date.now();
    }, { passive: true });
  });

  function paso(tiempo) {
    if (ultimoTiempo === null) ultimoTiempo = tiempo;
    var dt = Math.min((tiempo - ultimoTiempo) / 1000, 0.1);
    ultimoTiempo = tiempo;

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
          window.scrollBy(0, VELOCIDAD * dt);
        }
      }
    }
    requestAnimationFrame(paso);
  }

  requestAnimationFrame(paso);
})();
