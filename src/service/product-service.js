const ProductModel = require('../models/product-model');
const UserModel = require('../models/user-model');
const ApiError = require('../exceptions/api-error');

class PostService {

  async createPost(title, description, post_text, author_id, email_author, images) {

    const author = await UserModel.findById(author_id);
    if (!author) throw ApiError.BadRequest(`Пользователь с id ${author_id} не существует`);

    const post = await ProductModel.create({
      title,
      description,
      post_text,
      author: author_id,
      email_author,
      images
    })
    return { success: true, post }
  }

  async searchPost(id) {
    const post = await ProductModel.findById(id);
    if (!post) throw ApiError.BadRequest(`Пост ${id} удален или еще не был создан`);
    return post;
  }

  async getPosts() {
    const posts = await ProductModel.find().populate('author', ['email', 'family_name', 'first_name' ]);
    return posts;
  }


}

module.exports = new PostService;
