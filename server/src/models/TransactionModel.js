import db from './db';
/**
 * e@exports Transaction
 *
 * @class Transaction
 */
class Transaction {
  /**
   *
   * Handles the storage of the newly created transaction in the database
   * @static
   * @param {object} transactionDetails details of the newly created transaction
   * @returns {object} result of stored data in database
   * @memberof Transaction
   */
  static async create(transactionDetails) {
    const {
      transactionType,
      accountNumber,
      cashier,
      amount,
      oldBalance,
      newBalance
    } = transactionDetails;

    const query = `insert into transactions (type,accountnumber,cashier,amount,oldbalance,newbalance)
                              values($1,$2,$3,$4,$5,$6) returning *`;

    const { rows } = await db.query(query, [
      transactionType,
      accountNumber,
      cashier,
      amount,
      oldBalance,
      newBalance
    ]);

    return rows[0];
  }

  /**
   *
   * Queries the database for a single transaction
   * @static
   * @param {number} accountNumber
   * @param {number} id
   * @returns {object|boolean} result of found transaction
   * @memberof Transaction
   */
  static async findOneTransaction(id) {
    const query = `select * from transactions where id =$1`;
    const { rows, rowCount } = await db.query(query, [id]);
    if (rowCount > 0) return rows[0];
    return false;
  }

  /**
   *
   * Queries the database for all transactions related to an account
   * @static
   * @param {number} accountNumber
   * @returns {array|boolean} array of transactions found or boolean if not found
   * @memberof Transaction
   */
  static async findAllTransactions(accountNumber) {
    const query = `select * from transactions where accountnumber = $1`;
    const { rows, rowCount } = await db.query(query, [accountNumber]);
    if (rowCount > 0) return rows;
    return false;
  }
}

export default Transaction;
