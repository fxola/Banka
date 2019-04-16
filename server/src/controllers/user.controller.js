import UserService from '../services/user.service';
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
  static createUser(req, res) {
    const response = UserService.createUser(req.body);
    return res.status(response.status).json(response);
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
  static logUserIn(req, res) {
    const response = UserService.logUserIn(req.body);
    return res.status(response.status).json(response);
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
  static makeStaff(req, res) {
    const response = UserService.makeStaff(req.body.email);
    return res.status(response.status).json(response);
  }
}

export default UserController;
