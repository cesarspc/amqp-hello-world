const amqp = require("amqplib");
const {
  URL_CONEXION,
  NOMBRE_EXCHANGE,
  TIPO_EXCHANGE,
  NOMBRE_COLA,
  CLAVE_ENRUTAMIENTO,
} = require("./configuracion");

async function iniciarProductor() {
  const conexion = await amqp.connect(URL_CONEXION);
  const canal = await conexion.createChannel();

  // Declarar el intercambiador y la cola, y vincularlos
  await canal.assertExchange(NOMBRE_EXCHANGE, TIPO_EXCHANGE, { durable: true });
  await canal.assertQueue(NOMBRE_COLA, { durable: true });
  await canal.bindQueue(NOMBRE_COLA, NOMBRE_EXCHANGE, CLAVE_ENRUTAMIENTO);

  console.log("=== PRODUCTOR INICIADO ===\n");

  let contador = 1;

  setInterval(() => {
    const mensaje = {
      texto: `¡Hola Mundo! #${contador}`,
      fechaEnvio: new Date().toISOString(),
    };

    const contenido = Buffer.from(JSON.stringify(mensaje));

    canal.publish(NOMBRE_EXCHANGE, CLAVE_ENRUTAMIENTO, contenido, {
      persistent: true, // El mensaje sobrevive reinicios de RabbitMQ
    });

    console.log(`[✉ Enviado] ${mensaje.texto}  →  ${mensaje.fechaEnvio}`);
    contador++;
  }, 3000);
}

iniciarProductor().catch(console.error);
