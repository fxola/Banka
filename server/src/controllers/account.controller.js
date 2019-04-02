import AccountService from '../services/account.service';

/**
 * @exports AccountController
 *
 * @class AccountController
 */
class AccountController {
  /**
   *
   * Handles the logic for creating a new bank account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} JSON API Response
   * @memberof AccountController
   */
  static createBankAccount(req, res) {
    const response = AccountService.createBankAccount(req.body, req.userEmail, req.userId);
    return res.status(response.status).json(response);
  }
}

export default AccountController;
