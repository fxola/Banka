/* eslint-disable default-case */
import TransactionService from '../services/TransactionService';

/**
 * @exports TransactionController
 *
 * @class TransactionController
 */
class TransactionController {
  /**
   *
   * Handles the logic for making debit or credit transactions
   * @static
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} JSON API Response
   * @memberof TransactionController
   */
  static async makeTransaction(req, res, next) {
    try {
      const response = await TransactionService.makeTransaction(
        req.params.acctNumber,
        req.body.amount,
        req.userId,
        req.body.type
      );
      return res.status(response.status).json(response);
    } catch (e) {
      return next(e);
    }
  }

  /**
   *
   * Handles the logic for fetching a single transaction
   * @static
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} JSON API Response
   * @memberof TransactionController
   */
  static async fetchSingleTransaction(req, res, next) {
    try {
      const response = await TransactionService.fetchSingleTransaction(req.params.id);
      return res.status(response.status).json(response);
    } catch (e) {
      return next(e);
    }
  }
}

export default TransactionController;
