/* eslint-disable default-case */
import db from './db';
/**
 * @exports Account
 *
 * @class Account
 */
class Account {
  /**
   *
   * Handles the storage of the details of a newly created bank account in the database
   * @static
   * @param {object} accountDetails details of the account to be newly saved
   * @param {number} userid id of the user creating the account
   * @returns {object} result of stored data in database
   * @memberof Account
   */
  static async create(accountDetails, userid) {
    const { type, avatar } = accountDetails;
    const accountnumber = Account.generateAccountNumber();
    const query = `insert into accounts(type,accountnumber,owner,avatar) values ($1,$2,$3,$4) returning *`;
    const { rows } = await db.query(query, [type, accountnumber, userid, avatar]);
    return rows[0];
  }

  /**
   *
   * Queries the database to find an account, using the provided account number
   * @static
   * @param {number} accountNumber
   * @returns {object} details of the found account
   * @memberof Account
   */
  static async findAccount(value, column) {
    const query = `select concat_ws(' ',firstname,lastname) as fullname, * from accounts inner join users on accounts.owner = users.id where ${column} = $1`;
    const { rows, rowCount } = await db.query(query, [value]);
    if (rowCount > 0) return rows[0];
    return false;
  }

  /**
   *
   * Handles the update of an account record in the database
   * @static
   * @param {number} accountNumber
   * @param {string} value new updated value
   * @param {string} column column to be updated
   * @memberof Account
   */
  static async update(accountNumber, value, column) {
    const query = `update accounts set ${column} = $1 where accountnumber = $2`;
    await db.query(query, [value, accountNumber]);
  }

  /**
   *
   * Handles the deletion of an account record in the database
   * @static
   * @param {number} accountNumber account number of account to be deleted
   * @returns {boolean}
   * @memberof Account
   */
  static async delete(accountNumber) {
    const query = `delete from accounts where accountnumber = $1`;
    const { rowCount } = await db.query(query, [accountNumber]);
    if (rowCount > 0) return true;
    return false;
  }

  /**
   *
   * Queries the account table for an account owner
   * @static
   * @param {number} accountNumber
   * @returns
   * @memberof Account
   */
  static async getAccountOwner(accountNumber) {
    const query = `select owner from accounts where accountnumber = $1`;
    const { rows, rowCount } = await db.query(query, [accountNumber]);
    if (rowCount > 0) return rows[0].owner;
    return false;
  }

  /**
   *
   * Queries the database for all accounts
   * @static
   * @returns {array|boolean} an array of all found accounts on the platform
   * @memberof Account
   */
  static async findAccounts(route, email) {
    let query;
    switch (route) {
      case 'all':
        query = `select concat_ws(' ',firstname,lastname) as fullname, avatar,createdon,accountnumber,email,accounts.type as type, status, balance 
                   from accounts 
                   inner join users on accounts.owner = users.id 
                   order by createdon desc limit 10`;
        break;
      case 'active':
      case 'dormant':
        query = `select concat_ws(' ',firstname,lastname) as fullname, avatar,createdon,accountnumber,email,accounts.type as type, status, balance 
                  from accounts 
                  inner join users on accounts.owner = users.id 
                  where status = '${route}'
                  order by createdon desc limit 10`;
        break;
      case 'user':
        query = `select concat_ws(' ',firstname,lastname) as fullname, avatar,createdon,accountnumber,email,accounts.type as type, status, balance 
                  from accounts 
                  inner join users on accounts.owner = users.id 
                  where email = '${email}'
                  order by createdon desc limit 10`;
    }

    const { rows, rowCount } = await db.query(query);
    if (rowCount > 0) return rows;
    return false;
  }

  /**
   *
   * finds the owner of an account using the provided account number
   * @static
   * @param {number} accountNumber
   * @returns {string} email of the account owner
   * @memberof Account
   */
  static async findAccountOwner(accountNumber) {
    const query = `select email, accountnumber from accounts inner join users
                    on accounts.owner = users.id where accountnumber = $1`;
    const { rows } = await db.query(query, [accountNumber]);
    return rows[0].email;
  }

  /**
   *
   * Generates a new account number
   * @static
   * @returns {number} Account number
   * @memberof Account
   */
  static generateAccountNumber() {
    let acctNumber = `102${Math.floor(Math.random() * 10000000)}`;
    if (acctNumber.length === 9) acctNumber += '0';
    return Number(acctNumber);
  }
}

export default Account;
