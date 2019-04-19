/* eslint-disable default-case */
import TransactionService from '../services/transaction.service';

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
    if (!Number(req.params.id)) {
      return res.status(403).json({
        status: 403,
        success: false,
        error: `Request Forbidden`,
        message: `Transaction ID must be a number`
      });
    }
    try {
      const response = await TransactionService.fetchSingleTransaction(
        req.params.id,
        req.userId,
        req.userType
      );
      return res.status(response.status).json(response);
    } catch (e) {
      return next(e);
    }
  }
}

export default TransactionController;
