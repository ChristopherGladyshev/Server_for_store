const ProductService = require('../service/product-service');


class PostController {
  async getProduct(req, res, next) {
    try {
      const posts = await ProductService.getPosts();
      res.json(posts);
    } catch (error) {
      next(error)
    }
  }

  async getroduct(req, res, next) {
    const { id } = req.body;

    try {
      const post = await ProductService.getPost(id);
      res.json(post);
    } catch (error) {
      next(error)
    }
  }

  async createroduct(req, res, next) {
    const { title, description, post_text, author_id, email_author, images } = req.body;
    try {
      const post = await ProductService.createPost(
        title,
        description,
        post_text,
        author_id,
        email_author,
        images
      );
      res.json(post);
    } catch (error) {
      next(error)
    }
  }

  async deletePost() {

  }
}

module.exports = new PostController();
