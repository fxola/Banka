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

    const isEmpty = helper.checkFieldEmpty(status, 'status');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    if (status) {
      status = status.trim();
    }

    const hasWhiteSpace = helper.checkFieldWhiteSpace(status, 'status');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    const isNotAlpha = helper.checkFieldAlpha(status, 'status');
    if (isNotAlpha) return res.status(isNotAlpha.status).json(isNotAlpha);

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

    let isEmpty;
    isEmpty = helper.checkFieldEmpty(firstName, 'firstname');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    isEmpty = helper.checkFieldEmpty(lastName, 'lastname');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    isEmpty = helper.checkFieldEmpty(email, 'email');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    isEmpty = helper.checkFieldEmpty(type, 'account type');
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

    let hasWhiteSpace;
    hasWhiteSpace = helper.checkFieldWhiteSpace(firstName, 'firstname');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    hasWhiteSpace = helper.checkFieldWhiteSpace(lastName, 'lastname');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    hasWhiteSpace = helper.checkFieldWhiteSpace(email, 'email');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    hasWhiteSpace = helper.checkFieldWhiteSpace(type, 'account type');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    let isNotAlpha;
    isNotAlpha = helper.checkFieldAlpha(firstName, 'firstname');
    if (isNotAlpha) return res.status(isNotAlpha.status).json(isNotAlpha);

    isNotAlpha = helper.checkFieldAlpha(lastName, 'lastname');
    if (isNotAlpha) return res.status(isNotAlpha.status).json(isNotAlpha);

    isNotAlpha = helper.checkFieldAlpha(type, 'account type');
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

    req.body.firstName = firstName;
    req.body.lastName = lastName;
    req.body.type = type;
    req.body.email = email;

    return next();
  }
}

export default AccountValidation;
