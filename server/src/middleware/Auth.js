import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

/**
 *
 *@exports
 * @class Auth
 */
class Auth {
  /**
   *
   * Handles Authorization and determines who is currently logged in if authorization is successful
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} Function next() or an error Object
   * @memberof Auth
   */
  static getUser(req, res, next) {
    try {
      if (!req.headers.authorization) throw new Error('You do not have access to this page');
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SECRET);

      req.userId = decoded.id;
      req.userEmail = decoded.email;
      req.userFirstName = decoded.firstName;
      req.userLastName = decoded.lastName;

      return next();
    } catch (e) {
      return res.status(401).send({
        status: 401,
        error: `${e.name}. ${e.message}`
      });
    }
  }
}

export default Auth;
