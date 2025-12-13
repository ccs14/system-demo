import amqp from "amqplib";
import { info, warn, error, debug } from "../Logger/Logger.js";

const RABBIT_URL = "amqp://docker:docker@rabbitmq/";
const QUEUE_NAME = "reddit_queue";

// https://www.rabbitmq.com/tutorials/tutorial-one-javascript
export const sendMessage = async (message) => {
  try {
    debug("connecting to rabbitmq")
    const connection = await amqp.connect(RABBIT_URL);
    debug("connected to rabbitmq")

    debug("creating channel")
    const channel = await connection.createChannel();
    debug("channel created")


    connection.on("open", () => console.log("connection opened"));
    connection.on("close", () => console.log("connection closed"));
    connection.on("error", (e) =>
      error("connection error:", e.message)
    );

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    let data = "";
    if (typeof message === "string") {
      data = message;
    } else {
      data = JSON.stringify(message);
    }

    channel.sendToQueue(QUEUE_NAME, Buffer.from(data), { persistent: true });
    info("🚀 ~ sendMessage ~ Sent message to queue:", message)

    await channel.close();
    await connection.close();
  } catch (e) {
    error(e.message);
  }
};
