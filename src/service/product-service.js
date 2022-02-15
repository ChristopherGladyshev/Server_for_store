const ProductModel = require('../models/product-model');
const UserModel = require('../models/user-model');
const ApiError = require('../exceptions/api-error');

class PostService {

  async createProduct(title, description, prise, product_text, author_id, images) {

    const author = await UserModel.findById(author_id);
    if (!author) throw ApiError.BadRequest(`Пользователь с id ${author_id} не существует`);

    const product = await ProductModel.create({
      title,
      description,
      prise,
      product_text,
      author: author_id,
      images
    })
    return { success: true, product }
  }

  async searchProduct(id) {
    const product = await ProductModel.findById(id);
    if (!product) throw ApiError.BadRequest(`Продукт ${id} удален или еще не был создан`);
    return product;
  }

  async getProducts() {
    const products = await ProductModel.find().populate('author', ['email', 'family_name', 'first_name']);
    return products;
  }
}

module.exports = new PostService;
