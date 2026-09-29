// GET /api/acceso?t=TOKEN
// Control de reenvíos: cuenta dispositivos por link y dice si ya se
// llegó al tope. NUNCA bloquea la vista: siempre responde 200 y el
// front decide si muestra la cinta "Esta tarjeta es solo para ti".
// Requiere binding KV: INVITACIONES (una por cada proyecto Pages).
// Claves: "t:<TOKEN>" -> {"cupos":1|2|4,"tope":2,"dispositivos":[]}

function json(data, did, status) {
  var h = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  if (did) h["Set-Cookie"] = "did=" + did + "; Max-Age=31536000; Path=/; SameSite=Lax; Secure";
  return new Response(JSON.stringify(data), { status: status || 200, headers: h });
}

function nuevoDid() {
  var a = new Uint8Array(12);
  crypto.getRandomValues(a);
  var s = "";
  for (var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function onRequestGet(context) {
  var url = new URL(context.request.url);
  var t = (url.searchParams.get("t") || "").trim();

  // Token inválido: el front usa su lógica normal (por dominio/query).
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(t)) return json({ ok: false });

  // Sin KV enlazado: no romper la tarjeta, solo no controlar.
  if (!context.env || !context.env.INVITACIONES) return json({ ok: false });

  var key = "t:" + t;
  var raw;
  try {
    raw = await context.env.INVITACIONES.get(key);
  } catch (e) {
    return json({ ok: false });
  }
  if (!raw) return json({ ok: false });

  var data;
  try {
    data = JSON.parse(raw);
  } catch (e2) {
    return json({ ok: false });
  }
  if (!data || (data.cupos !== 1 && data.cupos !== 2 && data.cupos !== 4)) {
    return json({ ok: false });
  }

  // Dispositivo: cookie did (best-effort, incógnito cuenta como nuevo).
  var did = null;
  try {
    var cookie = context.request.headers.get("Cookie") || "";
    var m = cookie.match(/(?:^|;\s*)did=([A-Za-z0-9_-]{8,64})/);
    if (m) did = m[1];
  } catch (e3) {}
  var setCookie = false;
  if (!did) {
    did = nuevoDid();
    setCookie = true;
  }

  var devs = Array.isArray(data.dispositivos) ? data.dispositivos : [];
  if (devs.indexOf(did) === -1) {
    devs.push(did);
    data.dispositivos = devs.slice(-10); // guarda los últimos 10
    try {
      await context.env.INVITACIONES.put(key, JSON.stringify(data));
    } catch (e4) {}
  }

  // El primer dispositivo no ve aviso; del segundo en adelante sí.
  var aviso = devs.length > 0 && devs[0] !== did;

  return json({ ok: true, cupos: String(data.cupos), aviso: aviso }, setCookie ? did : null);
}
