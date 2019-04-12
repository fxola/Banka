import helper from '../helpers/helper';

class TransactionValidation {
  /**
   * Handles user input validation on making debit or credit transactions
   *
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {(function|Object)} function next() or an error response object
   * @memberof TransactionValidation
   */
  static transactionCheck(req, res, next) {
    let { amount, type } = req.body;

    const errors = TransactionValidation.inputCheck(amount, type);
    if (errors.length > 0) return res.status(errors[0].status).json(errors[0]);

    if (amount && typeof amount === 'string') {
      amount = amount.trim();
    }
    if (type) {
      type = type.trim().toLowerCase();
    }

    if (!Number(amount)) {
      return res.status(403).json({
        status: 403,
        error: `Request Forbidden`,
        message: `Transaction amount must be a number`,
        success: false
      });
    }

    if (Number(amount) < 500) {
      return res.status(403).json({
        status: 403,
        error: `Request Forbidden`,
        message: `You can only make debit/credit transactions above 500 Naira`,
        success: false
      });
    }

    let transactionType;
    switch (type) {
      case 'credit':
        transactionType = type;
        break;
      case 'debit':
        transactionType = type;
        break;
      default:
        transactionType = 'invalid';
    }

    if (transactionType === 'invalid') {
      return res.status(403).json({
        status: 403,
        error: `request forbidden`,
        message: `Transaction type can only be 'debit' or 'credit'`,
        success: false
      });
    }

    let urltype;
    if (req.url.endsWith('/credit')) {
      urltype = 'credit';
    }
    if (req.url.endsWith('/debit')) {
      urltype = 'debit';
    }

    if (urltype !== type) {
      return res.status(403).json({
        status: 403,
        error: `Request forbidden`,
        message: `Please confirm that the url matches the transaction type`,
        success: false
      });
    }

    req.body.amount = amount;
    req.body.type = type;

    return next();
  }

  /**
   *
   * Runs a check on the fields provided and returns appropriate errors if any
   * @static
   * @param {number} amount
   * @param {string} type
   * @returns {Array} an array of error(s)
   * @memberof TransactionValidation
   */
  static inputCheck(amount, type) {
    const errors = [];
    let isEmpty;
    isEmpty = helper.checkFieldEmpty(amount, 'transaction amount');
    if (isEmpty) errors.push(isEmpty);

    isEmpty = helper.checkFieldEmpty(type, 'transaction type');
    if (isEmpty) errors.push(isEmpty);

    let hasWhiteSpace;
    hasWhiteSpace = helper.checkFieldWhiteSpace(amount, 'transaction amount');
    if (hasWhiteSpace) errors.push(hasWhiteSpace);

    hasWhiteSpace = helper.checkFieldWhiteSpace(type, 'transaction type');
    if (hasWhiteSpace) errors.push(hasWhiteSpace);

    const isNotAlpha = helper.checkFieldAlpha(type, 'transaction type');
    if (isNotAlpha) errors.push(isNotAlpha);

    return errors;
  }
}

export default TransactionValidation;
