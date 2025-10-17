const amqp = require("amqplib");
const config = require("../config");

class MessageBroker {
  constructor() {
    this.channel = null;
    this.connection = null;
  }

  async connect() {
    try {
      console.log("Connecting to RabbitMQ...");
      this.connection = await amqp.connect(config.rabbitMQURI);
      this.channel = await this.connection.createChannel();

      // Declare both queues
      await this.channel.assertQueue(config.queueNameOrder, { durable: true });
      await this.channel.assertQueue(config.queueNameProduct, { durable: true });
      
      console.log("RabbitMQ connected successfully");
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", error);
    }
  }

  async publishMessage(queue, message) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }
    try {
      await this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );
      console.log(`Message sent to queue ${queue}:`, message);
    } catch (err) {
      console.error("Failed to publish message:", err);
    }
  }

  async consumeOrderMessages(callback) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }
    
    try {
      console.log(`Starting to consume messages from ${config.queueNameOrder}`);
      
      this.channel.consume(config.queueNameOrder, async (message) => {
        if (message) {
          try {
            const orderData = JSON.parse(message.content.toString());
            console.log("Received order message:", orderData);
            
            // Call the callback function to process the order
            await callback(orderData);
            
            // Acknowledge the message
            this.channel.ack(message);
          } catch (error) {
            console.error("Error processing order message:", error);
            // Reject the message and don't requeue it
            this.channel.reject(message, false);
          }
        }
      });
    } catch (err) {
      console.error("Failed to consume messages:", err);
    }
  }

  async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log("RabbitMQ connection closed");
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
    }
  }
}

module.exports = new MessageBroker();
