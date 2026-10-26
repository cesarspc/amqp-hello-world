const CONFIGURACION = {
  URL_CONEXION: "amqp://admin:admin@localhost:5672",
  NOMBRE_EXCHANGE: "intercambiador_saludos",
  TIPO_EXCHANGE: "direct",
  NOMBRE_COLA: "cola_saludos",
  CLAVE_ENRUTAMIENTO: "saludo",
};

module.exports = CONFIGURACION;
