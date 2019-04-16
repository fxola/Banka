import helper from '../helpers/helper';
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
        success: false,
        error: `Request forbidden`,
        message: `Account Number must be a Number`
      });
    }

    if (!acctNumber.startsWith(102) || acctNumber.length !== 10) {
      return res.status(403).json({
        status: 403,
        success: false,
        error: `Request Forbidden`,
        message: `Account Number must be 10 digits and begin with the digits 102`
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
    const errors = [];
    const isEmpty = helper.checkFieldEmpty(status, 'status');
    if (isEmpty) errors.push(isEmpty);

    const hasWhiteSpace = helper.checkFieldWhiteSpace(status, 'status');
    if (hasWhiteSpace) errors.push(hasWhiteSpace);

    const isNotAlpha = helper.checkFieldAlpha(status, 'status');
    if (isNotAlpha) errors.push(isNotAlpha);

    if (errors.length > 0) {
      return res.status(errors[0].status).json(errors[0]);
    }

    if (status) {
      status = status.trim();
    }

    req.body.status = status.toLowerCase();
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

    const errors = AccountValidation.inputCheck(firstName, lastName, email, type);
    if (errors.length > 0) {
      return res.status(errors[0].status).json(errors[0]);
    }

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

    // cited from stackoverflow
    // eslint-disable-next-line no-useless-escape
    const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailPattern.test(email)) {
      return res.status(422).json({
        status: 422,
        success: false,
        error: 'Invalid email address',
        message: 'Please provide a valid email address'
      });
    }

    req.body.firstName = firstName;
    req.body.lastName = lastName;
    req.body.type = type;
    req.body.email = email;

    return next();
  }

  /**
   *
   * Runs a check on the fields provided and returns appropriate errors if any
   * @static
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} email
   * @param {string} type
   * @returns {Array} an array of error(s)
   * @memberof AccountValidation
   */
  static inputCheck(firstName, lastName, email, type) {
    const errors = [];
    let isEmpty;
    isEmpty = helper.checkFieldEmpty(firstName, 'firstName');
    if (isEmpty) errors.push(isEmpty);

    isEmpty = helper.checkFieldEmpty(lastName, 'lastName');
    if (isEmpty) errors.push(isEmpty);

    isEmpty = helper.checkFieldEmpty(email, 'email');
    if (isEmpty) errors.push(isEmpty);

    isEmpty = helper.checkFieldEmpty(type, 'account type');
    if (isEmpty) errors.push(isEmpty);

    let hasWhiteSpace;
    hasWhiteSpace = helper.checkFieldWhiteSpace(firstName, 'firstName');
    if (hasWhiteSpace) errors.push(hasWhiteSpace);

    hasWhiteSpace = helper.checkFieldWhiteSpace(lastName, 'lastName');
    if (hasWhiteSpace) errors.push(hasWhiteSpace);

    hasWhiteSpace = helper.checkFieldWhiteSpace(email, 'email');
    if (hasWhiteSpace) errors.push(hasWhiteSpace);

    hasWhiteSpace = helper.checkFieldWhiteSpace(type, 'account type');
    if (hasWhiteSpace) errors.push(hasWhiteSpace);

    let isNotAlpha;
    isNotAlpha = helper.checkFieldAlpha(firstName, 'firstName');
    if (isNotAlpha) errors.push(isNotAlpha);

    isNotAlpha = helper.checkFieldAlpha(lastName, 'lastName');
    if (isNotAlpha) errors.push(isNotAlpha);

    isNotAlpha = helper.checkFieldAlpha(type, 'account type');
    if (isNotAlpha) errors.push(isNotAlpha);

    return errors;
  }
}

export default AccountValidation;
