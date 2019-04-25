import UserService from '../services/UserService';
import AccountService from '../services/AccountService';
import AccountModel from '../models/AccountModel';
import Helper from '../helpers/helper';
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
      const response = await UserService.createUser(req.body, 'user');
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
      const response = await UserService.makeStaff(req.body);
      return res.status(response.status).json(response);
    } catch (e) {
      return next(e);
    }
  }

  /**
   *
   * Handles logic for fetching accounts owned by a user
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {Object} JSON API Response
   * @memberof UserController
   */
  static async fetchUserAccounts(req, res, next) {
    try {
      const { email } = req.params;

      const isInvalid = Helper.validateEmail(email);
      if (isInvalid) return res.status(isInvalid.status).json(isInvalid);

      const { userId, userType } = req;

      // get user's account number using their email
      const { accountnumber } = await AccountModel.findAccount(email, 'email');

      // check if user has permisssion to access route
      const notAllowed = await Helper.checkPermission(accountnumber, userId, userType, 'user');
      if (notAllowed) return res.status(notAllowed.status).json(notAllowed);

      // return user's accounts
      const response = await AccountService.fetchAccounts(null, 'user', email);
      return res.status(response.status).json(response);
    } catch (e) {
      return next(e);
    }
  }
}

export default UserController;
