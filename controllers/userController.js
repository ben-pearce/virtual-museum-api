const bcrypt = require('bcrypt');

const UserSerializer = require('../serializers/userSerializer');

const APIError = require('jsonapi-serializer').Error;

class UserController {

  static async handleUserAuthentication(req, rep) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await this.models.user.findOne({
      where: {
        email: email
      }
    });

    if(user === null) {
      return await rep.code(402).send(new APIError({
        source: { parameter: 'email' },
        title: 'Account Not Found',
        detail: 'No account exists associated with that email.'
      }));
    }

    const passwordValid = await bcrypt.compare(password, user.password.toString());

    if(passwordValid) {
      const token = await rep.jwtSign({
        id: user.id,
        email: user.email
      });

      const serializedUser = UserSerializer.serialize(user);
  
      await rep.setCookie('token', token, {
        path: '/',
        httpOnly: true,
        sameSite: true
      }).code(200).send(serializedUser);
    } else {
      await rep.code(402).send(new APIError({
        source: { parameter: 'password' },
        title: 'Incorrect Password',
        detail: 'The password provided was incorrect.'
      }));
    }
  }

  static async handleUserLogout(req, rep) {
    await rep.clearCookie('token', { path: '/' }).code(200).send();
  }

  static async handleUserSignUp(req, rep) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await this.models.user.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: passwordHash,
      administrator: false
    });

    const token = await rep.jwtSign({
      id: user.id,
      email: user.email
    });

    const serializedUser = UserSerializer.serialize(user);

    await rep.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      sameSite: true
    }).code(200).send(serializedUser);
  }

  static async handleGetUserProfile(req, rep) {
    const user = await this.models.user.findOne({
      where: {
        id: req.user.id,
        email: req.user.email
      }
    });

    const serializedUser = UserSerializer.serialize(user);
    await rep.send(serializedUser);
  }
}

module.exports = UserController;