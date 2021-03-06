/* eslint-disable default-case */
import db from './db';
/**
 *
 *@exports
 * @class User
 */
class User {
  /**
   *
   * Handles the storage of the details of a newly created user in the database
   * @static
   * @param {object} newUser object containing new user details
   * @returns {object} result of stored data in database
   * @memberof User
   */
  static async create(newUser, userType) {
    const { email, firstName, lastName, hashedpassword } = newUser;
    let query;
    let result;
    switch (userType) {
      case 'staff':
        query = `insert into users(email,firstname,lastname,password,type) 
      VALUES ($1,$2,$3,$4,$5) returning *`;
        result = await db.query(query, [email, firstName, lastName, hashedpassword, 'staff']);
        break;
      case 'admin':
        query = `insert into users(email,firstname,lastname,password,type,isadmin) 
      VALUES ($1,$2,$3,$4,$5,$6) returning *`;
        result = await db.query(query, [email, firstName, lastName, hashedpassword, 'staff', true]);
        break;
      case 'user':
        query = `insert into users(email,firstname,lastname,password) 
      VALUES ($1,$2,$3,$4) returning *`;
        result = await db.query(query, [email, firstName, lastName, hashedpassword]);
    }
    return result.rows[0];
  }

  /**
   *
   * Queries the database to find a user, using the provided email address
   * @static
   * @param {string} email
   * @returns {object} details of the found user
   * @memberof User
   */
  static async findByEmail(email) {
    const query = `select * from users where email = $1`;
    const { rows, rowCount } = await db.query(query, [email]);
    if (rowCount > 0) return rows[0];
    return false;
  }

  /**
   *
   * Checks if email record exists in database
   * @static
   * @param {sting} email
   * @returns {number} the number of email record(s) found
   * @memberof User
   */
  static async findEmail(email) {
    const query = `select email from users where email = $1`;
    const { rowCount } = await db.query(query, [email]);
    return rowCount;
  }

  /**
   *
   * Handles the update of a user role in the database
   * @static
   * @param {number} accountNumber
   * @param {string} value new updated value
   * @param {string} column column to be updated
   * @memberof Account
   */
  static async updateRole(email, type) {
    const query = `update users set type = $1 where email = $2 returning *`;
    const { rows } = await db.query(query, [type, email]);
    return rows[0];
  }
}

export default User;
