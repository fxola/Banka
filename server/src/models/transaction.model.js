/**
 * e@exports Transaction
 *
 * @class Transaction
 */
class Transaction {
  /**
   *Creates an instance of Transaction.
   * @param {integer} id
   * @param {string} createdOn
   * @param {string} type
   * @param {integer} accountNumber
   * @param {type} cashier
   * @param {float} amount
   * @param {float} oldBalance
   * @param {float} newBalance
   * @memberof Transaction
   */
  constructor(id, createdOn, type, accountNumber, cashier, amount, oldBalance, newBalance) {
    this.id = id;
    this.createdOn = createdOn;
    this.type = type;
    this.accountNumber = parseInt(accountNumber, 10);
    this.cashier = cashier;
    this.amount = parseFloat(amount).toFixed(2);
    this.oldBalance = parseFloat(oldBalance);
    this.newBalance = parseFloat(newBalance);
  }
}

export default Transaction;
