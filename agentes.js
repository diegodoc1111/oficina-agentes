/*
  Datos de la Oficina de Agentes.
  Para actualizar un estado, cambia el campo "estado" de cada agente por uno de:
  "trabajando", "esperando", "pausa", "pensando", "revisando".
  Las posiciones (zona) están en porcentaje sobre la imagen oficina.jpg (horizontal 16:9):
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
    { id: "grok", nombre: "Don Roberto Mendoza · Grok Bot", rol: "Líder del equipo", lider: true,
      hace: "Coordina a todo el equipo de agentes. Es el único que envía mensajes de WhatsApp, y solo con la aprobación de Diego.",
      reporta: "Diego Osorio", estado: "trabajando",
      zona: { x: 40.5, y: 5.2, w: 17.9, h: 33.0 } },
    { id: "lider-trafico", nombre: "Betty · Líder de Tráfico", rol: "Trafficker senior de la agencia",
      hace: "Supervisa las cuentas de Meta Ads y Google Ads de los clientes de la agencia.",
      reporta: "Don Roberto Mendoza · Grok Bot", estado: "revisando",
      zona: { x: 8.3, y: 14.8, w: 13.7, h: 25.2 } },
    { id: "francia", nombre: "Cliente Francia", rol: "Cuenta de cliente",
      hace: "Lleva la cuenta de Francia Salazar Estética (Dosquebradas / Pereira).",
      reporta: "Betty · Líder de Tráfico", estado: "trabajando",
      zona: { x: 6.8, y: 40.5, w: 14.2, h: 26.4 } },
    { id: "cursos-ia", nombre: "Mario Calderón · Tráfico Cursos IA", rol: "Tráfico de la cuenta propia",
      hace: "Maneja el tráfico de la cuenta propia de Diego, que vende sus cursos de IA.",
      reporta: "Don Roberto Mendoza · Grok Bot", estado: "trabajando",
      zona: { x: 24.9, y: 14.8, w: 13.4, h: 25.2 } },
    { id: "dr-pablo", nombre: "Cliente Dr. Pablo", rol: "Cuenta de cliente",
      hace: "Lleva la cuenta del Dr. Pablo (Quito, tratamiento Emsella).",
      reporta: "Betty · Líder de Tráfico", estado: "esperando",
      zona: { x: 24.4, y: 40.5, w: 13.5, h: 26.4 } },
    { id: "ideas", nombre: "Don Armando · Ideas de Contenido", rol: "Estratega de contenido",
      hace: "Propone ideas para los reels de Instagram de Diego.",
      reporta: "Don Roberto Mendoza · Grok Bot", estado: "pensando",
      zona: { x: 60.7, y: 14.8, w: 13.5, h: 25.2 } },
    { id: "comfort", nombre: "Cliente Comfort", rol: "Cuenta de cliente",
      hace: "Lleva la cuenta de Clínica Comfort (Ciudad de México), en fase de rescate.",
      reporta: "Betty · Líder de Tráfico", estado: "revisando",
      zona: { x: 7.8, y: 67.4, w: 12.7, h: 28.5 } },
    { id: "historietas", nombre: "Hugo Lombardi · Historietas", rol: "Ilustrador",
      hace: "Crea imágenes estilo cómic, manga, webtoon y caricatura.",
      reporta: "Don Roberto Mendoza · Grok Bot", estado: "pausa",
      zona: { x: 76.7, y: 14.8, w: 13.7, h: 25.2 } },
    { id: "creador-videos", nombre: "Patricia · Creador de Videos IA", rol: "Productor de video",
      hace: "Genera videos con IA y clones de Diego.",
      reporta: "Don Roberto Mendoza · Grok Bot", estado: "trabajando",
      zona: { x: 61.0, y: 40.5, w: 13.7, h: 26.4 } },
    { id: "anuncios", nombre: "Marcela Valencia · Anuncios Animados", rol: "Animador",
      hace: "Produce anuncios animados verticales con Remotion.",
      reporta: "Don Roberto Mendoza · Grok Bot", estado: "trabajando",
      zona: { x: 78.1, y: 40.5, w: 14.2, h: 26.4 } },
    { id: "manychat", nombre: "Aura María · Recursos ManyChat", rol: "Automatizaciones",
      hace: "Arma automatizaciones de palabra clave en ManyChat para entregar recursos.",
      reporta: "Don Roberto Mendoza · Grok Bot", estado: "esperando",
      zona: { x: 23.4, y: 67.4, w: 13.5, h: 28.5 } },
    { id: "descargas", nombre: "Wilson · Descargas de Videos", rol: "Descargas",
      hace: "Descarga videos de TikTok, Instagram y YouTube.",
      reporta: "Don Roberto Mendoza · Grok Bot", estado: "trabajando",
      zona: { x: 61.7, y: 67.4, w: 13.7, h: 28.5 } },
    { id: "motivacion", nombre: "Freddy · Motivación", rol: "Coach nocturno",
      hace: "Manda un mensaje motivacional cada noche a las 9 p. m.",
      reporta: "Don Roberto Mendoza · Grok Bot", estado: "pausa",
      zona: { x: 78.6, y: 67.4, w: 14.0, h: 28.5 } }
  ]
};
