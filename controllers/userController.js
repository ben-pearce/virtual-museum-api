const bcrypt = require('bcrypt');

const UserSerializer = require('../serializers/userSerializer');

const APIError = require('jsonapi-serializer').Error;

/**
 * User controller used for handling user authentication and registration.
 */
class UserController {

  /**
   * Handles user login.
   *
   * Retrieves user email and password from the request body.
   *
   * User details are queried from data store, submitted password is hashed and
   * compared with stored password.
   *
   * If authentication is successful json-web-token is set and 200 reply is
   * sent.
   *
   * If authentication is unsuccessful then response is 402 with error message.
   *
   * @param {fastify.Request} req Fastify request instance.
   * @param {fastify.Reply} rep Fastify reply instance.
   */
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

  /**
   * Handles user logout. 
   * 
   * json-web-token is cleared from client cookies.
   * 
   * @param {fastify.Request} req Fastify request instance.
   * @param {fastify.Reply} rep Fastify reply instance.
   */
  static async handleUserLogout(req, rep) {
    await rep.clearCookie('token', { path: '/' }).code(200).send();
  }

  /**
   * Handles user sign up.
   *
   * User credentials are retrieved from the request body and creates new user
   * model. Password is hashed and json-web-token is generated. Auth token is
   * set in cookie on response.
   *
   * @param {fastify.Request} req Fastify request instance.
   * @param {fastify.Reply} rep Fastify reply instance.
   */
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

  /**
   * Replies with user data for current user session.
   *
   * User email is retrieved from session and used to retrieve the data from
   * data store.
   *
   * @param {fastify.Request} req Fastify request instance.
   * @param {fastify.Reply} rep Fastify reply instance.
   */
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