const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tockenService = require('./tocken-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const userModel = require('../models/user-model');

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({
      email
    })

    if (candidate) throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);

    const hashPassword = await bcrypt.hash(password, 3);
    const activation_link = uuid.v4();
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activation_link: activation_link,
    });

    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activation_link}`);

    const userDto = new UserDto(user);
    const tocens = tockenService.generateTokens({ ...userDto });
    await tockenService.saveToken(userDto.id, tocens.refreshToken);

    return { ...tocens, user: userDto }
  }

  async activate(activation_link) {
    const user = await UserModel.findOne({ activation_link });

    if (!user) throw ApiError.BadRequest('Неккоректная ссылка активации');

    user.is_activated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) throw ApiError.BadRequest('Пользователь с таким email небыл найден');

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) throw ApiError.BadRequest('Неверный пароль');

    const userDto = new UserDto(user);
    const tokens = tockenService.generateTokens({ ...userDto });

    await tockenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto }
  }

  async logout(refreshToken) {
    const token = await tockenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw ApiError.UnauthorizedError();

    const userData = tockenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tockenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) throw ApiError.UnauthorizedError();

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tockenService.generateTokens({ ...userDto });

    await tockenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto }
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }

  async getUser(id){
    if (!id) throw ApiError.BadRequest('Укажите id пользователя');
    const user = await userModel.findById(id);
    return user;
  }

  async updateUserProfile(first_name, family_name, age, id) {
    if (!id) throw ApiError.BadRequest('')
    console.log(UserModel.findById({ _id: id }));

    const user = await UserModel.findByIdAndUpdate(id, {
      $set: {
        first_name,
        family_name,
        age,
        update: new Date().toLocaleString('de-RU'),
      }
    },
      {
        new: true,
        useFindAndModify: false
      });

    return user
  }
}


module.exports = new UserService;
