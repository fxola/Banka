import mockData from '../models/mockData';
import helper from '../helpers/helper';

/**
 *
 * @exports UserValidation
 * @class UserValidation
 */
class UserValidation {
  /**
   * Handles User input validation on sign up
   *
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {(function|Object)} function next() or an error response object
   * @memberof AccountValidation
   */
  static signUpCheck(req, res, next) {
    let { email, firstName, lastName, password, type } = req.body;

    let isEmpty;
    isEmpty = helper.checkFieldEmpty(firstName, 'firstname');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    isEmpty = helper.checkFieldEmpty(lastName, 'lastname');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    isEmpty = helper.checkFieldEmpty(email, 'email');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    isEmpty = helper.checkFieldEmpty(password, 'password');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    isEmpty = helper.checkFieldEmpty(type, 'user type');
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

    if (password) {
      password = password.trim();
    }

    let hasWhiteSpace;
    hasWhiteSpace = helper.checkFieldWhiteSpace(firstName, 'firstname');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    hasWhiteSpace = helper.checkFieldWhiteSpace(lastName, 'lastname');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    hasWhiteSpace = helper.checkFieldWhiteSpace(email, 'email');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    hasWhiteSpace = helper.checkFieldWhiteSpace(password, 'password');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    hasWhiteSpace = helper.checkFieldWhiteSpace(type, 'user type');
    if (hasWhiteSpace) return res.status(hasWhiteSpace.status).json(hasWhiteSpace);

    let isNotAlpha;
    isNotAlpha = helper.checkFieldAlpha(firstName, 'firstname');
    if (isNotAlpha) return res.status(isNotAlpha.status).json(isNotAlpha);

    isNotAlpha = helper.checkFieldAlpha(lastName, 'lastname');
    if (isNotAlpha) return res.status(isNotAlpha.status).json(isNotAlpha);

    isNotAlpha = helper.checkFieldAlpha(type, 'user type');
    if (isNotAlpha) return res.status(isNotAlpha.status).json(isNotAlpha);

    const passwordPattern = /\w{6,}/g;

    if (!passwordPattern.test(password)) {
      return res.status(406).json({
        status: 406,
        error: 'Invalid password provided',
        message: `Password must not be less than six(6) characters`,
        success: false
      });
    }

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

    /**
     *
     * Checks if an email address exists in the database
     * @static
     * @param {String} userEmail email to run a check against
     * @returns {Boolean} Boolean depending on success or failure of the check
     * @memberof UserValidation
     */
    const checkEMail = userEmail => {
      const existingEmails = mockData.users.reduce((emailArray, userDetail) => {
        return emailArray.concat(userDetail.email);
      }, []);
      return existingEmails.includes(userEmail);
    };

    const emailExists = checkEMail(email);

    if (emailExists) {
      return res.status(409).json({
        status: 409,
        error: 'Email already in use',
        message: 'Please provide a another email address',
        success: false
      });
    }

    req.body.firstName = firstName.replace(/\s/g, '');
    req.body.lastName = lastName.replace(/\s/g, '');
    req.body.password = password.replace(/\s/g, '');
    req.body.type = type.replace(/\s/g, '');
    req.body.email = email.replace(/\s/g, '');

    return next();
  }

  /**
   * Handles user input validation on log in
   *
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {(function|Object)} function next() or an error response object
   * @memberof AccountValidation
   */
  static loginCheck(req, res, next) {
    let { email, password } = req.body;

    let isEmpty;
    isEmpty = helper.checkFieldEmpty(email, 'email');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    isEmpty = helper.checkFieldEmpty(password, 'password');
    if (isEmpty) return res.status(isEmpty.status).json(isEmpty);

    if (email) {
      email = email.trim();
    }

    if (password) {
      password = password.trim();
    }
    req.body.email = email;
    req.body.password = password;
    return next();
  }
}

export default UserValidation;
