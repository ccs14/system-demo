import amqp from "amqplib";

const RABBIT_URL = "amqp://docker:docker@rabbitmq/";
const QUEUE_NAME = "reddit_queue";

// https://www.rabbitmq.com/tutorials/tutorial-one-javascript
export const sendMessage = async (message) => {
  try {
    const connection = await amqp.connect(RABBIT_URL);
    const channel = await connection.createChannel();
    
    connection.on("open", () => console.log("connection opened"));
    connection.on("close", () => console.log("connection closed"));
    connection.on("error", (e) =>
      console.error("connection error:", e.message)
    );

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    let data = "";
    if (typeof message === "string") {
      data = message;
    } else {
      data = JSON.stringify(message);
    }

    channel.sendToQueue(QUEUE_NAME, Buffer.from(data), { persistent: true });
    console.log("🚀 ~ sendMessage ~ Sent message to queue:", message)

    await channel.close();
    await connection.close();
  } catch (err) {
    console.error(err.message);
  }
};
