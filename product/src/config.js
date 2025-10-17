require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3001,
  mongoURI: process.env.MONGODB_PRODUCT_URI ,
  rabbitMQURI: process.env.RABBITMQ_URI,
  queueNameOrder: process.env.QUEUE_NAME_ORDER,
  queueNameProduct: process.env.QUEUE_NAME_PRODUCT,
};
