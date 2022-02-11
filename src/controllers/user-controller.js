const userService = require('../service/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
const productModel = require('../models/product-model');

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка валидации', errors.array()));

      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');

      return res.json(token);
    } catch (error) {
      next(error)
    }
  }

  async activate(req, res, next) {
    try {
      const activation_link = req.params.link;
      await userService.activate(activation_link);
      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      return res.json(userData)

    } catch (error) {

    }
  }

  async getUser(req, res, next) {
    const id = await req.query.id;
    try {
      const user = await userService.getUser(id);
      const posts = await productModel.find({ 'author': id });

      user.posts = posts;
      res.json(user);
    } catch (error) {
      next(error)
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users)
    } catch (error) {
      next(error)
    }
  }

  async updateUser(req, res, next) {
    const { first_name, family_name, age, id } = req.body;
    try {
      const user = await userService.updateUserProfile(first_name, family_name, age, id);
      res.json(user);
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new UserController;
