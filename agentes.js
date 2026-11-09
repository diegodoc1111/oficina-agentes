/*
  Datos de la Oficina de Agentes.
  Para actualizar un estado, cambia el campo "estado" de cada agente por uno de:
  "trabajando", "esperando", "pausa", "pensando", "revisando".
  Las posiciones (zona) están en porcentaje sobre la imagen oficina.jpg:
  x, y = esquina superior izquierda; w, h = ancho y alto.
*/
window.OFICINA = {
  titulo: "Oficina de Agentes · Diego Osorio",
  estados: {
    trabajando: { emoji: "⌨️", texto: "trabajando",        color: "#3ddc84", activo: true },
    pensando:   { emoji: "🧠", texto: "pensando ideas",    color: "#b388ff", activo: true },
    revisando:  { emoji: "📊", texto: "revisando datos",   color: "#40c4ff", activo: true },
    esperando:  { emoji: "💬", texto: "esperando a Diego", color: "#ffd740", activo: false },
    pausa:      { emoji: "☕", texto: "en pausa",          color: "#ff8a65", activo: false }
  },
  agentes: [
    { id: "grok", nombre: "Grok Bot", rol: "Líder del equipo", lider: true,
      hace: "Coordina a todo el equipo de agentes. Es el único que envía mensajes de WhatsApp, y solo con la aprobación de Diego.",
      reporta: "Diego Osorio", estado: "trabajando",
      zona: { x: 33.9, y: 5.9, w: 32.1, h: 20.0 } },
    { id: "lider-trafico", nombre: "Líder de Tráfico", rol: "Trafficker senior de la agencia",
      hace: "Supervisa las cuentas de Meta Ads y Google Ads de los clientes de la agencia.",
      reporta: "Grok Bot", estado: "revisando",
      zona: { x: 7.8, y: 13.2, w: 25.2, h: 12.8 } },
    { id: "francia", nombre: "Cliente Francia", rol: "Cuenta de cliente",
      hace: "Lleva la cuenta de Francia Salazar Estética (Dosquebradas / Pereira).",
      reporta: "Líder de Tráfico", estado: "trabajando",
      zona: { x: 66.8, y: 13.2, w: 26.9, h: 13.0 } },
    { id: "cursos-ia", nombre: "Tráfico Cursos IA", rol: "Tráfico de la cuenta propia",
      hace: "Maneja el tráfico de la cuenta propia de Diego, que vende sus cursos de IA.",
      reporta: "Grok Bot", estado: "trabajando",
      zona: { x: 4.3, y: 26.2, w: 27.8, h: 13.9 } },
    { id: "dr-pablo", nombre: "Cliente Dr. Pablo", rol: "Cuenta de cliente",
      hace: "Lleva la cuenta del Dr. Pablo (Quito, tratamiento Emsella).",
      reporta: "Líder de Tráfico", estado: "esperando",
      zona: { x: 67.7, y: 26.4, w: 26.9, h: 13.7 } },
    { id: "ideas", nombre: "Ideas de Contenido", rol: "Estratega de contenido",
      hace: "Propone ideas para los reels de Instagram de Diego.",
      reporta: "Grok Bot", estado: "pensando",
      zona: { x: 6.9, y: 40.0, w: 26.9, h: 13.2 } },
    { id: "comfort", nombre: "Cliente Comfort", rol: "Cuenta de cliente",
      hace: "Lleva la cuenta de Clínica Comfort (Ciudad de México), en fase de rescate.",
      reporta: "Líder de Tráfico", estado: "revisando",
      zona: { x: 68.6, y: 39.3, w: 28.6, h: 11.0 } },
    { id: "historietas", nombre: "Historietas", rol: "Ilustrador",
      hace: "Crea imágenes estilo cómic, manga, webtoon y caricatura.",
      reporta: "Grok Bot", estado: "pausa",
      zona: { x: 17.4, y: 52.7, w: 28.6, h: 17.1 } },
    { id: "creador-videos", nombre: "Creador de Videos IA", rol: "Productor de video",
      hace: "Genera videos con IA y clones de Diego.",
      reporta: "Grok Bot", estado: "trabajando",
      zona: { x: 55.6, y: 50.6, w: 28.6, h: 11.5 } },
    { id: "anuncios", nombre: "Anuncios Animados", rol: "Animador",
      hace: "Produce anuncios animados verticales con Remotion.",
      reporta: "Grok Bot", estado: "trabajando",
      zona: { x: 59.0, y: 62.3, w: 28.6, h: 14.4 } },
    { id: "manychat", nombre: "Recursos ManyChat", rol: "Automatizaciones",
      hace: "Arma automatizaciones de palabra clave en ManyChat para entregar recursos.",
      reporta: "Grok Bot", estado: "esperando",
      zona: { x: 0.9, y: 79.3, w: 26.9, h: 17.4 } },
    { id: "descargas", nombre: "Descargas de Videos", rol: "Descargas",
      hace: "Descarga videos de TikTok, Instagram y YouTube.",
      reporta: "Grok Bot", estado: "trabajando",
      zona: { x: 33.0, y: 82.3, w: 28.6, h: 16.3 } },
    { id: "motivacion", nombre: "Motivación", rol: "Coach nocturno",
      hace: "Manda un mensaje motivacional cada noche a las 9 p. m.",
      reporta: "Grok Bot", estado: "pausa",
      zona: { x: 69.4, y: 79.9, w: 27.8, h: 17.8 } }
  ]
};
