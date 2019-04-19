import UserService from '../services/UserService';
/**
 *@exports
 *
 * @class UserController
 */
class UserController {
  /**
   *
   *Handles the logic for creating a new user account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} JSON API Response
   * @memberof UserController
   */
  static async createUser(req, res, next) {
    try {
      const response = await UserService.createUser(req.body);
      return res.status(response.status).json(response);
    } catch (e) {
      return next(e);
    }
  }

  /**
   *
   * Logs a user in if valid credentials are provided
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} JSON API Response
   * @memberof UserController
   */
  static async logUserIn(req, res, next) {
    try {
      const response = await UserService.logUserIn(req.body);
      return res.status(response.status).json(response);
    } catch (e) {
      return next(e);
    }
  }

  /**
   *
   * Updates the role of a current user to a staff role
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} JSON API Response
   * @memberof UserController
   */
  static async makeStaff(req, res, next) {
    try {
      const response = await UserService.makeStaff(req.body.email);
      return res.status(response.status).json(response);
    } catch (e) {
      return next(e);
    }
  }
}

export default UserController;
