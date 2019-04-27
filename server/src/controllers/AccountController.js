/* eslint-disable prefer-destructuring */
/* eslint-disable default-case */
import AccountService from '../services/AccountService';

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
  static async createBankAccount(req, res, next) {
    try {
      const response = await AccountService.createBankAccount(req.body, req.userEmail, req.userId);
      return res.status(response.status).json(response);
    } catch (e) {
      return next(e);
    }
  }

  /**
   *
   * Handles the logic for activating or deactivating a bank account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} JSON API Response
   * @memberof AccountController
   */
  static async updateAccountStatus(req, res, next) {
    try {
      const response = await AccountService.updateAccountStatus(
        req.body.status,
        req.params.acctNumber
      );
      return res.status(response.status).json(response);
    } catch (e) {
      return next(e);
    }
  }

  /**
   *
   * Handles the logic for deleting a specific bank account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} JSON API Response
   * @memberof AccountController
   */
  static async deleteBankAccount(req, res, next) {
    try {
      const response = await AccountService.deleteBankAccount(req.params.acctNumber);
      return res.status(response.status).json(response);
    } catch (e) {
      return next(e);
    }
  }

  /**
   *
   * Handles the logic for fetching all transactions relating to an account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} JSON API Response
   * @memberof AccountController
   */
  static async fetchAllTransactions(req, res, next) {
    try {
      const response = await AccountService.fetchAllTransactions(
        req.params.acctNumber,
        req.userId,
        req.userType
      );
      return res.status(response.status).json(response);
    } catch (e) {
      return next(e);
    }
  }

  /**
   *
   * Handles the logic for fetching all accounts
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} JSON API Response
   * @memberof AccountController
   */
  static async fetchAccounts(req, res, next) {
    try {
      let status;
      let route;

      switch (Object.keys(req.query).length > 0) {
        case true:
          switch (req.query.status) {
            case 'active':
              status = req.query.status;
              route = 'active';
              break;
            case 'dormant':
              status = req.query.status;
              route = 'dormant';
              break;
            default:
              status = 'invalid';
              break;
          }
          break;
        case false:
          route = 'all';
          break;
      }
      const response = await AccountService.fetchAccounts(status, route);
      return res.status(response.status).json(response);
    } catch (e) {
      return next(e);
    }
  }

  /**
   *
   * Handles the logic for fetching a single account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} JSON API Response
   * @memberof AccountController
   */
  static async fetchOneAccount(req, res, next) {
    try {
      const response = await AccountService.fetchOneAccount(req.params.acctNumber);
      return res.status(response.status).json(response);
    } catch (e) {
      return next(e);
    }
  }
}

export default AccountController;
