import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
    const hash = bcrypt.hashSync(password, 10, (err, result) => {
      if (err) {
        return err;
      }
      return result;
    });
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
}

export default Helper;
