# AMQP Hello World — RabbitMQ + Node.js

Proyecto demostrativo del estilo arquitectural **AMQP** con un productor, un intercambiador (exchange), una cola y un consumidor con confirmación (ACK).

## Arquitectura

```
┌────────────┐    ┌──────────────────────┐    ┌───────────────┐    ┌──────────────┐
│  Productor │───▶│  Exchange (direct)   │───▶│  Cola durable │───▶│  Consumidor  │
│            │    │ intercambiador_saludos│    │ cola_saludos  │    │   + ACK      │
└────────────┘    └──────────────────────┘    └───────────────┘    └──────────────┘
```

## Requisitos

- Docker y Docker Compose
- Node.js (v18+)

## Instrucciones

### 1. Levantar RabbitMQ

```bash
docker compose up -d
```

El panel de administración estará disponible en **http://localhost:15672**
- Usuario: `admin`
- Contraseña: `admin`

### 2. Instalar dependencias

```bash
npm install
```

### 3. Demostración: ¿Qué pasa cuando el consumidor está apagado?

Abre **dos terminales** y sigue este orden:

**Terminal 1 — Iniciar solo el productor:**

```bash
npm run productor
```

> Los mensajes se envían cada 3 segundos. Como el consumidor no está activo, los mensajes se **acumulan en la cola**. Puedes verificarlo en el panel de RabbitMQ (pestaña Queues → `cola_saludos`).

**Espera ~15 segundos** para que se acumulen varios mensajes.

**Terminal 2 — Iniciar el consumidor:**

```bash
npm run consumidor
```

> El consumidor recibirá **todos los mensajes acumulados** de golpe. Nota la diferencia entre la fecha de envío y la de procesamiento: demuestra que los mensajes esperaron en la cola.

### 4. Detener

```bash
# Ctrl+C en cada terminal para detener productor/consumidor
docker compose down
```

## Conceptos clave demostrados

| Concepto | Qué se demuestra |
|---|---|
| **Exchange (intercambiador)** | Recibe mensajes del productor y los enruta a la cola según la clave de enrutamiento |
| **Cola durable** | Los mensajes persisten aunque no haya consumidor conectado |
| **Mensajes persistentes** | `persistent: true` asegura que sobrevivan reinicios del broker |
| **ACK (confirmación)** | El consumidor confirma manualmente cada mensaje procesado |
| **Desacoplamiento** | Productor y consumidor no se conocen; la cola actúa como buffer |
