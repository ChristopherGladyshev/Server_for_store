const ProductService = require('../service/product-service');


class PostController {
  async getProducts(req, res, next) {
    try {
      const products = await ProductService.getProducts();
      res.json(products);
    } catch (error) {
      next(error)
    }
  }

  async getProduct(req, res, next) {
    const id  = req.query.id;
    try {
      const product = await ProductService.searchProduct(id);
      res.json(product);
    } catch (error) {
      next(error)
    }
  }

  async createProduct(req, res, next) {
    const { title, description, prise, product_text, author_id, images } = req.body;
    try {
      const product = await ProductService.createProduct(
        title,
        description,
        prise,
        product_text,
        author_id,
        images
      );
      res.json(product);
    } catch (error) {
      next(error)
    }
  }

  async deleteProduct() {

  }
}

module.exports = new PostController();
