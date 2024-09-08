import express from "express"
import amqp from "amqplib"
import actionsController from "./constrollers/actions.controller.js";
import historyRouter from './service/history.service.js'
async function consumeMessages() {
  try {
    const connection = await amqp.connect("amqp://rabbitmq");
    const channel = await connection.createChannel();

    await channel.assertExchange("shop", "direct", { durable: true });
    const { queue } = await channel.assertQueue("History queue", { durable: true });

    await channel.bindQueue(queue, "shop", "create order");
    await channel.bindQueue(queue, "shop", "increase in stock");
    await channel.bindQueue(queue, "shop", "decrease in stock");
    await channel.bindQueue(queue, "shop", "create shelfs");
    await channel.bindQueue(queue, "shop", "update shelfs");

    console.log("Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log("Received message:", data);

        switch (msg.fields.routingKey) {
          case 'create order':
            actionsController.createOrder(data.message);
            break;
          case 'create shelfs':
            actionsController.createShelfs(data.message);
            break;
          case 'update shelfs':
            actionsController.updateShelfs(data.message);
            break;
          case 'increase in stock':
            actionsController.increaseInStock(data.message);
            break;
          case 'decrease in stock':
            actionsController.decreaseInStock(data.message);
            break;
          default:
            console.error("Unknown routing key:", msg.fields.routingKey);
            break;
        }

        channel.ack(msg);
      }
    });

  } catch (error) {
    console.error("Error in consumeMessages:", error);
  }
}

consumeMessages();
const PORT = process.env.PORT || 5010;

const app = express()

app.use(express.json())

app.use('', historyRouter)
app.listen(PORT, () => console.log(`server starting on port:` + PORT))