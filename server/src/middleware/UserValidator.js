import User from '../models/UserModel';
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
   * @memberof UserValidation
   */
  static async signUpCheck(req, res, next) {
    let { email, firstName, lastName, password, confirmPassword } = req.body;

    const errors = UserValidation.inputCheck(email, firstName, lastName, password, confirmPassword);
    if (errors.length > 0) return res.status(errors[0].status).json(errors[0]);

    if (firstName) firstName = firstName.trim();
    if (lastName) lastName = lastName.trim();
    if (email) email = email.trim();
    if (password) password = password.trim();
    if (confirmPassword) confirmPassword = confirmPassword.trim();

    const passwordPattern = /\w{6,}/g;

    if (!passwordPattern.test(password)) {
      return res.status(406).json({
        status: 406,
        error: 'Invalid password provided',
        message: `Password must not be less than six(6) characters`,
        success: false
      });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({
        status: 422,
        error: 'Invalid password provided',
        message: `Passwords do not match`,
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

    const result = await User.findEmail(email);

    if (result > 0) {
      return res.status(409).json({
        status: 409,
        error: 'Email already in use',
        message: 'Please provide a another email address',
        success: false
      });
    }
    req.body.firstName = firstName;
    req.body.lastName = lastName;
    req.body.password = password;
    req.body.email = email;

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

    const errors = [];

    let isEmpty;
    isEmpty = helper.checkFieldEmpty(email, 'email');
    if (isEmpty) errors.push(isEmpty);

    isEmpty = helper.checkFieldEmpty(password, 'password');
    if (isEmpty) errors.push(isEmpty);

    if (errors.length > 0) return res.status(errors[0].status).json(errors[0]);

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

  /**
   *
   * Runs a check on the fields provided and returns appropriate errors if any
   * @static
   * @param {string} email
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} password
   * @param {string} type
   * @returns {Array} an array of error(s)
   * @memberof UserValidation
   */
  static inputCheck(email, firstName, lastName, password, confirmPassword) {
    const errors = [];
    let isEmpty;
    isEmpty = helper.checkFieldEmpty(firstName, 'firstName');
    if (isEmpty) errors.push(isEmpty);

    isEmpty = helper.checkFieldEmpty(lastName, 'lastName');
    if (isEmpty) errors.push(isEmpty);

    isEmpty = helper.checkFieldEmpty(email, 'email');
    if (isEmpty) errors.push(isEmpty);

    isEmpty = helper.checkFieldEmpty(password, 'password');
    if (isEmpty) errors.push(isEmpty);

    let hasWhiteSpace;
    hasWhiteSpace = helper.checkFieldWhiteSpace(firstName, 'firstname');
    if (hasWhiteSpace) errors.push(hasWhiteSpace);

    hasWhiteSpace = helper.checkFieldWhiteSpace(lastName, 'lastname');
    if (hasWhiteSpace) errors.push(hasWhiteSpace);

    hasWhiteSpace = helper.checkFieldWhiteSpace(email, 'email');
    if (hasWhiteSpace) errors.push(hasWhiteSpace);

    hasWhiteSpace = helper.checkFieldWhiteSpace(password, 'password');
    if (hasWhiteSpace) errors.push(hasWhiteSpace);

    let isNotAlpha;
    isNotAlpha = helper.checkFieldAlpha(firstName, 'firstName');
    if (isNotAlpha) errors.push(isNotAlpha);

    isNotAlpha = helper.checkFieldAlpha(lastName, 'lastName');
    if (isNotAlpha) errors.push(isNotAlpha);

    isEmpty = helper.checkFieldEmpty(confirmPassword, 'confirmPassword');
    if (isEmpty) errors.push(isEmpty);

    return errors;
  }
}

export default UserValidation;
