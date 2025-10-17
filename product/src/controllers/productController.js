const ProductsService = require("../services/productsService");

/**
 * Class to hold the API implementation for the product services
 */
class ProductController {

  constructor() {
    this.productsService = new ProductsService();
    this.createProduct = this.createProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);
  }

  async createProduct(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Validate required fields
      const { name, price, inventory } = req.body;
      if (!name || !price || inventory === undefined) {
        return res.status(400).json({ message: "Name, price, and inventory are required" });
      }

      // Use ProductsService to create or update product
      const product = await this.productsService.createProduct(req.body);

      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getProducts(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Use ProductsService to get products (with inventory > 0 filter)
      const products = await this.productsService.getProducts();

      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = ProductController;
