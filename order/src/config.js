require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGODB_ORDER_URI,
    rabbitMQURI: process.env.RABBITMQ_URI,
    queueNameOrder: process.env.QUEUE_NAME_ORDER,
    queueNameProduct: process.env.QUEUE_NAME_PRODUCT,
    port: process.env.PORT
};
  