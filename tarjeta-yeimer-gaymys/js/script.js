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
