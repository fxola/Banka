/* eslint-disable default-case */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Account from '../models/AccountModel';

dotenv.config();

/**
 *
 * @exports
 * @class Helper
 */
class Helper {
  /**
   *
   * Generates token string
   * @static
   * @param {Object} userPayload Incoming payload required to generate token
   * @returns {String} A token string
   * @memberof Helper
   */
  static getToken(userPayload) {
    return jwt.sign(userPayload, process.env.SECRET, { expiresIn: '1h' });
  }

  /**
   *
   * Hashes a provided password
   * @static
   * @param {String} password password required to be encrypted
   * @returns {String} A hash string
   * @memberof Helper
   */
  static hashPassword(password) {
    const hash = bcrypt.hashSync(password, 10);
    return hash;
  }

  /**
   *
   * Compares a password against a hash
   * @static
   * @param {String} password password required to be encrypted
   * @param {String} hash data to be compared against
   * @returns {Boolean}
   * @memberof Helper
   */
  static comparePassword(password, hash) {
    const result = bcrypt.compareSync(password, hash);
    return result;
  }

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
        success: false,
        error: `Invalid ${field} provided`,
        message: `${field} cannot be empty`
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
        success: false,
        error: `Invalid ${field} provided`,
        message: `No whitespaces allowed in ${field}`
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
        success: false,
        error: `Invalid ${field} provided`,
        message: `${field} must be Alphabetical`
      };
    }
    return false;
  }

  /**
   *
   * Restricts access of specified route to account owners and staff users
   * @static
   * @param {number} accountNumber
   * @param {number} user user id
   * @param {string} userType currently logged in user type(client or staff)
   * @param {string} route route to guard
   * @returns {object|boolean} error object or boolean if check passes
   * @memberof AccountService
   */
  static async checkPermission(accountNumber, user, userType, route) {
    const owner = await Account.getAccountOwner(accountNumber);
    if (!owner) {
      return { status: 404, success: false, error: `Not Found`, message: `Account does not exist` };
    }

    let allowed = false;
    if (owner === user || userType === 'staff') {
      allowed = true;
    }

    let message;
    switch (route) {
      case 'transactions':
        message = `You don't have permission to view these transactions`;
        break;
      case 'transaction':
        message = `You don't have permission to view this transaction`;
        break;
      case 'account':
        message = `You don't have permission to view this account's details`;
        break;
    }

    if (!allowed) {
      return {
        status: 403,
        success: false,
        error: `Request forbidden`,
        message
      };
    }
    return false;
  }
}

export default Helper;
