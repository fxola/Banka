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
}

export default Transaction;
