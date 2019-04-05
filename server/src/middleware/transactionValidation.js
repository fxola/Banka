class TransactionValidation {
  /**
   * Checks if input provided is empty
   *
   * @param {string} value value to be validated
   * @param {string} field field name of the value to be validated
   * @returns {object|boolean} error object or boolean
   */
  static checkFieldEmpty(value, field) {
    if (!value) {
      return {
        status: 422,
        error: `Invalid ${field} provided`,
        message: `${field} cannot be empty`,
        success: false
      };
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
  static checkFieldWhiteSpace(value, field) {
    if (/\s/.test(value)) {
      return {
        status: 422,
        error: `Invalid ${field} provided`,
        message: `No whitespaces allowed in ${field}`,
        success: false
      };
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
  static checkFieldAlpha(value, field) {
    const pattern = /^[a-zA-Z]+$/;
    if (!pattern.test(value)) {
      return {
        status: 422,
        error: `Invalid ${field} provided`,
        message: `${field} must be Alphabetical`,
        success: false
      };
    }
    return false;
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

    let isEmpty;
    isEmpty = TransactionValidation.checkFieldEmpty(amount, 'transaction amount');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    isEmpty = TransactionValidation.checkFieldEmpty(type, 'transaction type');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    if (amount && typeof amount === 'string') {
      amount = amount.trim();
    }
    if (type) {
      type = type.trim().toLowerCase();
    }

    let hasWhiteSpace;
    hasWhiteSpace = TransactionValidation.checkFieldWhiteSpace(amount, 'transaction amount');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    hasWhiteSpace = TransactionValidation.checkFieldWhiteSpace(type, 'transaction type');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    const isNotAlpha = TransactionValidation.checkFieldAlpha(type, 'transaction type', res);
    if (isNotAlpha) return res.status(isNotAlpha.status).json(isNotAlpha);

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
    req.body.type = type.replace(/\s/g, '');

    return next();
  }
}

export default TransactionValidation;
