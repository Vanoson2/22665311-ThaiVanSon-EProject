const Product = require("../models/product");

/**
 * Class that contains the business logic for the product repository interacting with the product model
 */
class ProductsRepository {
  async create(product) {
    const createdProduct = await Product.create(product);
    return createdProduct.toObject();
  }

  async findById(productId) {
    const product = await Product.findById(productId).lean();
    return product;
  }

  async findByName(name) {
    console.log("Searching for product with name:", JSON.stringify(name));
    const product = await Product.findOne({ name: name }).lean();
    console.log("Search result:", product);
    return product;
  }

  async findAll() {
    // Only return products with inventory > 0
    const products = await Product.find({ inventory: { $gt: 0 } }).lean();
    return products;
  }

  async findByIds(productIds) {
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    return products;
  }

  async decreaseInventory(productId, quantity) {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { inventory: -quantity } },
      { new: true }
    );
    return product;
  }

  async updateInventory(productId, newInventory) {
    const product = await Product.findByIdAndUpdate(
      productId,
      { inventory: newInventory },
      { new: true }
    );
    return product;
  }

  async increaseInventory(productId, quantity) {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { inventory: quantity } },
      { new: true }
    );
    return product ? product.toObject() : null;
  }
}

module.exports = ProductsRepository;
