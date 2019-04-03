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
  static makeTransaction(req, res) {
    let urltype;
    if (req.url.endsWith('/credit')) {
      urltype = 'credit';
    }
    if (req.url.endsWith('/debit')) {
      urltype = 'debit';
    }

    const response = TransactionService.makeTransaction(
      req.params.acctNumber,
      req.body.amount,
      req.userId,
      req.body.type,
      urltype
    );
    return res.status(response.status).json(response);
  }
}

export default TransactionController;
