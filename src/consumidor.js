const amqp = require("amqplib");
const {
  URL_CONEXION,
  NOMBRE_EXCHANGE,
  TIPO_EXCHANGE,
  NOMBRE_COLA,
  CLAVE_ENRUTAMIENTO,
} = require("./configuracion");

async function iniciarConsumidor() {
  const conexion = await amqp.connect(URL_CONEXION);
  const canal = await conexion.createChannel();

  await canal.assertExchange(NOMBRE_EXCHANGE, TIPO_EXCHANGE, { durable: true });
  await canal.assertQueue(NOMBRE_COLA, { durable: true });
  await canal.bindQueue(NOMBRE_COLA, NOMBRE_EXCHANGE, CLAVE_ENRUTAMIENTO);

  // Procesar un mensaje a la vez (para observar el flujo claramente)
  canal.prefetch(1);

  console.log("=== CONSUMIDOR INICIADO ===");
  console.log("Esperando mensajes... (Ctrl+C para detener)\n");

  canal.consume(NOMBRE_COLA, (mensaje) => {
    if (!mensaje) return;

    const contenido = JSON.parse(mensaje.content.toString());

    console.log(`[📨 Recibido]  ${contenido.texto}`);
    console.log(`   Enviado el: ${contenido.fechaEnvio}`);
    console.log(`   Procesado:  ${new Date().toISOString()}`);

    // ACK: confirmar al broker que el mensaje fue procesado
    canal.ack(mensaje);
    console.log("   ✔ ACK enviado\n");
  });
}

iniciarConsumidor().catch(console.error);
