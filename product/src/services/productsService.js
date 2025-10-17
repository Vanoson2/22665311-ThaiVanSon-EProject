const ProductsRepository = require("../repositories/productsRepository");

/**
 * Class that ties together the business logic and the data access layer
 */
class ProductsService {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  async createProduct(product) {
    // Check if product with same name already exists
    const existingProduct = await this.productsRepository.findByName(product.name);
    
    console.log("Checking product name:", product.name);
    console.log("Existing product found:", existingProduct);
    
    if (existingProduct) {
      // Product exists -> Increase inventory
      console.log(`Product "${product.name}" already exists with ID: ${existingProduct._id}`);
      console.log(`Current inventory: ${existingProduct.inventory}, Adding: ${product.inventory}`);
      
      const updatedProduct = await this.productsRepository.increaseInventory(
        existingProduct._id.toString(), 
        product.inventory || 0
      );
      
      console.log(`Updated product:`, updatedProduct);
      return updatedProduct;
    } else {
      // Product doesn't exist -> Create new
      console.log(`Creating new product: "${product.name}"`);
      const createdProduct = await this.productsRepository.create(product);
      return createdProduct;
    }
  }

  async getProductById(productId) {
    const product = await this.productsRepository.findById(productId);
    return product;
  }

  async getProducts() {
    const products = await this.productsRepository.findAll();
    return products;
  }

  async getProductsByIds(productIds) {
    const products = await this.productsRepository.findByIds(productIds);
    return products;
  }

  async decreaseInventory(productId, quantity) {
    const product = await this.productsRepository.decreaseInventory(productId, quantity);
    return product;
  }

  async decreaseMultipleInventories(items) {
    const updates = [];
    for (const item of items) {
      const update = await this.productsRepository.decreaseInventory(item.productId, item.quantity);
      updates.push(update);
    }
    return updates;
  }
}

module.exports = ProductsService;
