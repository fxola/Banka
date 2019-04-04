class TransactionValidation {
  /**
   * Checks if input provided is empty
   *
   * @param {string} value value to be validated
   * @param {string} field field name of the value to be validated
   * @returns {object|boolean} error object or boolean
   */
  static checkFieldEmpty(value, field, res) {
    if (!value) {
      return res.status(422).json({
        status: 422,
        error: `Invalid ${field} provided`,
        message: `${field} cannot be empty`,
        success: false
      });
    }
    return false;
  }

  /**
   * Checks for whitespace on input provided
   *
   * @param {string} value value to be validated
   * @param {string} field field name of the value to be validated
   * @returns {object|boolean} error object or boolean
   */
  static checkFieldWhiteSpace(value, field, res) {
    if (/\s/.test(value)) {
      return res.status(422).json({
        status: 422,
        error: `Invalid ${field} provided`,
        message: `No whitespaces allowed in ${field}`,
        success: false
      });
    }
    return false;
  }

  /**
   * Checks if input provided is alphabetical
   *
   * @param {string} value value to be validated
   * @param {string} field field name of the value to be validated
   * @returns {object|boolean} error object or boolean
   */
  static checkFieldAlpha(value, field, res) {
    const pattern = /^[a-zA-Z]+$/;
    if (!pattern.test(value)) {
      return res.status(422).json({
        status: 422,
        error: `Invalid ${field} provided`,
        message: `${field} must be Alphabetical`,
        success: false
      });
    }
    return true;
  }

  /**
   * Handles user input validation on making debit or credit transactions
   *
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {(function|Object)} function next() or an error response object
   * @memberof AccountValidation
   */
  static transactionCheck(req, res, next) {
    let { amount, type } = req.body;

    TransactionValidation.checkFieldEmpty(amount, 'transaction amount', res);
    TransactionValidation.checkFieldEmpty(type, 'transaction type', res);

    if (amount && typeof amount === 'string') {
      amount = amount.trim();
    }
    if (type) {
      type = type.trim().toLowerCase();
    }

    TransactionValidation.checkFieldWhiteSpace(amount, 'transaction amount', res);
    TransactionValidation.checkFieldWhiteSpace(type, 'transaction type', res);

    TransactionValidation.checkFieldAlpha(type, 'transaction type', res);

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
        mesasage: `Transaction type can only be 'debit' or 'credit'`,
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
        mesasage: `Please confirm that the url matches the transaction type`,
        success: false
      });
    }

    req.body.amount = amount;
    req.body.type = type.replace(/\s/g, '');

    return next();
  }
}

export default TransactionValidation;
