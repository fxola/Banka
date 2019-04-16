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
      req.userType = decoded.type;
      req.isAdmin = decoded.isAdmin;

      return next();
    } catch (e) {
      return res.status(401).send({
        status: 401,
        error: `${e.name}. ${e.message}`
      });
    }
  }

  /**
   *
   * Checks if the current user is a staff or not and applies appropriate access control
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {(function|Object)} Function next() or an error Object
   * @memberof Auth
   */
  static staffCheck(req, res, next) {
    if (req.userType !== 'staff') {
      return res.status(401).json({
        status: 401,
        success: false,
        error: `You are not Authorized to perform this Action`
      });
    }
    return next();
  }

  /**
   *
   * Checks if the current user is an admin or not and applies appropriate access control
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {(function|Object)} Function next() or an error Object
   * @memberof Auth
   */
  static adminCheck(req, res, next) {
    if (req.isAdmin !== true) {
      return res.status(401).json({
        status: 401,
        success: false,
        error: `You are not Authorized to perform this Action`
      });
    }
    return next();
  }
}

export default Auth;
