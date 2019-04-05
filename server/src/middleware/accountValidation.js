/**
 *
 * @exports AccountValidation
 * @class AccountValidation
 */
class AccountValidation {
  /**
   * Handles Account number validation
   *
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {(function|Object)} function next() or an error response object
   * @memberof AccountValidation
   */
  static accountNumberCheck(req, res, next) {
    const { acctNumber } = req.params;

    if (!Number(acctNumber)) {
      return res.status(403).json({
        status: 403,
        error: `Request forbidden`,
        message: `Account Number must be a Number`,
        success: false
      });
    }

    if (!acctNumber.startsWith(102) || acctNumber.length !== 10) {
      return res.status(403).json({
        status: 403,
        error: `Request Forbidden`,
        message: `Account Number must be 10 digits and begin with the digits 102`,
        success: false
      });
    }

    return next();
  }

  /**
   * Handles user input validation on update of account status
   *
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {(function|Object)} function next() or an error response object
   * @memberof AccountValidation
   */
  static accountStatusCheck(req, res, next) {
    let { status } = req.body;

    if (!status) {
      return res.status(422).json({
        status: 422,
        error: `Invalid status provided`,
        message: `Status can not be empty`,
        success: false
      });
    }

    if (status) {
      status = status.trim();
    }

    if (/\s/.test(status)) {
      return res.status(422).json({
        status: 422,
        error: `Invalid status provided`,
        message: `No whitespaces allowed in status`,
        success: false
      });
    }

    const pattern = /^[a-zA-Z]+$/;
    if (!pattern.test(status))
      return res.status(422).json({
        status: 422,
        error: `Invalid status provided`,
        message: `Status must be alphabetical`,
        success: false
      });

    req.body.status = status.replace(/\s/g, '').toLowerCase();
    return next();
  }

  /**
   * Handles User input validation on creating a new account
   *
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {(function|Object)} function next() or an error response object
   * @memberof AccountValidation
   */
  static accountDetailsCheck(req, res, next) {
    let { firstName, lastName, email, type } = req.body;

    /**
     * Checks if input provided is empty
     *
     * @param {string} value value to be validated
     * @param {string} field field name of the value to be validated
     * @returns
     */
    const checkFieldEmpty = (value, field) => {
      if (!value) {
        return {
          status: 422,
          error: `Invalid ${field} provided`,
          message: `${field} cannot be empty`,
          success: false
        };
      }
      return false;
    };

    let isEmpty;
    isEmpty = checkFieldEmpty(firstName, 'firstname');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    isEmpty = checkFieldEmpty(lastName, 'lastname');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    isEmpty = checkFieldEmpty(email, 'email');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    isEmpty = checkFieldEmpty(type, 'account type');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    if (firstName) {
      firstName = firstName.trim();
    }
    if (lastName) {
      lastName = lastName.trim();
    }
    if (type) {
      type = type.trim();
    }
    if (email) {
      email = email.trim();
    }

    /**
     * Checks for whitespace on input provided
     *
     * @param {string} value value to be validated
     * @param {string} field field name of the value to be validated
     * @returns
     */
    const checkFieldWhiteSpace = (value, field) => {
      if (/\s/.test(value)) {
        return res.status(422).json({
          status: 422,
          error: `Invalid ${field} provided`,
          message: `No whitespaces allowed in ${field}`,
          success: false
        });
      }
      return false;
    };

    let hasWhiteSpace;
    hasWhiteSpace = checkFieldWhiteSpace(firstName, 'firstname');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    hasWhiteSpace = checkFieldWhiteSpace(lastName, 'lastname');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    hasWhiteSpace = checkFieldWhiteSpace(email, 'email');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    hasWhiteSpace = checkFieldWhiteSpace(type, 'account type');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    /**
     * Checks if input provided is alphabetical
     *
     * @param {string} value value to be validated
     * @param {string} field field name of the value to be validated
     * @returns
     */
    const checkFieldAlpha = (value, field) => {
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
    };

    let isNotAlpha;
    isNotAlpha = checkFieldAlpha(firstName, 'firstname');
    if (isNotAlpha) return res.status(isNotAlpha.status).json(isNotAlpha);

    isNotAlpha = checkFieldAlpha(lastName, 'lastname');
    if (isNotAlpha) return res.status(isNotAlpha.status).json(isNotAlpha);

    isNotAlpha = checkFieldAlpha(type, 'account type');
    if (isNotAlpha) return res.status(isNotAlpha.status).json(isNotAlpha);

    // cited from stackoverflow
    // eslint-disable-next-line no-useless-escape
    const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailPattern.test(email)) {
      return res.status(422).json({
        status: 422,
        error: 'Invalid email address',
        message: 'Please provide a valid email address',
        success: false
      });
    }

    req.body.firstName = firstName.replace(/\s/g, '');
    req.body.lastName = lastName.replace(/\s/g, '');
    req.body.type = type.replace(/\s/g, '');
    req.body.email = email.replace(/\s/g, '');

    return next();
  }
}

export default AccountValidation;
